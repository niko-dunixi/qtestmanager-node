export class TestRunFinder {

	constructor(driver) {
		this.driver = driver;
	}

	findById(id) {
		return this.driver.get(`/test-runs/${id}`);
	}

}