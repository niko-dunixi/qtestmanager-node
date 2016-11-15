# mobq
NPM package for consuming the qTest API


## Installation
`npm install --save mobq`

## Usage

### Setup
To setup `mobq` you need your qTest project id, and an API token (found in the qTest resources section)

1. Include `mobq` in your project: `var MobQ = require('mobq').default` or `import { MobQ } from 'mobq'`
2. Initialize mobq with your qTest url `var mobQ = new MobQ(url)`
3. Provide `mobq` with your token and project id `mobq.setToken(token)`, `mobq.setProjectId(id)`

### Finding Test Runs
`mobq` provides various methods of finding specific Test Runs. The test run ID is needed to create new Test Logs (executions)
1. Get an instance of the test run finder `var finder = mobq.getFinder()`
2. Find a test run by id (note: this returns a promise) `finder.findById(id)`

### Creating a new Automation Test Log
`mobq` uses chaining to simplify the creation of Test Logs
Example: `mobq.newTestLog().name(nameOfTestRun).status(executionStatus).testRunId(id).automationContent(content).submit()`
In this example `submit()` is the only method that returns something that's not chainable. 


