export class Query {

	constructor() {
		this._fields = ["*"];
		this._params = {};
	}

	get objectType() {
		return this._objectType;
	}

	set objectType(objectType) {
		this._objectType = objectType;
	}

	get fields() {
		return this._fields;
	}

	set fields(fields) {
		this._fields = fields;
	}

	get pageSize() {
		return this._params.pageSize;
	}

	set pageSize(pageSize) {
		this._params.pageSize = pageSize;
	}

	get page() {
		return this._params.page;
	}

	set page(page) {
		this._params.page = page;
	}

	get query() {
		return this._query;
	}

	set query(query) {
		this._query = query;
	}

	get searchParams() {
		let paramString = ""
		if (Object.keys(this._params).length > 0) {
			for (var param in this._params) {
				paramString += `?${param}=${this._params[param]}&`;
			}
		}
		return paramString;
	}

	addField(fieldName) {
		if (this.fields[0] == "*") this._fields = [];
		this._fields.push(fieldName);
	}

	toJSON() {
		return {
			object_type: this._objectType,
			fields: this._fields,
			query: this._query
		}
	}
}