import { TestRun } from './TestRun';
import { TestExecution } from './TestExecution';


export default class MobQ {

	constructor(host, projectId, token) {
		let axios = require('axios');
		this.host = host;
		this.baseURL = `${host}/api/v3/projects/${projectId}`;
		this.driver = axios.create({
			baseURL: this.baseURL,
			timeout: 1000,
			headers: {
				"Authorization" : token
			}
		});
	}

	debug(on) {
		if (on) {
			this.reqInterceptor = this.driver.interceptors.request.use(function (config) {
				console.log("----- Request -----");
				console.log(config.method, config.url);
				console.log(config.headers);
				console.log(config.data);
				console.log("----- End Request -----");
				return config;
			}, function (error) {
				return Promise.reject(error);
			});
			this.resInterceptor = this.driver.interceptors.response.use(function (response) {
				console.log("----- Response -----");
				console.log(response.headers);
				console.log(response.data);
				console.log("----- End Response -----");
				return response;
			}, function(error) {
				return Promise.reject(error);
			});
		} else {
			if (this.reqInterceptor) this.driver.interceptors.request.eject(this.reqInterceptor);
			if (this.resInterceptor) this.driver.interceptors.response.eject(this.resInterceptor);
		}
	}

	newTestRun() {
		return new TestRun(this.driver);
	}

	newTestExecution() {
		return new TestExecution(this.driver);
	}

}
	

