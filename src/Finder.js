export class Finder {
	constructor(driver) {
		this.driver = driver;
	}

	findTestCaseByRunId(runId) {
		return this.driver.get(`/test-runs/${runId}`)
		.then((response) => {
			return this._getTestCase(response);
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

	_getTestCase(response) {
		let tcLink = this.getTestCaseFromLinks(response.data.links);
		let tcId = this.parseTestIdFromLinkObject(tcLink);
		return this.driver.get(`/test-cases/${tcId}?expand=teststep`);
	}

	getTestCaseFromLinks(links) {
		var tcLink = {};
		for (let link of links) {
			if (link.rel == 'test-case') {
				tcLink = link;
				break;
			}
		}
		return tcLink;
	}

	parseTestIdFromLinkObject(tcLink) {
		var regex = /test-cases\/(\d+)/g;
		var foundId = regex.exec(tcLink.href)[1];
		return foundId;
	}
}