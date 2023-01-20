const got = require("got");
const {JSDOM} = require("jsdom");

class Item 
{
    constructor(category) {
        this._category = category;
    }

    setLink(link) {
        this._link = link;
    }

    async _setItemLinkDom() {
        const response = await got(this._link);
        this._dom = new JSDOM(response.body);
    }
}

module.exports = {
    Item
}