import { TestRunCtrl } from './TestRunCtrl';
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

	newTestRun() {
		return new TestRunCtrl(this._getDriver());
	}

	getFinder() {
		this.finder = new TestRunFinder(this._getDriver());
		return this.finder;
	}


	_getDriver() {
		let axios = require('axios');
		this.driver = axios.create({
			baseURL: this.baseURL,
			timeout: 1000,
			headers: {
				"Authorization" : this.token
			}
		});
		return this.driver;
	}

}
	

