const config = require('../utils/config');
const {DB_PROPERTIES} = require('../util');
const notion = config.NOTION;

/**
 * 
 * @async
 * @param {uuid} databaseId 
 * @param {string} itemId 
 * @returns 
 */
async function queryNotionById(databaseId, itemId) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [ 
        {
          property: DB_PROPERTIES.ITEM_LINK,
          url: {
            contains: itemId,
          },
        },
      ]
    },
  });

  return response.results;
};

/**
 * 
 * @async 
 * @param {uuid} databaseId 
 * @returns 
 */
async function retrieveNotionDB(databaseId) {
  const response = await notion.databases.retrieve({ database_id: databaseId });
  return response;
};

/**
 *
 * @async 
 * @param {*} postData 
 * @returns 
 */
async function createNotionPage(postData) {
  const response = await notion.pages.create(postData);
  return response;
}

module.exports = {
  queryNotionById
  , retrieveNotionDB
  , createNotionPage
}