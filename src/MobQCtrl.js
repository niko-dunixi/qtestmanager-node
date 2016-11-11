import { AutoTestLogCtrl } from './AutoTestLogCtrl';

export default class MobQCtrl {

	constructor(host) {
		this.host = host;
	}

	setToken(token) {
		this.token = token;
	}

	setProjectId(id) {
		this.projectId = id;
	}

	newTestLog() {
		return new AutoTestLogCtrl(this._getDriver(`/api/v3/projects/${this.projectId}/test-runs`));
	}

	_getDriver(apiUrl) {
		let axios = require('axios');
		if (!this.driver) {
			this.driver = axios.create({
				baseURL: this.host + apiUrl,
				timeout: 1000,
				headers: {
					"Authorization" : this.token
				}
			});
			return this.driver;
		} 
		else {
			return this.driver;
		}
	}

}
	

