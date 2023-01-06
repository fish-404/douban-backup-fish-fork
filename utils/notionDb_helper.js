const dbController = require('../controllers/notionDB');
const {DB_PROPERTIES} = require('../util');

/**
 *
 * @async 
 * @param {uuid} notionDbId 
 * @returns 
 */
async function getNotionDbProperties(notionDbId) {
    return Object.keys((await dbController.retrieveNotionDB(notionDbId)).properties);
}

function getUrlFilters(feedData) {
    return {
        or: feedData.map(item => ({
            property: DB_PROPERTIES.ITEM_LINK
            , url: {
                contains: item.id,
                // use id to check whether an item is already inserted, better than url
                // as url may be http/https, ending with or without 
            },
        })),
    }
}

async function queryNotionDbByFeedData(notionDbId, feedData) {
    return await dbController.queryNotionDbByFilters(notionDbId, getUrlFilters(feedData));
}

module.exports = {
    getNotionDbProperties
    , queryNotionDbByFeedData
}