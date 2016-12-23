export class Authenticator extends Requester {

	constructor(host) {
		super(host);
		this.header("Authorization", "Basic QXBpQ29uc3VtZXI6");
		this.header("Content-Type", "application/x-www-form-urlencoded");
	}

	get token() {
		return this.token;
	}

	set token(token) {
		this.token = token;
	}

	login(username, password) {
		var form = this.stringify({
			grant_type: 'password',
			username: username,
			password: password
		});

		return this.driver.post('/oauth/token', form).then((response) => {
			this.token(`${response.data.token_type} ${response.data.access_token}`);
		});
	}

	logout() {
		this.clearHeaders();
		this.header("Authorization", this.token);
		return this.driver.post('/oauth/revoke');
	}

}