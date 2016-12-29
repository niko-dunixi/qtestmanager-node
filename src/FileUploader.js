import { Finder } from './Finder';
import { AutomationTestLog } from './AutomationTestLog';
import { Saver } from './Saver';

var xml2js = require('xml2js');

export class FileUploader {

	constructor(host, token) {
		this.finder = new Finder(host, token);
		this.saver = new Saver(host, token);
		this._uploadNew = false;
	}

	get projectId() {
		return this._projectId;
	}

	set projectId(id) {
		this._projectId = id;
	}

	get moduleId() {
		return this._moduleId;
	}

	set moduleId(id) {
		this._moduleId = id;
	}

	get moduleType() {
		return this._moduleType;
	}

	set moduleType(type) {
		this._moduleType = type;
	}

	debug(bool) {
		this.finder.debug(bool);
		this.saver.debug(bool);
		return this;
	}

	uploadJUnitResults(xml) {
		return this.parseXML(xml).then((json) => {
			return this.finder.findTestRunsInModule(this._projectId, this._moduleId, this.moduleType).then((testRuns) => {
				var jUnitTestCases = this._getJUnitTestCases(json);
				var promises = [];
				for (var testCase of jUnitTestCases) {
					for (var testRun of testRuns) {
						if (testCase.id == testRun.testCase.id) {
							let log = new AutomationTestLog();
							log.status = testCase.status;
							log.executionStartDate = new Date().toISOString(),
							log.executionEndDate = new Date().toISOString(),
							log.name = "MobQ.FileUploader",
							log.automationContent = "MobQ.FileUploader"
							log.projectId = this.projectId;
							log.testRunId = testRun.id;
							promises.push(this.saver.saveNew(log));
						}
					}
				}
				return Promise.all(promises);		
			});
		})
	}

	parseXML(xml) {
		var parser = new xml2js.Parser();
		return new Promise(function(resolve, reject) {
			parser.parseString(xml, function(err, json) {
				if (err) {
					reject(err);
				}
				else {
					resolve(json);
				}
			});
		});
	}

	_getTestCaseProperties(testCase) {
		try {
			let testProps = {};
			testProps.id = testCase.$.name.match(/#(\d+)/)[1];
			testProps.status = testCase.failure == true ? "FAIL" : "PASS"
			return testProps;
		}
		catch (e) {
			console.log(e);
			console.log(`Test case with name: "${testcase.$.name}" does not have a valid test id.`);
		}

	}

	_getJUnitTestCases(json) {
		var testCases = [];
		var suites = json.testsuites.testsuite;
		for (var suite of suites) {
			for (var testCase of suite.testcase) {
				testCases.push(this._getTestCaseProperties(testCase));
			}
		}
		return testCases;
	}
}




