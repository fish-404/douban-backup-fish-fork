const {Item} = require("../item")
const {DB_PROPERTIES} = require("../../utils/util");

class Drama extends Item 
{
    // @todo: rewrite return type
    setInfo() {
        this._genre = this._dom.window.document.querySelector('#content .drama-info .meta [itemprop="genre"]').textContent.trim();
    }

    getInfo() {
        return {
            [DB_PROPERTIES.GENRE]: [this._genre]
        }
    }
}

module.exports = {
    Drama
}