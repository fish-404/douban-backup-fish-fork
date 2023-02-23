const {Item} = require("../item")
const {DB_PROPERTIES} = require("../../utils/util");
const dayjs = require("dayjs");

class Book extends Item 
{
    // @todo: rewrite return type
    setInfo() {
        let info = [...this._dom.window.document.querySelectorAll('#info span.pl')];
        info.forEach(i => {
            let text = i.textContent.trim();
            let nextText = i.nextSibling?.textContent.trim();
            if (text.startsWith('作者')) {
                let parent = i.parentElement;
                if (parent.id === 'info') { // if only one writer, then parentElement is the #info container
                    this._writer = i.nextElementSibling.textContent.replace(/\n/g, '').replace(/\s/g, '');
                } else { // if multiple writers, there will be a separate <span> element
                    this._writer = i.parentElement.textContent.trim().replace('作者:', '').trim();
                }
            } else if (text.startsWith('出版社')) {
                this._publishingHouse = nextText;
            } else if (text.startsWith('原作名')) {
                this._title += nextText;
            } else if (text.startsWith('出版年')) {
                if (/年|月|日/.test(nextText)) {
                    nextText = nextText.replace(/年|月|日/g, '-').slice(0, -1); // '2000年5月' special case
                }
                this._publicationDate = dayjs(nextText).format('YYYY-MM-DD'); // this can have only year, month, but need to format to YYYY-MM-DD
            } else if (text.startsWith('ISBN')) {
                this._isbn = Number(nextText);
            }
        })
    }

    getInfo() {
        return {
            [DB_PROPERTIES.WRITER]: this._writer
            , [DB_PROPERTIES.PUBLISHING_HOUSE]: this._publishingHouse
            , [DB_PROPERTIES.TITLE]: this._title
            , [DB_PROPERTIES.PUBLICATION_DATE]: this._publicationDate
            , [DB_PROPERTIES.ISBN]: this._isbn
        }
    }
}

module.exports = {
    Book
}