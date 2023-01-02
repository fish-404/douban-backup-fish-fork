const config = require("../utils/config");

const notionDbMap = new Map([
      ['movie', config.MOVIE_DB_ID]
    , ['music', config.MUSIC_DB_ID]
    , ['book', config.BOOK_DB_ID]
    , ['drama', config.DRAMA_DB_ID]
    , ['game', config.GAME_DB_ID]
]);

class Category 
{
    constructor(category) {
        this._category = category;
        this._notionDbId = notionDbMap.get(this._category);
    }

    getNotionDbId() {
        return this._notionDbId;
    }
}

module.exports = {
    Category
}