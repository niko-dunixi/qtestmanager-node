import { TestRun } from './TestRun';

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
		return new TestRun(this._getDriver());
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
	

