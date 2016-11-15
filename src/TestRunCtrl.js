export class TestRunCtrl {

	constructor(driver) {
		this.driver = driver;
	}

	inCycle(cycleId) {
		this._setSubmitUrl(cycleId, "test-cycle");
		return this;
	}

	forTest(testId) {
		this.testId = testId;
		return this;
	}

	submit() {
		this._checkForExistingRunForTestCase(this.testId, this.parentId, (exists) => {
			if (!exists) {
				this._makeSubmitRequest();
			} else {
				console.log("Test Run for Test " + this.testId + " already exists");
			}
		})
	}

	_testIdExistsInResponse(response, testId) {
		var exists = false
		for (var run of response.data) {
			var tcLink = this._getTestCaseFromLinks(run.links);
			var idOfTestInRun = this._parseTestIdFromLinkObject(tcLink);
			if (idOfTestInRun == testId) {
				exists = true;
				break;
			}
		}
		return exists;
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

	_makeSubmitRequest() {
		this._getTestName().then((response) => {
			this.driver.post(this.submitUrl, {
				name : response.data.name,
				test_case: {
					id : this.testId
				}

			})
			.then(function (response) {
				console.log(response);
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

	_checkForExistingRunForTestCase(testId, parentId, callback) {
		this.driver.get(this.submitUrl)
		.then((response) => {
			callback(this._testIdExistsInResponse(response, testId));
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	_getTestName() {
		return this.driver.get(`/test-cases/${this.testId}`);
	}



}

