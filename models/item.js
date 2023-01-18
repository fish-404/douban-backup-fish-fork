const config = require("../utils/config");
const got = require("got");
const {JSDOM} = require("jsdom");
const {DB_PROPERTIES} = require('../util');

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

class Movie extends Item 
{
    // @todo: rewrite return type
    async setInfo() {
        await this._setItemLinkDom();
        // 对应条目括号内的年份(非上映日期)
        this._year = this._dom.window.document.querySelector('#content h1 .year').textContent.slice(1, -1);
        this._directors = this._dom.window.document.querySelector('#info .attrs').textContent;
        this._actors = [...this._dom.window.document.querySelectorAll('#info .actor .attrs a')].slice(0, 5).map(i => i.textContent).join(' / ');
        this._genre = [...this._dom.window.document.querySelectorAll('#info [property="v:genre"]')].map(i => i.textContent); // array
        this._imdbNo = [...this._dom.window.document.querySelectorAll('#info span.pl')].filter(i => i.textContent.startsWith('IMDb'));
        if (this._imdbNo.length) {
          this._imdbLink = 'https://www.imdb.com/title/' + this._imdbNo[0].nextSibling.textContent.trim();
        }
    }

    async getInfo() {
        return {
            [DB_PROPERTIES.YEAR]: this._year
            , [DB_PROPERTIES.DIRECTORS]: this._directors
            , [DB_PROPERTIES.ACTORS]: this._actors
            , [DB_PROPERTIES.GENRE]: this._genre
            , [DB_PROPERTIES.IMDB_LINK]: this._imdbLink
        }
    }
}

module.exports = {
    Item
    , Movie
}