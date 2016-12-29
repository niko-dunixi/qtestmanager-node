export class QTestResource {

	get updateURL() {
		return this._updateURL;
	}

	set updateURL(url) {
		this._updateURL = url;
	}

	get createURL() {
		if (this._createURL) {
			return this._createURL
		} else {
			throw new Error("URL for this resource is undefined. Are you sure you set all of the necessary properties?");
		}
	}

	set createURL(url) {
		this._createURL = url;
	}

	get links() {
		return this._links;
	}

	set links(links) {
		this._links = links;
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
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