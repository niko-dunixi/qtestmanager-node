export class AutoTestLogCtrl {

	constructor(driver) {
		this.driver = driver;
	}

	status(status) {
		this.status = status;
		return this;
	}

	name(name) {
		this.name = name;
		return this;
	}

	automationContent(content) {
		this.automationContent = content;
		return this;
	}

	testRunId(id) {
		this.id = id;
		return this;
	}

	submit() {
		this.driver.post(`${this.id}/auto-test-logs`, {
			name : this.name,
			automationContent : this.automationContent,
			status : this.status,
			exe_start_date : new Date().toISOString(),
			exe_end_date : new Date().toISOString()
		})
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error.message, error);
		});
	}

}

