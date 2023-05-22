import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3'; 
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53'; 
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

const DOMAIN_NAME = "elvisbrevi.com";
const WWW_DOMAIN_NAME = `www.${DOMAIN_NAME}`;

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket
    const staticWebsiteBucket = new s3.Bucket(this, `WebsiteBucket-${id}`, {
      bucketName: DOMAIN_NAME,
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    // Hosted zone for the domain
    const hostedZone = route53.HostedZone.fromLookup(
      this, `HostedZone`, { domainName: DOMAIN_NAME }
    );

    // Create the HTTPS certificate
    const httpsCertificate = new acm.Certificate(this, `HttpsCertificate-${id}`, {
      domainName: DOMAIN_NAME,
      subjectAlternativeNames: [WWW_DOMAIN_NAME],
      validation: acm.CertificateValidation.fromDns(hostedZone),
      certificateName: `Certificate-${id}`,
    });

    // Create the CloudFront origin access control
    const oac = new cloudfront.CfnOriginAccessControl(this, `BlogOriginAccessControl-${id}`, {
      originAccessControlConfig: {
        name: `BlogCfnOriginAccessControl`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    // Create the CloudFront distribution linked to the website hosting bucket and the HTTPS certificate
    const cloudFrontDistribution = new cloudfront.Distribution(this, `CloudFrontDistribution-${id}`, {
        defaultRootObject: 'index.html',
        defaultBehavior: {
            origin: new S3Origin(staticWebsiteBucket, {
              originId: oac.attrId,
              
            }),
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        domainNames: [DOMAIN_NAME, WWW_DOMAIN_NAME],
        certificate: httpsCertificate,
        errorResponses: [
            {
                httpStatus: 404,
                responseHttpStatus: 200,
                responsePagePath: '/index.html',
                ttl: cdk.Duration.minutes(1)
            }
          ],
    });

    cloudFrontDistribution.node.children.forEach(child => {
      if (child instanceof cloudfront.CfnOriginAccessControl) {
        child.addPropertyOverride('DistributionConfig.Origins.0.OriginId', oac.attrId);
        child.addPropertyOverride('DistributionConfig.DefaultCacheBehavior.TargetOriginId', oac.attrId);
      }
    });

    // Bucket policy to allow CloudFront to read the object
    staticWebsiteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        principals: [new cdk.aws_iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'], 
        resources: [`${staticWebsiteBucket.bucketArn}/*`],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${ cdk.Aws.ACCOUNT_ID }:distribution/${cloudFrontDistribution.distributionId}`
          },
        }
      })
    );

    // Add DNS records to the hosted zone to redirect from the domain name to the CloudFront distribution
    new route53.ARecord(this, `CloudFrontRedirect-${id}`, {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      recordName: DOMAIN_NAME
    });
    
    // Same from www.sub-domain
    new route53.ARecord(this, `CloudFrontWWWRedirect-${id}`, {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
        recordName: WWW_DOMAIN_NAME
    });

    // Deploy the website
    new s3deploy.BucketDeployment(this, `BucketDeployment-${id}`, {
      sources: [s3deploy.Source.asset('../client/dist')], 
      destinationBucket: staticWebsiteBucket,
      distributionPaths: ['/*'], 
      distribution: cloudFrontDistribution
    });

  }
}
