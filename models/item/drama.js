const {Item} = require("../item")
const {DB_PROPERTIES} = require("../../util");

class Drama extends Item 
{
    // @todo: rewrite return type
    async setInfo() {
        await this._setItemLinkDom();

        this._genre = this._dom.window.document.querySelector('#content .drama-info .meta [itemprop="genre"]').textContent.trim();
    }

    async getInfo() {
        return {
            [DB_PROPERTIES.GENRE]: [this._genre]
        }
    }
}

module.exports = {
    Drama
}