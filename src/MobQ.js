import { AutoTestLogCtrl } from './AutoTestLogCtrl';
import { TestRunFinder } from './TestRunFinder';

export default class MobQ {

	constructor(host) {
		this.host = host;
		this.baseURL = host + "/api/v3/projects";
	}

	setToken(token) {
		this.token = token;
	}

	setProjectId(id) {
		this.projectId = id;
		this.baseURL += `/${id}`;
	}

	newTestLog() {
		return new AutoTestLogCtrl(this._getDriver(`/test-runs`));
	}

	getFinder() {
		this.finder = new TestRunFinder(this._getDriver(""));
		return this.finder;
	}


	_getDriver(apiUrl) {
		apiUrl = apiUrl || "";
		let axios = require('axios');
		this.driver = axios.create({
			baseURL: this.baseURL + apiUrl,
			timeout: 1000,
			headers: {
				"Authorization" : this.token
			}
		});
		return this.driver;
	}

}
	

