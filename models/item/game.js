const {Item} = require("../item")
const {DB_PROPERTIES} = require("../../util");
const dayjs = require("dayjs");

class Game extends Item 
{
    // @todo: rewrite return type
    setInfo() {
        const gameInfo = this._dom.window.document.querySelector('#content .game-attr');
        const dts = [...gameInfo.querySelectorAll('dt')].filter(i => i.textContent.startsWith('类型') || i.textContent.startsWith('发行日期'));
        if (dts.length) {
            dts.forEach(dt => {
                if (dt.textContent.startsWith('类型')) {
                    this._genre = [...dt.nextElementSibling.querySelectorAll('a')].map(a => a.textContent.trim()); //array
                } else if (dt.textContent.startsWith('发行日期')) {
                    let date = dt.nextElementSibling.textContent.trim();
                    this._releaseDate = dayjs(date).format('YYYY-MM-DD');
                }
            })
        }
    }

    getInfo() {
        return {
            [DB_PROPERTIES.GENRE]: this._genre
            , [DB_PROPERTIES.RELEASE_DATE]: this._releaseDate
        }
    }
}

module.exports = {
    Game
}