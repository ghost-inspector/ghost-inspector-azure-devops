## Ghost Inspector Extension for Azure DevOps

Build status: ![build status](https://circleci.com/gh/ghost-inspector/ghost-inspector-azure-devops.svg?style=shield&circle-token=05c5ca3ba409f6a6766a455a2aae6811b822003e)

With this plugin you can add a build step to your Azure DevOps project that executes a Ghost Inspector test suite. If the test suite is successful, your pipeline will continue to the next step in your pipeline; however, if it fails (or times out), the build will be marked as failed.

## Installation

This plugin can be installed from within the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ghost-inspector.ghost-inspector-vsts-extension).

## Prerequisites

- **API Key** - This is a unique, private key provided with your account which allows you to access the API. You can find it in your Ghost Inspector account settings at https://app.ghostinspector.com/account.
- **Suite ID** - The ID of the Ghost Inspector suite that you would like to execute.

## Usage

1. Install the extension from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ghost-inspector.ghost-inspector-vsts-extension).
1. Open your project within Azure DevOps and navigate to **Builds**.
1. In the **Tasks** section, click the `+` icon to add a new task.
1. To find the extension in the list quickly, type `Ghost` in the search box and select **Add**.
1. Click on the new task and fill in the required fields for **Suite ID** and **API Key**.
1. If you would like to run your Ghost Inspector tests on a URL other than their default setting (such as a local build instance of your application using a tunnel), enter the start URL in the **Start URL** field.
1. If you would like to pass other [custom parameters](https://ghostinspector.com/docs/api/suites/#execute) or [variables](https://ghostinspector.com/docs/variables/) to your suite run, specify them in the **Additional Parameters** field using JSON (eg: `{"browser":"chrome", "myVar":"some value"}`).
1. Save and queue your project.

# Development

The extension is written in TypeScript. Between changes, you can run the tests with `npm test` in the `run-suite-task` directory.

# Building & testing the extension

To start, make sure you have the Azure DevOps extension CLI:

```
$ npm install -g tfx-cli
```

## The Dev Loop™

In order to test the extension you will need to use the `vss-extension-dev.json` manifest to build and upload a private version of the plugin. Make sure once you've created the new dev version you share it with your target organization.

### 1. Update version
To make a change, modify the version numbers in these three files. For the dev version they can be pretty much anything, as long as the version currently doesn't exist:

- [vss-extension.json](./vss-extension.json)
- [run-suite-task/package.json](run-suite-task/package.json)
- [run-suite-task/task.json](run-suite-task/task.json)

### 2. Compile

Transpile and then build the plugin:
```js
cd run-task-suite
npm run prepare 
cd ..
tfx extension create --manifests vss-extension-dev.json
```

The development version of the extension should now be in the project root under `ghost-inspector.ghost-inspector-vsts-extension-dev-<version>.vsix`.

### 3. Upload/update plugin

Now in [the Marketplace interface](https://marketplace.visualstudio.com/manage/publishers/ghost-inspector) select the dev version of the plugin and upload the new version (or create it if it doesn't exist).

You will need to repeat this process for each code change you would like to test.

# Publishing the plugin

Now that new changes are ready to go, once again change the version number in the appropriate files to the next release:

- [vss-extension.json](./vss-extension.json)
- [run-suite-task/package.json](run-suite-task/package.json)
- [run-suite-task/task.json](run-suite-task/task.json)



Now recompile and rebuild the plugin:

```
cd run-task-suite
npm run prepare 
cd ..
tfx extension create
```

The extension should now be in the project root under `ghost-inspector.ghost-inspector-vsts-extension-<version>.vsix`.

## Publishing to Azure Devops Marketplace

If you're not already, sign into Azure Devops Marketplace, then navigate to _Publish Extensions_. Click on _Update_ in the dropdown beside the Ghost Inspector plugin version, and drag the new `.vsix` file onto the upload area and click _Upload_.

## Issues

Please report any issues [on Github](https://github.com/ghost-inspector/ghost-inspector-azure-devops/issues) or [through our support channel](https://ghostinspector.com/support/).

## Change Log

- 2021-06-23 - `1.1.0`: Added xUnit report support.
- 2021-03-14 - `1.0.16`: Dependency updates and new icon.
- 2020-11-18 - `1.0.14`: Add support for data sources responses.
- 2020-10-27 - `1.0.13`: Improve logging around failed execution responses.
- 2020-04-21 - `1.0.12`: Adds `vso.release_execute` scope.
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
