export class TestRunCtrl {

	constructor(driver) {
		this.driver = driver;
	}

	inCycle(cycleId) {
		this.cycleId = cycleId;
		return this;
	}

	forTest(testId) {
		this.testId = testId;
		return this;
	}

	submit() {
		this.getTestName().then((response) => {
			this.driver.post(`/test-runs?parentId=${this.cycleId}&parentType=test-cycle`, {
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

	getTestName() {
		return this.driver.get(`/test-cases/${this.testId}`);
	}

}

