import { TestRun } from './TestRun';
import { Finder } from './Finder';

export class TestExecution {

	constructor(driver) {
		this.driver = driver;
		this.testRun = new TestRun(driver);
		this.ignoreSteps = true;
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

	withStepStatus(step, status) {
		this.ignoreSteps = false;
		this.stepLogs = this.stepLogs || [];
		this.stepLogs[step - 1] = this.stepLogs[step -1] || {};
		this.stepLogs[step - 1].status = status;
		return this;
	}

	_setStepLogProperty(step, property, value) {
		this.stepLogs = this.stepLogs || [];
		this.stepLogs[step] = this.stepLogs[step] || {};
		this.stepLogs[step][property] = value;
	}

	submit() {
		return this.testRun.submit().then((response) => {
			return this._createTestExecution(response.data.id);
		});
	}

	_createStepLogsFromTestSteps(testSteps) {
		if (testSteps) {
			for (var i = 0; i < testSteps.length; i++) {
				this._setStepLogProperty(i, "description", testSteps[i].description);
				this._setStepLogProperty(i, "expected_result", testSteps[i].expected);
			}
			return this.stepLogs;
		} else return [];
	}

	_createTestExecution(runId) {
		let finder = new Finder(this.driver);
		return finder.findTestCaseByRunId(runId)
		.then((response) => {
			let stepLogs = this._createStepLogsFromTestSteps(response.data.test_steps);
			let body = {
				status : this.status,
				exe_start_date : new Date().toISOString(),
				exe_end_date : new Date().toISOString(),
				test_step_logs : stepLogs
			}
			if (this.ignoreSteps) delete body.test_step_logs;
			return this.driver.post(`/test-runs/${runId}/auto-test-logs`, body)
			.catch(function (error) {
				console.log(error.response.data);
			})
		})
		.catch((error) => {
			console.log(error);
		})
	}
}

