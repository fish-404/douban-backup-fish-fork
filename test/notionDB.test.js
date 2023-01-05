const assert = require('assert')
const config = require('../utils/config');
const notion = config.NOTION;
const dbController = require('../controllers/notionDB')
const itemId = "26899530";

describe('notion db controllers tests', () => {
    describe("query db", () => {
        it ('should be not empty', async () => {
            const data = await dbController.queryNotionById(config.BOOK_DB_ID, itemId); 
            assert.equal(1, data.length);
        })
    })
})