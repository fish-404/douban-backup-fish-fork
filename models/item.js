const got = require("got");
const {JSDOM} = require("jsdom");

class Item 
{
    constructor(link) {
        this._link = link;
        return (async () => {
            const response = await got(this._link);
            this._dom = new JSDOM(response.body);

            return this;
        })();
    }
}

module.exports = {
    Item
}