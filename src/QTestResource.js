export class QTestResource {

	constructor(existingResource) {
		this.json = existingResource.json() || {};
	}

	get json() {
		return this.json;
	}

	

}