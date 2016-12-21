import { TestRun } from './TestRun';
import { TestExecution } from './TestExecution';
import axios from 'axios';


export default class MobQ {

	constructor(host) {
		this.host = host;
		this.driver = axios.create({
			baseURL: host,
			timeout: 10000,
			headers: {
				"Authorization" : "Basic QXBpQ29uc3VtZXI6",
				"Content-Type" : "application/x-www-form-urlencoded"
			}
		});
	}

	setProjectId(id) {
		this.projectId = id;
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
		this.driver.defaults.headers["Content-Type"] = "application/json";
		this.driver.defaults.headers["Accept"] = "application/json";
		this.driver.defaults.baseURL = `${this.host}/api/v3/projects/${this.projectId}`;
		return new TestRun(this.driver);
	}

	newTestExecution() {
		this.driver.defaults.headers["Content-Type"] = "application/json";
		this.driver.defaults.headers["Accept"] = "application/json";
		this.driver.defaults.baseURL = `${this.host}/api/v3/projects/${this.projectId}`;
		return new TestExecution(this.driver);
	}

	logout() {
		console.log("Revoking token");
		this.driver.defaults.baseURL = this.host;
		return this.driver.post('/oauth/revoke');
	}

	login(credentials) {
		return this._getToken(credentials).then((response) => {
			this.driver.defaults.headers["Authorization"] = `${response.data.token_type} ${response.data.access_token}`;
		}).catch(function(error) {
			console.log(error);
		});
	}

	_getToken(credentials) {
		var querystring = require('querystring');
		var form = {
			grant_type: 'password',
			username: credentials.username,
			password: credentials.password
		} 
		return this.driver.post('/oauth/token', querystring.stringify(form));
	}

}
	

