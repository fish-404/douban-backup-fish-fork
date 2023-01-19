const {Item} = require("../item")
const {DB_PROPERTIES} = require("../../util");
const dayjs = require("dayjs");

class Music extends Item 
{
    // @todo: rewrite return type
    async setInfo() {
        await this._setItemLinkDom();
        let info = [...this._dom.window.document.querySelectorAll('#info span.pl')];
        let release = info.filter(i => i.textContent.trim().startsWith('发行时间'));
        if (release.length) {
            let date = release[0].nextSibling.textContent.trim(); // 2021-05-31, or 2021-4-2
            this._releaseDate = dayjs(date).format('YYYY-MM-DD');
        }
        let musician = info.filter(i => i.textContent.trim().startsWith('表演者'));
        if (musician.length) {
            this._musician = musician[0].textContent.replace('表演者:', '').trim().split('\n').map(v => v.trim()).join('');
            // split and trim to remove extra spaces, rich_text length limited to 2000
        } 
    }

    async getInfo() {
        return {
            [DB_PROPERTIES.RELEASE_DATE]: this._releaseDate
            , [DB_PROPERTIES.MUSICIAN]: this._musician
        }
    }
}

module.exports = {
    Music
}