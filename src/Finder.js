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

	_getTestCase(response) {
		let tcLink = this._getTestCaseFromLinks(response.data.links);
		let tcId = this._parseTestIdFromLinkObject(tcLink);
		return this.driver.get(`/test-cases/${tcId}?expand=teststep`);
	}

	_getTestCaseFromLinks(links) {
		var tcLink = {};
		for (let link of links) {
			if (link.rel == 'test-case') {
				tcLink = link;
				break;
			}
		}
		return tcLink;
	}

	_parseTestIdFromLinkObject(tcLink) {
		var regex = /test-cases\/(\d+)/g;
		var foundId = regex.exec(tcLink.href)[1];
		return foundId;
	}
}