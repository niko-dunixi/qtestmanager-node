import axios from 'axios';
var querystring = require('querystring');

export class Requester {
	constructor(host) {
		this.driver = axios.create({
			baseURL: host;
		});
	}

	get driver() {
		return this.driver;
	}

	set header(headerName, headerValue) {
		this.driver.defaults.headers[headerName] = headerValue;
	}

	clearHeaders() {
		this.driver.defaults.headers = {};
	}

	stringify(form) {
		return querystring.stringify(form);
	}
}