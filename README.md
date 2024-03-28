<p align="center">
  <img src="https://img.icons8.com/external-tal-revivo-regular-tal-revivo/96/external-readme-is-a-easy-to-build-a-developer-hub-that-adapts-to-the-user-logo-regular-tal-revivo.png" width="100" />
</p>
<p align="center">
    <h1 align="center">BLOG-V1</h1>
</p>
<p align="center">
    <em>The "static-site-cdk" repository contains code and infrastructure as code (IAC) for deploying a static website on AWS using Vite for the frontend and AWS CDK for infrastructure setup. It integrates continuous deployment with GitHub Actions.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/elvisbrevi/blog-v1?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/elvisbrevi/blog-v1?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/elvisbrevi/blog-v1?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/elvisbrevi/blog-v1?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/Jest-C21325.svg?style=flat&logo=Jest&logoColor=white" alt="Jest">
	<img src="https://img.shields.io/badge/Preact-673AB8.svg?style=flat&logo=Preact&logoColor=white" alt="Preact">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
	<br>
	<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style=flat&logo=ts-node&logoColor=white" alt="tsnode">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>
<hr>

##  Quick Links

> - [ Overview](#-overview)
> - [ Stack](#-stack)
> - [ Repository Structure](#-repository-structure)
> - [ Modules](#-modules)
> - [ Getting Started](#-getting-started)
>   - [ Installation](#-installation)
>   - [ Running blog-v1](#-running-blog-v1)
>   - [ Tests](#-tests)
> - [ Project Roadmap](#-project-roadmap)
> - [ Contributing](#-contributing)
> - [ License](#-license)
> - [ Acknowledgments](#-acknowledgments)

---

##  Overview

This repository contains the source code and infrastructure configuration for my personal blog, Elvis Brevi. The blog is a static website hosted on AWS services and deployed using Continuous Integration and Continuous Deployment (CI/CD) pipelines with GitHub Actions. The "static-site-cdk" repository contains the source code and infrastructure as code (IAC) used to create and deploy a static website using AWS free-tier services and continuous integration/continuous deployment (CI/CD) practices with GitHub Actions. It includes:

Static Frontend with Vite: A static website developed with Vite, utilizing Preact and TypeScript for modern and efficient development.

Infrastructure with AWS CDK: Utilizes AWS Cloud Development Kit (CDK) to define the necessary infrastructure on AWS, including an S3 bucket for hosting the static site, CloudFront distribution for optimized content delivery, SSL/TLS certificate for security, and DNS routing via Route53.

This repository provides a complete solution for automating the creation, deployment, and management of a static blog, leveraging infrastructure as code and continuous integration capabilities.

---

## Stack

- **Frontend Technology**: Vite (with Preact and TypeScript) for creating the static website.
- **Infrastructure as Code (IAC)**: AWS Cloud Development Kit (CDK) for defining and deploying AWS resources.
- **AWS Services**: S3 Bucket, CloudFront, Route53, AWS Certificate Manager.
- **Continuous Integration/Continuous Deployment (CI/CD)**: GitHub Actions for automating deployments.

---

##  Repository Structure

```sh
└── blog-v1/
    ├── .github
    │   └── workflows
    │       ├── deploy-client.yml
    │       └── deploy-infra.yml
    ├── README.md
    ├── client
    │   ├── .gitignore
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   │   ├── css
    │   │   │   ├── bootstrap-icons.css
    │   │   │   ├── bootstrap.min.css
    │   │   │   ├── fancybox.css
    │   │   │   └── panda-syntax-dark.min.css
    │   │   ├── images
    │   │   │   ├── android-chrome-192x192.png
    │   │   │   ├── android-chrome-512x512.png
    │   │   │   ├── apple-touch-icon.png
    │   │   │   ├── favicon-16x16.png
    │   │   │   ├── favicon-32x32.png
    │   │   │   ├── favicon.ico
    │   │   │   └── site.webmanifest
    │   │   └── js
    │   │       ├── bootstrap.bundle.min.js
    │   │       ├── clipboard.min.js
    │   │       ├── fancybox.umd.js
    │   │       └── highlight.min.js
    │   ├── src
    │   │   ├── app.css
    │   │   ├── app.tsx
    │   │   ├── components
    │   │   │   ├── header
    │   │   │   │   ├── header.css
    │   │   │   │   └── header.tsx
    │   │   │   ├── loading
    │   │   │   │   ├── loading.css
    │   │   │   │   └── loading.tsx
    │   │   │   ├── post-body
    │   │   │   │   ├── post-body.css
    │   │   │   │   └── post-body.tsx
    │   │   │   ├── post-list
    │   │   │   │   ├── post-list.css
    │   │   │   │   └── post-list.tsx
    │   │   │   └── socials-links
    │   │   │       ├── social-links.css
    │   │   │       └── social-links.tsx
    │   │   ├── index.css
    │   │   ├── interfaces
    │   │   │   └── PostData.ts
    │   │   ├── main.tsx
    │   │   ├── pages
    │   │   │   ├── about
    │   │   │   │   ├── about.css
    │   │   │   │   └── about.tsx
    │   │   │   ├── blog
    │   │   │   │   └── blog.tsx
    │   │   │   └── post
    │   │   │       ├── post.css
    │   │   │       └── post.tsx
    │   │   └── vite-env.d.ts
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    ├── infra
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── README.md
    │   ├── bin
    │   │   └── infra.ts
    │   ├── cdk.context.json
    │   ├── cdk.json
    │   ├── jest.config.js
    │   ├── lib
    │   │   └── client-stack.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── test
    │   │   └── infra.test.ts
    │   └── tsconfig.json
    └── package-lock.json
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                     | Summary                                                                                                                                                                                                                                                                              |
| ---                                                                                      | ---                                                                                                                                                                                                                                                                                  |
| [package-lock.json](https://github.com/elvisbrevi/blog-v1/blob/master/package-lock.json) | This is a repository for a blog application. It's built with a client-side module containing a public directory for client-side assets like CSS stylesheets and images. It also includes workflows for deploying the client and infrastructure, enhancing automated CI/CD processes. |

</details>

<details closed><summary>client</summary>

| File                                                                                              | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---                                                                                               | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [tsconfig.json](https://github.com/elvisbrevi/blog-v1/blob/master/client/tsconfig.json)           | This repository structure illustrates a blog project, primarily focusing on the client-side. The repository has automated deployment workflows and leverages various CSS libraries for styling. A key feature is the use of various image assets for smooth cross-platform compatibility. The overall functionality achieved here is ensuring the smooth, automated, and efficient operation of a blog platform.                                                           |
| [index.html](https://github.com/elvisbrevi/blog-v1/blob/master/client/index.html)                 | This repository holds a version 1 blog application. The architecture primarily comprises GitHub workflows for deployment, and a client subdirectory with the necessary assets and packages for the front-end interface. It contains scripts, styling (CSS files), and image resources ensuring a comprehensive user interface. Given the workflows and client files, this codebase is designed to support continuous deployment and interface development for a blog site. |
| [vite.config.ts](https://github.com/elvisbrevi/blog-v1/blob/master/client/vite.config.ts)         | The repository is for a blog application (blog-v1) with its front-end client. Besides the automated deployment scripts (.github/workflows), it contains a client directory with web assets. The code emphasizes front-end functionality, primarily handling the blog's aesthetics and user interface, utilizing various CSS stylesheets and providing different icons for multiple platforms.                                                                              |
| [package.json](https://github.com/elvisbrevi/blog-v1/blob/master/client/package.json)             | This codebase is for a blog application. The main elements include a client-side for rendering the user interface and workflows for deploying both the client and the infrastructure. The client-side utilizes packages and static assets for design enhancement while the workflows automate deployment tasks.                                                                                                                                                            |
| [tsconfig.node.json](https://github.com/elvisbrevi/blog-v1/blob/master/client/tsconfig.node.json) | This code demonstrates the directory structure of a blog application, blog-v1. At its core, it contains two main parts: backend infrastructure and client-side code. The.github section handles GitHub workflows for deploying both elements. The client portion includes various essential frontend files such as HTML index, package details, and public resources like CSS stylesheets and images.                                                                      |
| [package-lock.json](https://github.com/elvisbrevi/blog-v1/blob/master/client/package-lock.json)   | The provided code snippet reveals the structure for a blogging platform's repository. Predominantly, it reflects the separation of concerns between the client and infrastructural components, using workflows for respective deployment processes. Moreover, it includes UI features with embedded support for Bootstrap CSS, improving the platform's visual appeal.                                                                                                     |

</details>

<details closed><summary>client.public.css</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [fancybox.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/css/fancybox.css)                           | This codebase represents the structure of a blogging platform blog-v1. The repository is divided into two main parts: the client-side and GitHub workflows. The client-side is responsible for the end-user interface components, including HTML, CSS, and other static resources. The GitHub workflows part takes care of the automated deployment processes. In essence, it ensures the efficient functioning of the user interface and continuous deployment of the application. |
| [panda-syntax-dark.min.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/css/panda-syntax-dark.min.css) | This snippet delineates the `blog-v1` repository's structure, crucial for a blogging platform. The repository is divided into two primary parts: `.github` managing the deployment workflow and `client` handling the front-end features. The `client` folder houses all static files, stylesheets, images, and package-related files required to build the blog application's interface.                                                                                           |
| [bootstrap-icons.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/css/bootstrap-icons.css)             | This code snippet details the file structure of a blogging platform, blog-v1. The structure includes the client-side and server-side files. Critical features include deployment workflows via GitHub actions, frontend files like HTML and CSS, and package setting files for dependencies management.                                                                                                                                                                             |
| [bootstrap.min.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/css/bootstrap.min.css)                 | This code snippet represents the root folder structure of a blog application, blog-v1. It highlights the different elements, including the GitHub workflows for deployment, the client-side code with its associated assets like CSS and images and some configuration files. The structure implies the codebase uses automated deployment and is a web-based application. There's a clear separation of concerns, enhancing readability and maintainability of the codebase.       |

</details>

<details closed><summary>client.public.images</summary>

| File                                                                                                        | Summary                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                         | ---                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [site.webmanifest](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/images/site.webmanifest) | This code indicates a repository structure for version 1 of a blog. The root directory contains workflows for deployment. Inside the client folder, various frontend files and modules are stored, including HTML, CSS, and image assets. The structure implies a system built with continuous integration and deployment. The client-side architecture indicates a web-based interface likely built with package-managed libraries. |

</details>

<details closed><summary>client.public.js</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                                                                                                                                                 |
| [highlight.min.js](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/js/highlight.min.js)               | This snippet features the structure of a blog's repository, which includes automated workflow files for deploying the client and infrastructure. The client's interface is built with bootstrapped CSS and contains specific stylings. The repository structure presents an organized, modular way of handling the front-end part of the blog application.          |
| [clipboard.min.js](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/js/clipboard.min.js)               | This code provides a brief structural overview of a blog application's repository. The client-related materials, which contains all necessary HTML, CSS, and JavaScript files, are placed in a dedicated folder. Automated deployment workflows are also included to deploy the client application and infrastructure effectively.                                  |
| [fancybox.umd.js](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/js/fancybox.umd.js)                 | This code outlines the structure of a blogging platform (blog-v1) repository. It consists of configurations for Continuous Integration/Continuous Deployment (CI/CD) workflows via GitHub Actions, and client-side resources including HTML, CSS, and JavaScript files. Its key role is to facilitate web deployment and maintain the blog's UI design effectively. |
| [bootstrap.bundle.min.js](https://github.com/elvisbrevi/blog-v1/blob/master/client/public/js/bootstrap.bundle.min.js) | The given codebase repository represents a blog application's client-side structure constructed in a maintainable way. It includes a deployment workflow described by GitHub actions and package dependencies outlined in package.json. It further encompasses public resources like CSS stylesheets and image assets for ensuring a well-designed user interface.  |

</details>

<details closed><summary>client.src</summary>

| File                                                                                        | Summary                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                         | ---                                                                                                                                                                                                                                                                                                                                                                                                              |
| [app.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/app.tsx)             | This code represents the structure of a blog application. It includes workflows for deploying the client and infrastructure. The client side contains assets like CSS stylesheets, images, and the entry file index.html. The overall architecture implies a CI/CD setup with a focus on frontend web development.                                                                                               |
| [app.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/app.css)             | This snippet is a minimalist CSS file, `app.css`, present in the main Client application of the blog repository. The code sets padding around the primary content of all the website pages in the blog application, contributing to the overall formatting, look, and feel of the website.                                                                                                                       |
| [main.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/main.tsx)           | This repository details the structure for a blog website version 1 (blog-v1). Primarily, it consists of two prominent sections-the client interface and the deployment workflows. The client section houses files for the website's user interface, including HTML, CSS, and JavaScript files. The deployment section carries automation scripts managing the infrastructure and client-side deployment.         |
| [vite-env.d.ts](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/vite-env.d.ts) | This code snippet relates to the client module of a blogging platform. It injects Vite environment types into the project, ensuring type safety and autocompletion for Vite-specific env variables within the client-side TypeScript code. This aligns with the repository's modular structure and focus on typed JavaScript.                                                                                    |
| [index.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/index.css)         | This code snippet outlines the structure of a blog-like application, focusing on the client-side. The client-side, developed using a package-based architecture, holds all assets, from HTML, JSON files, to various CSS stylesheets for different display features. The repository also consists of automated deployment workflows under the.github/workflows directory for streamlined development operations. |

</details>

<details closed><summary>client.src.interfaces</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [PostData.ts](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/interfaces/PostData.ts) | The code snippet illustrates the structure of a blog application. It encompasses a client rendering side, with key front-end resources like HTML, CSS, and JavaScript files. It also includes GitHub workflow scripts, outlining automated processes for deploying both the client and infrastructure. The project's layout helps ensure efficient resource organization, ease of deployment, and client-side performance. |

</details>

<details closed><summary>client.src.pages.post</summary>

| File                                                                                         | Summary                                                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                          | ---                                                                                                                                                                                                                                                                                                                                                                                   |
| [post.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/pages/post/post.tsx) | This repository contains the codebase for a blog platform (blog-v1). It handles client-side functionalities including website rendering and theming, utilizing CSS files for styling. The GitHub actions represented provide automated workflows for deploying the client and infrastructure changes.                                                                                 |
| [post.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/pages/post/post.css) | This code seems to depict the structure of a blog web application, specifically focusing on the client-side. It includes the infrastructure and client deployment workflows, housed under.github. The client folder contains the main HTML file, necessary packages, and public assets like CSS stylesheets and images, crucial for the blog's visual presentation and functionality. |

</details>

<details closed><summary>client.src.pages.blog</summary>

| File                                                                                         | Summary                                                                                                                                                                                                                                                                |
| ---                                                                                          | ---                                                                                                                                                                                                                                                                    |
| [blog.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/pages/blog/blog.tsx) | This code outlines the structure of a blog application repository. It includes the client-side layout with several CSS stylesheets and image assets for varied platforms. Furthermore, it introduces Github workflows for deploying client and infrastructure changes. |

</details>

<details closed><summary>client.src.pages.about</summary>

| File                                                                                            | Summary                                                                                                                                                                                                                                                                                                         |
| ---                                                                                             | ---                                                                                                                                                                                                                                                                                                             |
| [about.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/pages/about/about.css) | This repository primarily focuses on the construction of a blog. The client directory contains elements of the user interface like HTML, CSS assets, icons, and package management files. Meanwhile, the.github/workflows directory holds workflow files for deploying the client interface and infrastructure. |
| [about.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/pages/about/about.tsx) | This codebase is structured for a blog website, encompassing a client-side with associated resources. The client folder contains the front-end code, including an index file, package metadata, and public assets like CSS and images. Two workflows control the deployment of the client and infrastructure.   |

</details>

<details closed><summary>client.src.components.post-body</summary>

| File                                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                              | ---                                                                                                                                                                                                                                                                                                                                                  |
| [post-body.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/post-body/post-body.tsx) | The codebase represents a blogging platform with automated deployment workflows. The client folder contains front-end assets like HTML, CSS, and images, while GitHub actions handle deployment processes. Primarily, it allows writing, updating, and deploying blog posts with associated styling and images.                                      |
| [post-body.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/post-body/post-body.css) | This code snippet is part of the blog's client-side, responsible for defining the styling and layout of the blog post body. It contributes to the overall look and feel of each blog post, enhancing readability and user experience. This is integral to the blog's front-end structure, directly impacting how blog content is presented to users. |

</details>

<details closed><summary>client.src.components.post-list</summary>

| File                                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                              | ---                                                                                                                                                                                                                                                                                                                                                                                                               |
| [post-list.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/post-list/post-list.tsx) | This codebase is for a blog application with a client-server architecture. The client side of the application, built with a JavaScript library or framework like React.js, is hosted in the client directory, which contains configuration files, core application files, and assets like images and stylesheets. Furthermore, automated deployment is handled through GitHub Workflow files in.github/workflows. |
| [post-list.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/post-list/post-list.css) | This code snippet illustrates the structure of a repository for a blog application. The folder comprises a front-end client, handled by common web development dependencies, complemented by GitHub workflows for deployment. Style and icon assets are located under the public directory.                                                                                                                       |

</details>

<details closed><summary>client.src.components.header</summary>

| File                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                     | ---                                                                                                                                                                                                                                                                                                                                                                     |
| [header.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/header/header.tsx) | This repository operates a blog setup deployed through GitHub workflows. The client directory contains necessary frontend assets including CSS and images. The deployment pipelines, deploy-client.yml and deploy-infra.yml, work in tandem to implement the application and infrastructure, making sure the blog is live.                                              |
| [header.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/header/header.css) | This is the structure of a blog application. The codebase is divided into two main parts: client-side code and deployment workflows located in `.github/workflows`. Client code includes HTML and CSS files, with package configurations and third-party libraries' styles. The Github workflows are for deploying both client interface and underlying infrastructure. |

</details>

<details closed><summary>client.src.components.socials-links</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [social-links.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/socials-links/social-links.tsx) | This repository is primarily built for a blog application with a client-side functionality. The main repositories are structured for client-side deployment using continuous integration and deployment workflows, specifying the action sequences for deploying the client and infrastructure. The client folder contains all resources needed for the front-end, including HTML, CSS, images, and necessary configurations. |
| [social-links.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/socials-links/social-links.css) | This repository pertains to a blog application with a focus on its client-side setup. It has configuration for automated deployment via CI/CD workflows, and the client directory contains essential files for the frontend, including package management files, HTML file, CSS for UI styling, and images for icons and logos. These together create a visually appealing, user-friendly interface for the blog.             |

</details>

<details closed><summary>client.src.components.loading</summary>

| File                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [loading.tsx](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/loading/loading.tsx) | This codebase organizes a blog website, divided into client and deployment workflow sections. Within the repository's structure, the client encompasses all content necessary for the blog's front-end, including the entry point (index.html), stylesheets, package handling files, and relevant imagery. The.github portion features workflows for automatically deploying infrastructural updates and the blog's client-side elements. |
| [loading.css](https://github.com/elvisbrevi/blog-v1/blob/master/client/src/components/loading/loading.css) | This code lays out the structure of the blog-v1 repository, which is primarily focused on deploying a blog client. Key features include automated workflows for client deployment and infrastructure setup. The client folder contains necessary files and configurations for the front-end user interface, including styling and theming resources.                                                                                      |

</details>

<details closed><summary>infra</summary>

| File                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                     |
| [cdk.json](https://github.com/elvisbrevi/blog-v1/blob/master/infra/cdk.json)                   | This code highlights the structure of a blog-based application repository. It shows the presence of workflows for deployment, as well as a client folder containing various frontend resources such as HTML, CSS, and images. This outlines the overall architecture of the blog, revealing a separation between infrastructure, deployment, and client-facing aspects. |
| [tsconfig.json](https://github.com/elvisbrevi/blog-v1/blob/master/infra/tsconfig.json)         | This repository is for blog-v1, a blogging platform. It comprises GitHub workflows for client and infrastructure deployment, frontend resources within the client folder including stylesheets, images, and the main HTML file. These components collectively achieve seamless blog rendering and deployment.                                                           |
| [cdk.context.json](https://github.com/elvisbrevi/blog-v1/blob/master/infra/cdk.context.json)   | The code represents the structure of a blogging platform blog-v1. It appears to use a workflow for deploying infrastructure and client components. The client directory contains resources for front-end tasks, including HTML and CSS files, along with images and icons for interface design and branding.                                                            |
| [package.json](https://github.com/elvisbrevi/blog-v1/blob/master/infra/package.json)           | This repository contains a blogging platform blog-v1. It uses a frontend, held in the client folder, designed with commonly-used packages like bootstrap for UI, fancybox for lightbox scripts and panda-syntax-dark for syntax highlighting. Automated deployment workflows for both the client and infrastructure are defined in.github/workflows.                    |
| [jest.config.js](https://github.com/elvisbrevi/blog-v1/blob/master/infra/jest.config.js)       | This repository is built for the blog-v1 project. It maintains automated deployment workflows, and also holds client-side files, including the HTML index, node package definitions, and public assets such as CSS stylesheets and images utilised across the blog.                                                                                                     |
| [package-lock.json](https://github.com/elvisbrevi/blog-v1/blob/master/infra/package-lock.json) | The code is a directory for a version 1 blog application. Crucial files coordinate deployment workflows (.github folder) and operate the client-side interface (client's index.html, package.json). The application's style is managed with CSS files in the public directory.                                                                                          |

</details>

<details closed><summary>infra.bin</summary>

| File                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                              | ---                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [infra.ts](https://github.com/elvisbrevi/blog-v1/blob/master/infra/bin/infra.ts) | This code snippet details the structure of a blogging platform-blog-v1. The application has two main components: a web client and the associated deployment workflows. The client is primarily built with HTML and JavaScript, styled using CSS themes including bootstrap. It also contains image assets for webpage design. The workflows are responsible for deploying both the client-side user interface and the underlying infrastructure. |

</details>

<details closed><summary>infra.test</summary>

| File                                                                                        | Summary                                                                                                                                                                                                                                                                                                                       |
| ---                                                                                         | ---                                                                                                                                                                                                                                                                                                                           |
| [infra.test.ts](https://github.com/elvisbrevi/blog-v1/blob/master/infra/test/infra.test.ts) | This code indicates the structure of a blog application, primarily containing client-side components. It's set up for automated GitHub deployments, with the blog's static assets, like HTML, CSS, JavaScript, and images, hosted under client. The code helps with the visual aspects, styling, and UI elements of the blog. |

</details>

<details closed><summary>infra.lib</summary>

| File                                                                                           | Summary                                                                                                                                                                                                                                                                                                                      |
| ---                                                                                            | ---                                                                                                                                                                                                                                                                                                                          |
| [client-stack.ts](https://github.com/elvisbrevi/blog-v1/blob/master/infra/lib/client-stack.ts) | This repository represents the structure of a versioned blogging platform. It details the client-side aspect, containing HTML, CSS, and JS files for front-end presentation, as well as associated image and icon assets. Also, it stores workflows for GitHub Actions used to deploy the client and infrastructure updates. |

</details>

<details closed><summary>.github.workflows</summary>

| File                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                      |
| ---                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                          |
| [deploy-infra.yml](https://github.com/elvisbrevi/blog-v1/blob/master/.github/workflows/deploy-infra.yml)   | This code snippet represents a GitHub Actions workflow configured for deploying the infrastructure of a blog platform. It's part of the blog's CI/CD processes, which sit in the.github/workflows directory. This file specifically manages the deployment of resources like servers and databases, crucial for the operation of the blog.   |
| [deploy-client.yml](https://github.com/elvisbrevi/blog-v1/blob/master/.github/workflows/deploy-client.yml) | The deploy-client.yml is an essential part of the repository's CI/CD pipeline. Its chief role is to automatically facilitate the deployment process of the client-side application, which primarily includes React components, whenever changes are pushed to the repository. This enhances productivity and ensures consistent deployments. |

</details>

---

##  Getting Started

***Requirements***

Ensure you have the following dependencies installed on your system:

* **CSS**: `version x.y.z`

###  Installation

1. Clone the blog-v1 repository:

```sh
git clone https://github.com/elvisbrevi/blog-v1
```

2. Change to the project directory:

```sh
cd blog-v1
```

3. Install the dependencies:

```sh
> INSERT-INSTALL-COMMANDS
```

###  Running blog-v1

Use the following command to run blog-v1:

```sh
> INSERT-RUN-COMMANDS
```

###  Tests

To execute tests, run:

```sh
> INSERT-TEST-COMMANDS
```

---

##  Project Roadmap

- [X] `► INSERT-TASK-1`
- [ ] `► INSERT-TASK-2`
- [ ] `► ...`

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/elvisbrevi/blog-v1/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/elvisbrevi/blog-v1/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/elvisbrevi/blog-v1/issues)**: Submit bugs found or log feature requests for Blog-v1.

<details closed>
    <summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone https://github.com/elvisbrevi/blog-v1
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

##  License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

[**Return**](#-quick-links)

---
