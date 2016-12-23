import { TestRun } from './TestRun';
import { Finder } from './Finder';

export class AutomationTestLog extends QTestResource {

	constructor(autoTestLog) {
		super(autoTestLog);
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
		return this.testRunId;
	}

	set testRunId(id) {
		this.testRunId = id;
	}

	get projectId() {
		return this.projectId;
	}

	set projectId(id) {
		this.projectId = projectId;
	}

	get endpoint() {
		try {
			return `/api/v3/projects/${this.projectId}/test-runs/${this.testRunId}/auto-test-logs`;			
		}
		catch (error) {
			console.log("Failed to construct endpoint. Did you set the project and test ids?", error);
		}
	}


	inCycle(cycleId) {
		this.testRun.inCycle(cycleId);
		return this;
	}

	inSuite(suiteId) {
		this.testRun.inSuite(suiteId);
		return this;
	}

	inRelease(releaseId) {
		this.testRun.inRelease(releaseId);
		return this;
	}

	forTest(testId) {
		this.testRun.forTest(testId);
		return this;
	}

	forRun(runId) {
		this.runId = runId;
		return this;
	}

	withStatus(status) {
		this.status = status;
		return this;
	}

	withStepStatus(step, status) {
		this.ignoreSteps = false;
		this.stepLogs = this.stepLogs || [];
		this.stepLogs[step - 1] = this.stepLogs[step -1] || {};
		this.stepLogs[step - 1].status = status;
		return this;
	}

	addAttachment(name, contentType, data) {
		var attachment = {
			name : name,
			content_type : contentType,
			data : data
		}
		this.attachments.push(attachment);
		return this;
	}

	_setStepLogProperty(step, property, value) {
		this.stepLogs = this.stepLogs || [];
		this.stepLogs[step] = this.stepLogs[step] || {};
		this.stepLogs[step][property] = value;
	}

	submitForExistingRun() {
		return this._createTestExecution(this.runId);
	}

	submit() {
		return this.testRun.submit().then((response) => {
			return this._createTestExecution(response.data.id);
		});
	}

	_createStepLogsFromTestSteps(testSteps) {
		if (testSteps) {
			for (var i = 0; i < testSteps.length; i++) {
				this._setStepLogProperty(i, "description", testSteps[i].description);
				this._setStepLogProperty(i, "expected_result", testSteps[i].expected);
			}
			return this.stepLogs;
		} else return [];
	}

	_createTestExecution(runId) {
		let finder = new Finder(this.driver);
		return finder.findTestCaseByRunId(runId)
		.then((response) => {
			let stepLogs = this._createStepLogsFromTestSteps(response.data.test_steps);
			let body = {
				status : this.status,
				exe_start_date : new Date().toISOString(),
				exe_end_date : new Date().toISOString(),
				test_step_logs : stepLogs,
				attachments : this.attachments
			}
			if (this.ignoreSteps) delete body.test_step_logs;
			return this.driver.post(`/test-runs/${runId}/auto-test-logs`, body)
			.catch(function (error) {
				console.log(error.response.data);
			})
		})
		.catch((error) => {
			console.log(error);
		})
	}
}

