const {JSDOM} = require("jsdom");

class Item 
{
    constructor(link) {
        this._link = link;
        return (async () => {
            this._dom = await JSDOM.fromURL(this._link);

            return this;
        })();
    }
}

module.exports = {
    Item
}