# mobq
NPM package for consuming the qTest API


## Installation
`npm install --save mobq`

## Updates
### 1.2
* THIS UPDATE WILL BREAK YOUR IMPLEMENTATION
* Replaced API token in contructor with a login() method
* Removed projectId from contructor, the `mobq` constructor only requires the host now
* added a logout() method; qTest caps your number of sessions, needed a way to prevent that from happening, logout was needed anyways
* added a setProjectId() method
* updated how the driver is sent to the TestRun and TestExection objects to compensate for login changes


### 1.1.7
* Change the default timeout to 10 seconds instead of 1

### 1.1.6
* Add `addAttachment(name, contentType, base64String)` to allow uploading attachments to test execution

### 1.1.5
* Choose a suite and a test case, and mobq will automatically create a test run and execute it
* Updated the submit calls for test runs and test executions to return promises instead of wrestling callbacks


### Example
```javascript
var MobQ = require('mobq').default;

var mobq = new MobQ("https://host.qtestnet.com");
mobq.setProjectId(projectId);

// Credentials is a JSON object
// with two properties: username, password
// It returns a promise
mobq.login(credentials).then((response) => {

	// Create a new test run a cycle, suite, or release for a specific test case
	mobq.newTestRun().inCycle(cycleId).forTest(testId).submit();
	mobq.newTestRun().inSuite(suiteId).forTest(testId).submit();
	mobq.newTestRun().inRelease(releaseId).forTest(testId).submit();


	// Create a new execution for a test run
	mobq.newTestExecution()
		.inSuite(515894)
		.forTest(5470717)
		.withStatus("PASS")
		.withStepStatus(1, "PASS") // optional
		.withStepStatus(2, "FAIL")
		.submit();

}).catch((error) => {
	console.log(error);
})
```

Notes: 
If `withStepStatus(...)` is used, it must be used for all steps,
otherwise the test execution will fail.
If it's never called, the test execution will show all steps as 'UNDEFINED'.

Make sure all of your test submissions have resovled before calling `mobq.logout()`


