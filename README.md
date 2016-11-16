# mobq
NPM package for consuming the qTest API


## Installation
`npm install --save mobq`

## Usage
Currently, `mobq` can only create new test runs for your existing test cases.
More features are soon to follow!

### Example
```javascript
var MobQ = require('mobq').default;

var mobq = new MobQ(
	"https://mobiquity.qtestnet.com",
	32495,
	"bW9iaXF1aXR5fGNweWxlQG1vYmlxdWl0eWluYy5jb206MTUxMDQyMDIyNjc5ODpiOWI4OTgwYjMzNDBhZDM4ODRiNGE0NzkxNjcwMGQyYQ"
	);

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
```

Note: If `withStepStatus(...)` is used, it must be used for all steps.
If it's never called, the test execution will not show any steps.


