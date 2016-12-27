export class QTestResource {

	set updateURL(url) {
		this._updateURL = url;
	}

	get updateURL() {
		return this._updateURL;
	}

	set createURL(url) {
		this._createURL = url;
	}

	get createURL() {
		return this._createURL;
	}

	get links() {
		return this._links;
	}

	set links(links) {
		this._links = links;
	}

	getLink(linkName) {
		for (let link of this.links) {
			if (link.rel = linkName) {
				return link.href;
				break;
			}
		}
	}

	

}