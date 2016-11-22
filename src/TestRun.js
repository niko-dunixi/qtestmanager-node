export class TestRun {

	constructor(driver) {
		this.driver = driver;
	}

	inCycle(cycleId) {
		this._setSubmitUrl(cycleId, "test-cycle");
		return this;
	}

	inSuite(suiteId) {
		this._setSubmitUrl(suiteId, "test-suite");
		return this;
	}

	inRelease(releaseId) {
		this._setSubmitUrl(releaseId, "release");
		return this;
	}

	forTest(testId) {
		this.testId = testId;
		return this;
	}

	submit() {
		return this.driver.get(this.submitUrl)
		.then((response) => {
			var testRun = this._testIdExistsInResponse(response, this.testId);
			if (testRun.exists) {
				var response = {
					data : {
						id: testRun.id
					}
				}
				return Promise.resolve(response);
			} else {
				return this._makeSubmitRequest(testRun);
			}
		});
	}

	_testIdExistsInResponse(response, testId) {
		var testRun = {
			exists: false,
			id: 0
		}
		for (var run of response.data) {
			var tcLink = this._getTestCaseFromLinks(run.links);
			var idOfTestInRun = this._parseTestIdFromLinkObject(tcLink);
			if (idOfTestInRun == testId) {
				testRun.exists = true;
				testRun.id = run.id;
				break;
			}
		}
		return testRun;
	}
//duplicated in Finder, refactor
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
//duplicated in finder, refactor
	_parseTestIdFromLinkObject(tcLink) {
		var regex = /test-cases\/(\d+)/g;
		var foundId = regex.exec(tcLink.href)[1];
		return foundId;
	}

	_makeSubmitRequest(testRun) {
		return this._getTestName().then((getResponse) => {
			return this.driver.post(this.submitUrl, {
				name : getResponse.data.name,
				test_case: {
					id : this.testId
				}
			})
			.catch(function (error) {
				console.log(error.message, error);
			});
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	_setSubmitUrl(parentId, parentType) {
		this.submitUrl = `/test-runs?parentId=${parentId}&parentType=${parentType}`;
	}

	_getTestName() {
		return this.driver.get(`/test-cases/${this.testId}`);
	}



}

