import { TestRun } from './TestRun';


export class TestExecution {

	constructor(driver) {
		this.driver = driver;
		this.testRun = new TestRun(driver);
	}

	inCycle(cycleId) {
		this.testRun.inCycle(cycleId);
		return this;
	}

	inSuite(suiteId) {
		this.testRun.inSuite(suiteId);
		return this;
	}

	inRelease(releaseId) {
		this.testRun.inRelease(releaseId);
		return this;
	}

	forTest(testId) {
		this.testRun.forTest(testId);
		return this;
	}

	withStatus(status) {
		this.status = status;
		return this;
	}

	submit() {
		this.testRun.submit((testRun) => {
			this._createTestExecution(testRun.id);
		});
	}

	_createTestExecution(runId) {
		console.log("CREATED TEST EXECUTION FOR: " + runId);
	}

}

