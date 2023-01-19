const config = require("../utils/config");
const got = require("got");
const {JSDOM} = require("jsdom");

const notionDbMap = new Map([
      ['movie', config.MOVIE_DB_ID]
    , ['music', config.MUSIC_DB_ID]
    , ['book', config.BOOK_DB_ID]
    , ['drama', config.DRAMA_DB_ID]
    , ['game', config.GAME_DB_ID]
]);

class Item 
{
    constructor(category) {
        this._category = category;
        this._notionDbId = notionDbMap.get(this._category);
    }

    setLink(link) {
        this._link = link;
    }

    getNotionDbId() {
        return this._notionDbId;
    }

    async _setItemLinkDom() {
        const response = await got(this._link);
        this._dom = new JSDOM(response.body);
    }
}

module.exports = {
    Item
}