import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3'; 
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53'; 
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

const DOMAIN_NAME = "elvisbrevi.com";
const WWW_DOMAIN_NAME = `www.${DOMAIN_NAME}`;

export class BlogStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket
    const staticWebsiteBucket = new s3.Bucket(this, `BlogWebsiteBucket-${id}`, {
      bucketName: DOMAIN_NAME,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    // Hosted zone for the domain
    const hostedZone = route53.HostedZone.fromLookup(
      this, `HostedZone`, { domainName: DOMAIN_NAME }
    );

    // Create the HTTPS certificate
    const httpsCertificate = new acm.Certificate(this, `BlogHttpsCertificate-${id}`, {
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

    // Create the CloudFront distribution
    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, `BlogCloudFrontDistribution-${id}`, {
      defaultRootObject: 'index.html',
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(httpsCertificate, {
        aliases: [DOMAIN_NAME, WWW_DOMAIN_NAME]
      }),
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: staticWebsiteBucket
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            }
          ]
        }
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responsePagePath: '/index.html',
          responseCode: 200,
          errorCachingMinTtl: 60
        }
      ]
    });

    // Add the CloudFront distribution ID to the origin access control
    const cfnDistribution = cloudFrontDistribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', oac.getAtt('Id'))

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
    new route53.ARecord(this, `BlogCloudFrontRedirect-${id}`, {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      recordName: DOMAIN_NAME
    });
    
    // Same from www.sub-domain
    new route53.ARecord(this, `BlogCloudFrontWWWRedirect-${id}`, {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
        recordName: WWW_DOMAIN_NAME
    });

    // Deploy the website
    new s3deploy.BucketDeployment(this, `BlogBucketDeployment-${id}`, {
      sources: [s3deploy.Source.asset('../client/dist')], 
      destinationBucket: staticWebsiteBucket,
      distributionPaths: ['/*'], 
      distribution: cloudFrontDistribution
    });

  }
}
     