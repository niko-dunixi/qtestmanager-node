import { Requester } from './Requester';
import { TestCase } from './TestCase';
import { AutomationTestLog } from './AutomationTestLog';
import { Query } from './Query';
import { QueryResult } from './QueryResult';
import { TestRun } from './TestRun';

export class Finder extends Requester {

	constructor(host, token) {
		super(host);
		this.token = token;
		this.header = {"name": "Authorization", "value": token};
		this.header = {"name": "Accept", "value": "application/json"};
		this.header = {"name": "Content-Type", "value": "application/json"};
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

	findTestRunsInModule(projectId, moduleId, moduleType) {
		var query = new Query();
		query.objectType = "test-runs";
		query.addField("name");
		query.query = `'${moduleType}' = '${moduleId}'`;

		return this.runQuery(projectId, query)
		.then((queryResult) => {
			let queries = [];
			for (var i = 1; i <= queryResult.pageCount; i++) {
				query.page = i;
				queries.push(this.runQuery(projectId, query));
			}
			return Promise.all(queries)
			.then((queryResults) => {
				let testRuns = [];
				for (var queryResult of queryResults) {
					for (var item of queryResult.items) {
						testRuns.push(new TestRun().fromJSON(item));
					}
				}
				return testRuns;
			});
		});
	}

	runQuery(projectId, query) {
		let params = query.searchParams;
		return this.driver.post(`/api/v3/projects/${projectId}/search${params}`, query.toJSON())
		.then(function(response) {
			return new QueryResult().fromJSON(response.data);
		});
	}


}



















