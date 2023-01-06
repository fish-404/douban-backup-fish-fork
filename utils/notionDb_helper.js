const dbController = require('../controllers/notionDB');

async function getNotionDbProperties(notionDbId) {
    return Object.keys((await dbController.retrieveNotionDB(notionDbId)).properties);
}

module.exports = {
    getNotionDbProperties
}