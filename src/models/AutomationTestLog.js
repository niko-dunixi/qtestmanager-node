import { QTestResource } from './QTestResource';
import { TestRun } from './TestRun';
import { Finder } from '../services/Finder';

export class AutomationTestLog extends QTestResource {

	constructor() {
		super();
	}

	get status() {
		return this._status;
	}

	set status(status) {
		this._status = status;
	}

	get executionStartDate() {
		return this._executionStartDate;
	}

	set executionStartDate(executionStartDate) {
		this._executionStartDate = executionStartDate;
	}

	get executionEndDate() {
		return this._executionEndDate;
	}

	set executionEndDate(executionEndDate) {
		this._executionEndDate = executionEndDate;
	}

	get automationContent() {
		return this._automationCcontent;
	}

	set automationContent(automationContent) {
		this._automationContent = automationContent;
	}

	get attachments() {
		return this._attachments;
	}

	set attachments(attachments) {
		this._attachments = attachments;
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
	}

	get note() {
		return this._note;
	}

	set note(note) {
		this._note = note;
	}

	get testCaseVersionId() {
		return this._testCaseVersionId;
	}

	set testCaseVersionId(id) {
		this._testCaseVersionId = id;
	}

	get testCaseId() {
		return this._testCaseId;
	}

	set testCaseId(id) {
		this._testCaseId = id;
	}

	get testStepLogs() {
		return this._testStepLogs;
	}

	set testStepLogs(testStepLogs) {
		this._testStepLogs = testStepLogs;
	}

	get testRunId() {
		return this._testRunId;
	}

	set testRunId(id) {
		this._testRunId = id;
		this._refreshURL();
	}

	get projectId() {
		return this._projectId;
	}

	set projectId(id) {
		this._projectId = id;
		this._refreshURL();
	}

	toJSON() {
		let json = {
			links: this.links,
			id: this.id,
			exe_start_date: this.executionStartDate,
			exe_end_date: this.executionEndDate,
			attachments: this.attachments,
			status: this.status,
			name: this.name,
			automation_content: this.automationContent,
			note: this.note,
			test_step_logs: this.testStepLogs
		};
		return json;
	}

	fromJSON(json) {
		this.links = json.links;
		this.id = json.id;
		this.testCaseVersionId = json.test_case_version_id;
		this.executionStartDate = json.exe_start_date;
		this.executionEndDate = json.exe_end_date;
		this.attachments = json.attachments;
		this.status = json.status.name;
		this.testStepLogs = json.test_step_logs;
		this.note = json.note || "";
		return this;
	}

	_refreshURL() {
		this.createURL = `/api/v3/projects/${this.projectId}/test-runs/${this.testRunId}/auto-test-logs`;
	}

}

