import { TestRun } from './TestRun';
import { AutomationTestLog } from './AutomationTestLog';
import { Finder } from './Finder';
import { Authenticator } from './Authenticator';
import { Sender } from './Sender';
import { Requester } from './Requester';
import { TestCase } from './TestCase';

import axios from 'axios';

var xml2js = require('xml2js');


export default class MobQ {

	constructor(host) {
		this.host = host;
		this.authenticator = new Authenticator(host);
	}

	get finder() {
		if (this.authenticated) {
			return new Finder(this.host, this.authenticator.token);
		}
	}

	get sender() {
		if (this.authenticated) {
			return new Sender(this.host, this.authenticator.token);
		}
	}

	get automationTestLog() {
		return new AutomationTestLog();
	}

	get testCase() {
		return new TestCase();
	}

	createTestCase(testCase) {
		return this.sender.create(testCase);
	}

	createAutomationTestLog(autoTestLog) {
		return this.sender.create(autoTestLog);
	}

	createTestRun(testRun) {
		return this.sender.create(testRun);
	}

	submitJUnitResults(xml, qtestLocation) {
		var testExecutions = [];
		var regex = /#(\d+)/;
		var parser = new xml2js.Parser();
		var promiseToReturn;
		parser.parseString(xml, (err, results) => {
			var testsuites = results.testsuites.testsuite;
			for (var suite of testsuites) {
				for (var testcase of suite.testcase) {
					try {
						var id = testcase.$.name.match(regex)[1];
						var testExecution = {
							"testCaseId": id,
							"status": testcase.failure == true ? "FAIL" : "PASS"
						}
						testExecutions.push(testExecution);
					}
					catch (e) {
						console.log(e);
						console.log(`Test case with name: "${testcase.$.name}" does not have a valid test id.`);
					}

				}
			}
			this.driver.defaults.headers["Content-Type"] = "application/json";
			this.driver.defaults.headers["Accept"] = "application/json";
			this.driver.defaults.baseURL = `${this.host}/api/v3/projects/${this.projectId}`;
			var finder = new Finder(this.driver);
			promiseToReturn = finder.findTestCaseRunsInModule(qtestLocation.id, qtestLocation.type).then((response) => {
				var runsInModule = [];
				var promises = [];
				for (var run of response.data.items) {
					let tcLink = finder.getTestCaseFromLinks(run.links);
					let tcId = finder.parseTestIdFromLinkObject(tcLink);
					var run = {
						tcId: tcId,
						runId: run.id
					};
					runsInModule.push(run);
				}
				// Take each junit testcase and get its ID
				//
				// Search qTest in the provided module for
				// test runs that have that ID
				//
				// For every returned test run, make a 
				// new execution with the appropriate
				// status
				for (testExecution of testExecutions) {
					for (var run of runsInModule) {
						if (testExecution.testCaseId == run.tcId) {
							var execution = this.newTestExecution();
							console.log("PUSHING TEST EXECUTION FOR " + testExecution.testCaseId);
							promises.push(execution.forRun(run.runId).withStatus(testExecution.status).submitForExistingRun());
						}
					}

				}

				return Promise.all(promises);		
			});
		});
		return promiseToReturn;
	}

	logout() {
		return this.authenticator.logout();
	}

	login(username, password) {
		return this.authenticator.login(username, password).then((response) => {
			this.authenticated = response.status == 200;
		});
	}



}
	

