import axios from 'axios';
var querystring = require('querystring');

export class Requester {
	constructor(host) {
		this.axiosDriver = axios.create({ baseURL: host });
	}

	get driver() {
		return this.axiosDriver;
	}

	set header(header) {
		this.driver.defaults.headers[header.name] = header.value;
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

	clearHeaders() {
		this.driver.defaults.headers = {};
	}

	stringify(form) {
		return querystring.stringify(form);
	}
}