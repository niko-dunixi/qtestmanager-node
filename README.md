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

var mobq = new MobQ(qTestUrl);

mobq.setToken(qTestAPIToken);
mobq.setProjectId(qTestProjectId);

mobq.newTestRun().inCycle(cycleId).forTest(testId).submit();
mobq.newTestRun().inSuite(suiteId).forTest(testId).submit();
mobq.newTestRun().inRelease(releaseId).forTest(testId).submit();
```


