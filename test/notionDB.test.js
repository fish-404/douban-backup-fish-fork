const assert = require('assert')
const config = require('../utils/config');
const notion = config.NOTION;
const dbController = require('../controllers/notionDB')
const itemId = "26899530";
const fakeDBId = "bc1211ca-e3f1-4939-ae34-5260b16f627c";

describe('notion db controllers tests', () => {
    describe("query db", () => {
        it ('should be not empty', async () => {
            const data = await dbController.queryNotionById(config.BOOK_DB_ID, itemId); 
            assert.equal(1, data.length);
        })
    })

    describe("retrieve db", () => {
        it ('should be not empty', async () => {
            const data = await dbController.retrieveNotionDB(config.BOOK_DB_ID);
            assert.ok(data);
        })

        it ('should fail: fake db id', () => {
            assert.rejects(async()=>{
                await dbController.retrieveNotionDB(fakeDBId);
            }, {
                name: 'APIResponseError'
            })
        })
    })
})