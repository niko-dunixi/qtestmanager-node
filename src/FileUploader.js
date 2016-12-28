import { Finder } from './Finder';
import { AutomationTestLog } from './AutomationTestLog';
import { Saver } from './Saver';

var xml2js = require('xml2js');

export class FileUploader {

	constructor(host, token) {
		this.finder = new Finder(host, token);
		this.sender = new Sender(host, token);
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
			promiseToReturn = finder.findTestRunsInModule(qtestLocation.id, qtestLocation.type).then((response) => {
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
}