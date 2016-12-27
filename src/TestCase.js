import { QTestResource } from './QTestResource';

export class TestCase extends QTestResource {
	constructor() {
		super();
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
	}

	get automationContent() {
		return this._automationContent;
	}

	set automationContent(automationContent) {
		this._automationContent = automationContent;
	}

	get testCaseVersionId() {
		return this._testCaseVersionId;
	}

	set testCaseVersionId(id) {
		this._testCaseVersionId = id;
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
			automation_content: this.automationContent,
		};
		return json;
	}

	fromJSON(json) {
		this.links = json.links;
		this.id = json.id;
		this.testCaseVersionId = json.test_case_version_id;
		this.name = json.name;
		this.updateURL = this.getLink("self");
		return this;
	}

	_refreshURL() {
		this.createURL = `/api/v3/projects/${this.projectId}/test-cases/`;
		this.updateURL = `/api/v3/projects/${this.projectId}/test-cases/${this.id}`;
	}

}