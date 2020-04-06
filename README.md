Ghost Inspector Extension for Azure DevOps
-------------

Build status: ![build status](https://circleci.com/gh/ghost-inspector/ghost-inspector-azure-devops.svg?style=shield&circle-token=05c5ca3ba409f6a6766a455a2aae6811b822003e)

With this plugin you can add a build step to your Azure DevOps project that executes a Ghost Inspector test suite. If the test suite is successful, your pipeline will continue to the next step in your pipeline; however, if it fails (or times out), the build will be marked as failed.

## Installation
This plugin can be installed from within the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ghost-inspector.ghost-inspector-vsts-extension).

## Prerequisites
* **API Key** - This is a unique, private key provided with your account which allows you to access the API. You can find it in your Ghost Inspector account settings at https://app.ghostinspector.com/account.
* **Suite ID** - The ID of the Ghost Inspector suite that you would like to execute.
 
## Usage
1. Install the extension from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ghost-inspector.ghost-inspector-vsts-extension).
1. Open your project within Azure DevOps and navigate to **Builds**.
2. In the **Tasks** section, click the ```+``` icon to add a new task.
3. To find the extension in the list quickly, type `Ghost` in the search box and select **Add**.
4. Click on the new task and fill in the required fields for **Suite ID** and **API Key**.
4. If you would like to run your Ghost Inspector tests on a URL other than their default setting (such as a local build instance of your application using a tunnel), enter the start URL in the **Start URL** field.
5. If you would like to pass other [custom parameters](https://ghostinspector.com/docs/api/suites/#execute) or [variables](https://ghostinspector.com/docs/variables/) to your suite run, specify them in the **Additional Parameters** field using JSON (eg: `{"browser":"chrome", "myVar":"some value"}`).
6. Save and queue your project.

# Development
The extension is written in TypeScript. Between changes, you can run the tests with `npm test` in the `run-suite-task` directory.

# Building the extension
Make sure you have transpiled the latest TypeScript to JavaScript in the `run-suite-task` directory:

```
$ npm run transpile
```

Make sure you have the Azure DevOps extension CLI:

```
$ npm install -g tfx-cli
```

You will need to increment the appropriate version number before you can build and publish this extension:

 * [vss-extension.json](./vss-extension.json)
 * [run-suite-task/package.json](run-suite-task/package.json)
 * [run-suite-task/task.json](run-suite-task/task.json)


Create the extension with this command:
```
$ tfx extension create
```

The extension should now be in the project root under `ghost-inspector.ghost-inspector-vsts-extension-<version>.vsix`.

## Publishing to Azure Devops Marketplace

First you will need to sign into Azure Devops Marketplace, then navigate to *Publish Extensions*. Click on *Update* in the dropdown beside the Ghost Inspector plugin version, and drag the new `.vsix` file onto the upload area and click *Upload*.

## Issues
Please report any issues [on Github](https://github.com/ghost-inspector/ghost-inspector-azure-devops/issues) or [through our support channel](https://ghostinspector.com/support/).

## Change Log
 - 2020-04-06 - `1.0.11`: Rebundles package, `1.0.10` was missing `*.js` files and would not execute.
 - 2020-04-06 - `1.0.10`: Depdendency updates
 - 2020-01-28 - `1.0.9`: Rebundles package, `1.0.8` was missing `*.js` files and would not execute.
 - 2020-01-27 - `1.0.8`: Updates references in docs from "VSTS" to "Azure DevOps"
 - 2019-09-19 - `1.0.7`: Obscure exposed API key in suite execute call, update dependencies
 - 2019-05-01 - `1.0.6`: Updates `axios` to address vulnerability
 - 2018-07-18 - `1.0.5`: Add compatibility for TFS2017 (node `v5.x`/`ES5`)
 - 2018-04-03 - `1.0.4`: Fix `parameters` typo
 - 2018-03-15 - `1.0.2`: Add CI config and public build status
 - 2018-03-13 - `1.0.1`: Patch to fix not passing startUrl
 - 2018-02-26 - `1.0.0`: Initial release
