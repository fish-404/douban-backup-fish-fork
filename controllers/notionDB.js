const config = require('../utils/config');
const {DB_PROPERTIES} = require('../util');
const notion = config.NOTION;

async function queryNotionDbByFilters(databaseId, filters) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filters,
  })
  return response;
}

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
  queryNotionDbByFilters
  , retrieveNotionDB
  , createNotionPage
}