export class TestRunFinder {

	constructor(driver) {
		this.driver = driver;
	}

	findById(id) {
		return this.driver.get(`/test-runs/${id}`);
	}

	findByLocation(location) {
		
	}

	_getAllTestReleases() {
		return this.driver.get('/releases');
	}

	_getAllTestCyclesForRelease(releaseId) {
		return this.driver.get(`/test-cycles?parentId=${releaseId}&parentType=release`);
	}

	_getAllTestSuitesForCycle(cycleId) {
		return this.driver.get(`/test-suites?parentId=${cycleId}&parentType=test-cycle`);
	}

	_getAllTestRunsForSuite(suiteId) {
		return this.driver.get(`/test-runs?parentId=${suiteId}&parentType=test-suite`);
	}



}