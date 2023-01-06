const assert = require('assert');
const notionDB_helper = require('../utils/notionDb_helper');
const {BOOK_DB_ID} = require('../utils/config')

describe('notion db helper tests', () => {
    describe("get db properties",  () => {
        it ('shoud be equal', async () => {
            const properties = await notionDB_helper.getNotionDbProperties(BOOK_DB_ID);
            const actual = [
                '海报',     '出版日期',
                '个人评分', '出版社',
                '作者',     '条目链接',
                '我的短评', 'ISBN',
                '打分日期', '标题'
            ]
            assert.equal(actual.length, properties.length);
        }) 
    })
})

