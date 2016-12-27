import { TestRun } from './TestRun';
import { Finder } from './Finder';
import { QTestResource } from './QTestResource';

export class AutomationTestLog extends QTestResource {

	constructor() {
		super();
	}

	get status() {
		return this.json.status;
	}

	set status(status) {
		this.json.status = status;
	}

	get executionStartDate() {
		return this.json.exe_start_date;
	}

	set executionStartDate(exeStartDate) {
		this.json.exe_start_date = exeStartDate;
	}

	get executionEndDate() {
		return this.json.exe_end_date;
	}

	set executionEndDate(exeEndDate) {
		this.json.exe_end_date = exeEndDate;
	}

	get name() {
		return this.name;
	}

	set name(name) {
		this.json.name = name;
	}

	get automationContent() {
		return this.json.automation_content;
	}

	set automationContent(automationContent) {
		this.json.automation_content = automationContent;
	}

	get attachments() {
		return this.attachments;
	}

	set attachments(attachments) {
		this.json.attachments = attachments;
	}

	get note() {
		return this.json.note;
	}

	set note(note) {
		this.json.note = note;
	}

	get testCaseVersionId() {
		return this.json.test_case_version_id;
	}

	set testCaseVersionId(id) {
		this.json.test_case_version_id = id;
	}

	get testStepLogs() {
		return this.json.test_step_logs;
	}

	set testStepLogs(testStepLogs) {
		this.json.test_step_logs = testStepLogs;
	}

	get testRunId() {
		return this.runId;
	}

	set testRunId(id) {
		this.runId = id;
		this._updateEndpoint();
	}

	get projectId() {
		return this.project;
	}

	set projectId(id) {
		this.project = id;
		this._updateEndpoint();
	}

	_updateEndpoint() {
		this.endpoint = `/api/v3/projects/${this.project}/test-runs/${this.runId}/auto-test-logs`;	
	}

}

