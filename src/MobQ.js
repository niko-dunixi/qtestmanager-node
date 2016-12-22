import { TestRun } from './TestRun';
import { TestExecution } from './TestExecution';
import { Finder } from './Finder';

import axios from 'axios';

var xml2js = require('xml2js');


export default class MobQ {

	constructor(host) {
		this.host = host;
		this.driver = axios.create({
			baseURL: host,
			timeout: 10000,
			headers: {
				"Authorization" : "Basic QXBpQ29uc3VtZXI6",
				"Content-Type" : "application/x-www-form-urlencoded"
			}
		});
	}

	setProjectId(id) {
		this.projectId = id;
	}

	debug(on) {
		if (on) {
			this.reqInterceptor = this.driver.interceptors.request.use(function (config) {
				console.log("----- Request -----");
				console.log(config.method, config.url);
				console.log(config.headers);
				console.log(config.data);
				console.log("----- End Request -----");
				return config;
			}, function (error) {
				return Promise.reject(error);
			});
			this.resInterceptor = this.driver.interceptors.response.use(function (response) {
				console.log("----- Response -----");
				console.log(response.headers);
				console.log(response.data);
				console.log("----- End Response -----");
				return response;
			}, function(error) {
				return Promise.reject(error);
			});
		} else {
			if (this.reqInterceptor) this.driver.interceptors.request.eject(this.reqInterceptor);
			if (this.resInterceptor) this.driver.interceptors.response.eject(this.resInterceptor);
		}
	}

	newTestRun() {
		this.driver.defaults.headers["Content-Type"] = "application/json";
		this.driver.defaults.headers["Accept"] = "application/json";
		this.driver.defaults.baseURL = `${this.host}/api/v3/projects/${this.projectId}`;
		return new TestRun(this.driver);
	}

	newTestExecution() {
		this.driver.defaults.headers["Content-Type"] = "application/json";
		this.driver.defaults.headers["Accept"] = "application/json";
		this.driver.defaults.baseURL = `${this.host}/api/v3/projects/${this.projectId}`;
		return new TestExecution(this.driver);
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
		this.driver.defaults.baseURL = this.host;
		return this.driver.post('/oauth/revoke');
	}

	login(credentials) {
		return this._getToken(credentials).then((response) => {
			this.driver.defaults.headers["Authorization"] = `${response.data.token_type} ${response.data.access_token}`;
		}).catch(function(error) {
			console.log(error);
		});
	}

	_getToken(credentials) {
		var querystring = require('querystring');
		var form = {
			grant_type: 'password',
			username: credentials.username,
			password: credentials.password
		} 
		return this.driver.post('/oauth/token', querystring.stringify(form));
	}

}
	

