const config = require('../utils/config');
const {DB_PROPERTIES} = require('../util');
const notion = config.NOTION;

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

module.exports = {
  queryNotionById
}