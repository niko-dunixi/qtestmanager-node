import { Finder } from './Finder';
import { QTestResource } from './QTestResource';

export class TestRun extends QTestResource {

	constructor() {
		super();
	}

	get testCase() {
		return this._testCase;
	}

	set testCase(testCase) {
		this._testCase = testCase;
	}

	get projectId() {
		return this._projectId;
	}

	set projectId(id) {
		this._projectId = id;
		this._refreshURL();
	}

	get properties() {
		return this._properties;
	}

	set properties(properties) {
		this._properties = properties;
	}

	toJSON() {
		let json = {
			links: this.links,
			id: this.id,
			name: this.name,
			properties: this.properties,
			test_case: this.testCase
		};
		return json;
	}

	fromJSON(json) {
		this.links = json.links;
		this.id = json.id;
		this.testCase = { test_case_version_id: json.test_case_version_id };
		this.name = json.name;
		return this;
	}

	_refreshURL() {
		this.createURL = `/api/v3/projects/${this.projectId}/test-runs/`;
	}

}

