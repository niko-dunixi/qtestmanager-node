import { Requester } from './Requester';
import { TestCase } from './TestCase';
import { AutomationTestLog } from './AutomationTestLog';

export class Finder extends Requester {

	constructor(host, token) {
		super(host);
		this.token = token;
		this.header = {"name": "Authorization", "value": token};
		this.header = {"name": "Accept", "value": "application/json"};
	}

	findTestCaseByRunId(projectId, runId) {
		return this.driver.get(`/api/v3/projects/${projectId}/test-runs/${runId}?expand=testcase.teststep`)
		.then((response) => {
			let testCase = new TestCase();
			return testCase.fromJSON(response.data.test_case);
		});

	}

	findLastRun(projectId, runId) {
		return this.driver.get(`/api/v3/projects/${projectId}/test-runs/${runId}/test-logs/last-run`)
		.then((response) => {
			let testLog = new AutomationTestLog();
			return testLog.fromJSON(response.data);
		});
	}

	findTestCaseRunsInModule(moduleId, moduleType) {
		var searchBody = {
			"object_type": "test-runs",
			"fields": ["*"],
			"query": `'${moduleType}' = '${moduleId}'`
		}
		return this.driver.post('/search', searchBody);
	}

}