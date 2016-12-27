import { Requester } from './Requester';

export class Authenticator extends Requester {

	constructor(host) {
		super(host);
		this.header = {"name": "Authorization", "value": "Basic QXBpQ29uc3VtZXI6"};
		this.header = {"name": "Content-Type", "value": "application/x-www-form-urlencoded"};
	}

	get token() {
		return this.authToken;
	}

	set token(token) {
		this.authToken = token;
	}

	login(username, password) {
		this.debug(true);
		var form = this.stringify({
			grant_type: 'password',
			username: username,
			password: password
		});

		return this.driver.post('/oauth/token', form).then((response) => {
			this.authToken = `${response.data.token_type} ${response.data.access_token}`;
			return response;
		});
	}

	logout() {
		this.clearHeaders();
		this.header = {"name": "Authorization", "value": this.token};
		return this.driver.post('/oauth/revoke');
	}

}