const {DB_PROPERTIES, PropertyType, sleep} = require('./utils/util');
const {Record} = require('./models/record');
const notionDb_helper = require('./utils/notionDb_helper');
const notionDB_Controller = require('./controllers/notionDB');
const parser_helper = require('./utils/parser_helper')
const itemData_helper = require("./utils/itemData_helper");

(async () => {
  console.log('Refreshing feeds from RSS...');
  let feed;

  try {
    feed = await parser_helper.getRssData();
  } catch (error) {
    console.error('Failed to parse RSS url: ', error);
    process.exit(1);
  }

  let feedData = {};

  feed = feed.items.filter(item => itemData_helper.getItemStatus(item.title) === "done"); // care for done status items only for now
  feed.forEach(item => {
    const record = new Record(item);
    const category = record.getCategory();
    if (!feedData[category]) {
      feedData[category] = [];
    }
    feedData[category].push(record.getResult());
  });

  if (feed.length === 0) {
    console.log('No new items.');
    return;
  }

  const categoryKeys = Object.keys(feedData);
  if (categoryKeys.length) {
    for (const cateKey of categoryKeys) {
      try {
        await handleFeed(feedData[cateKey], cateKey);
      } catch (error) {
        console.error(`Failed to handle ${cateKey} feed. `, error);
        process.exit(1);
      }
    }
  }

  console.log('All feeds are handled.');
})();

async function handleFeed(feed, category) {
  if (feed.length === 0) {
    console.log(`No new ${category} feeds.`);
    return;
  }
  const dbID = itemData_helper.getNotionDbIdByCategory(category);
  if (!dbID) {
    console.log(`No notion database id for ${category}`);
    return;
  }

  console.log(`Handling ${category} feeds...`);
  // query current db to check whether already inserted
  let filtered;
  try {
    filtered = await notionDb_helper.queryNotionDbByFeedData(dbID, feed);
  } catch (error) {
    console.error(`Failed to query ${category} database to check already inserted items. `, error);
    process.exit(1);
  }

  if (filtered.results.length) {
    feed = feed.filter(item => {
      let findItem = filtered.results.filter(i => i.properties[DB_PROPERTIES.ITEM_LINK].url === item.link);
      return !findItem.length; // if length != 0 means can find item in the filtered results, means this item already in db
    });
  }

  console.log(`There are total ${feed.length} new ${category} item(s) need to insert.`);

  for (let i = 0; i < feed.length; i++) {
    let itemData;
    try {
      itemData = await itemData_helper.getItemData(feed[i]);
    } catch (error) {
      console.error(link, error);
    }

    if (itemData) {
      await addToNotion(itemData, category);
      await sleep(1000);
    }
  }
  console.log(`${category} feeds done.`);
  console.log('====================');
}

async function addToNotion(itemData, category) {
  console.log('Going to insert ', itemData[DB_PROPERTIES.RATING_DATE], itemData[DB_PROPERTIES.TITLE]);
  try {
    // @TODO: refactor this to add property value generator by value type
    let properties = {};
    const keys = Object.keys(DB_PROPERTIES);
    keys.forEach(key => {
      if (itemData[DB_PROPERTIES[key]]) {
        properties[DB_PROPERTIES[key]] = itemData_helper.getPropertyValue(itemData[DB_PROPERTIES[key]], PropertyType[key], DB_PROPERTIES[key]);
      }
    });

    const dbid = itemData_helper.getNotionDbIdByCategory(category);
    if (!dbid) {
      throw new Error('No databse id found for category: ' + category);
    }

    const columns = await notionDb_helper.getNotionDbProperties(dbid);

    // remove cols which are not in the current database
    const propKeys = Object.keys(properties);
    propKeys.map(prop => {
      if (columns.indexOf(prop) < 0) {
        delete properties[prop];
      }
    });

    let postData = itemData_helper.getNotionPostData(dbid, category, properties);

    if (properties[DB_PROPERTIES.POSTER]) {
      // use poster for the page cover
      postData.cover = {
        type: 'external',
        external: {
          url: properties[DB_PROPERTIES.POSTER]?.files[0]?.external?.url, // cannot be empty string or null
        },
      }
    }

    const response = await notionDB_Controller.createNotionPage(postData);
    
    if (response && response.id) {
      console.log(itemData[DB_PROPERTIES.TITLE] + `[${itemData[DB_PROPERTIES.ITEM_LINK]}]` + ' page created.');
    }
  } catch (error) {
    console.warn('Failed to create ' + itemData[DB_PROPERTIES.TITLE] + `(${itemData[DB_PROPERTIES.ITEM_LINK]})` + ' with error: ', error);
  }
}
