const {Item} = require("../item")
const {DB_PROPERTIES} = require("../../util");

class Movie extends Item 
{
    // @todo: rewrite return type
    setInfo() {
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

    getInfo() {
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
    Movie
}