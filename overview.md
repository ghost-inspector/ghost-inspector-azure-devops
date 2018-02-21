# Getting started with Ghost Inspector
Ghost Inspector is an automated website testing and monitoring service that checks for problems with your website or application. It carries out operations in a browser, the same way a user would, to ensure that everything is working properly.

Check out our [Getting Started](https://ghostinspector.com/docs/getting-started/) page for more information.

# Key Features
Ghost Inspector is a powerful tool in your QA arsenal to ensure that your websites and application are behaving as expected.

Some of our [key features](https://ghostinspector.com/learn-more/):

 * [Painlessly record tests in your browser](https://ghostinspector.com/docs/test-recorder/) using our browser extension.
 * [Build and manage your tests with our Visual Editor](https://ghostinspector.com/docs/test-editor/).
 * [Monitor the functionality of your website or application](https://ghostinspector.com/docs/test-schedule/) on a schedule or on demand.
 * [Catch and review Visual Regressions](https://ghostinspector.com/docs/comparing-screenshots/) with our screenshot comparison tool.
 * [Customize and override test settings](https://ghostinspector.com/docs/test-settings/) in advance or at runtime.
 * [Notify your team](https://ghostinspector.com/docs/notification/) when things haven't gone as expected.

# Trigger tests from your VSTS build
Adding Ghost Inspector test suite execution to your VSTS build is as simple as adding a new Ghost Inspector task.
Once the task has been added, you have the ability to customize your build step:

 * **Suite ID**: specify the ID of the Ghost Inspector test suite you wish to execute.
 * **API Key**: provide your Ghost Inspector API key ([provided in your account](https://app.ghostinspector.com/account)).
 * **Start URL** (optional): provide the [alternative URL of your test environment](https://ghostinspector.com/docs/reusing-tests-different-environments/) to execute your test against.
 * **Additional Parameters** (optional): additionally provide [any other API paramaters](https://ghostinspector.com/docs/api/tests/#execute) or [custom variables](https://ghostinspector.com/docs/variables/) in JSON format (eg, `{"browser": "chrome", "myVar": "some value"}`).
 