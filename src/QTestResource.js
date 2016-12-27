export class QTestResource {

	constructor() {
		this.bodyJson = {};
	}

	get json() {
		return this.bodyJson;
	}

	set endpoint(endpoint) {
		this.restEndpoint = endpoint;
	}

	get endpoint() {
		return this.restEndpoint;
	}

	

}