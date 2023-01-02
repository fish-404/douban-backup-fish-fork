const itemData_helper = require('../utils/itemData_helper')

class Item 
{
    constructor(itemSource) {
        this._link = itemSource.link;
        this._pubTime = itemSource.isoDate;
    }

    _setInfo(content) {
        const dom = new JSDOM(content.trim());
        const contents = [...dom.window.document.querySelectorAll('td p')];
        this._rating = itemData_helper.getRating(contents);
        this._comment = itemData_helper.getComment(contents);
    }
}