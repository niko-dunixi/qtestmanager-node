export class QueryResult {

	get links() {
		return this._links;
	}

	get page() {
		return this._page;
	}

	get pageSize() {
		return this._pageSize;
	}

	get total() {
		return this._total;
	}

	get items() {
		return this._items;
	}

	get pageCount() {
		return this._numPages(this._total, this._pageSize);
	}

	fromJSON(json) {
		this._links = json.links;
		this._page = json.page;
		this._pageSize = json.page_size;
		this._total = json.total;
		this._items = json.items;
		return this;
	}

	_numPages(t,s) {
	  return t<s?1:(Math.floor(t/s)+(t%s==0?0:1));
	}
}