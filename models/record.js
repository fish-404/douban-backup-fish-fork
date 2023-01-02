const itemData_helper = require('../utils/recordData_helper')
const {JSDOM} = require('jsdom');

class Record 
{
    constructor(itemSource) {
        this._link = itemSource.link;
        this._pubTime = itemSource.isoDate; // '2021-05-30T06:49:34.000Z'
        this._id = itemData_helper.getId(itemSource.link);
        this._category = itemData_helper.getCategoryAndId(itemSource.title, itemSource.link).category;
        this._setInfo(itemSource.content);
    }

    _setInfo(content) {
        const dom = new JSDOM(content.trim());
        const contents = [...dom.window.document.querySelectorAll('td p')];
        this._rating = itemData_helper.getRating(contents);
        this._comment = itemData_helper.getComment(contents);
    }

    getCategory() {
        return this._category;
    }

    getResult() {
        return {
            id: this._id
            , link: this._link
            , rating: this._rating
            , comment: this._comment
            , time: this._pubTime
        }
    }
}

module.exports = {
    Record
}