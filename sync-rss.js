const dayjs = require('dayjs');
const got = require('got');
const {DB_PROPERTIES, PropertyType, sleep} = require('./util');
const {Item} = require('./models/item');
const {Record} = require('./models/record');
const {JSDOM} = require('jsdom');
const notionDb_helper = require('./utils/notionDb_helper');
const notionDB_Controller = require('./controllers/notionDB');
const parser_helper = require('./utils/parser_helper')

const done = /^(看过|听过|读过|玩过)/;
const CATEGORY = {
  movie: 'movie',
  music: 'music',
  book: 'book',
  game: 'game',
  drama: 'drama',
};
const EMOJI = {
  movie: '🎞',
  music: '🎶',
  book: '📖',
  game: '🕹',
  drama: '💃🏻',
};

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

  feed = feed.items.filter(item => done.test(item.title)); // care for done status items only for now
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
  const dbID = new Item(category).getNotionDbId(); 
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
    const item = feed[i];
    const link = item.link;
    let itemData;
    try {
      itemData = await fetchItem(link, category);
      itemData[DB_PROPERTIES.ITEM_LINK] = link;
      itemData[DB_PROPERTIES.RATING] = item.rating;
      itemData[DB_PROPERTIES.RATING_DATE] = dayjs(item.time).format('YYYY-MM-DD');
      itemData[DB_PROPERTIES.COMMENTS] = item.comment;
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

async function fetchItem(link, category) {
  console.log(`Fetching ${category} item with link: ${link}`);
  const itemData = {};
  const response = await got(link);
  const dom = new JSDOM(response.body);

  // movie item page
  if (category === CATEGORY.movie) {
    itemData[DB_PROPERTIES.TITLE] = dom.window.document.querySelector('#content h1 [property="v:itemreviewed"]').textContent.trim();
    itemData[DB_PROPERTIES.YEAR] = dom.window.document.querySelector('#content h1 .year').textContent.slice(1, -1);
    itemData[DB_PROPERTIES.POSTER] = dom.window.document.querySelector('#mainpic img')?.src.replace(/\.webp$/, '.jpg');
    itemData[DB_PROPERTIES.DIRECTORS] = dom.window.document.querySelector('#info .attrs').textContent;
    itemData[DB_PROPERTIES.ACTORS] = [...dom.window.document.querySelectorAll('#info .actor .attrs a')].slice(0, 5).map(i => i.textContent).join(' / ');
    itemData[DB_PROPERTIES.GENRE] = [...dom.window.document.querySelectorAll('#info [property="v:genre"]')].map(i => i.textContent); // array
    const imdbInfo = [...dom.window.document.querySelectorAll('#info span.pl')].filter(i => i.textContent.startsWith('IMDb'));
    if (imdbInfo.length) {
      itemData[DB_PROPERTIES.IMDB_LINK] = 'https://www.imdb.com/title/' + imdbInfo[0].nextSibling.textContent.trim();
    }

  // music item page
  } else if (category === CATEGORY.music) {
    itemData[DB_PROPERTIES.TITLE] = dom.window.document.querySelector('#wrapper h1 span').textContent.trim();
    itemData[DB_PROPERTIES.POSTER] = dom.window.document.querySelector('#mainpic img')?.src.replace(/\.webp$/, '.jpg');
    let info = [...dom.window.document.querySelectorAll('#info span.pl')];
    let release = info.filter(i => i.textContent.trim().startsWith('发行时间'));
    if (release.length) {
      let date = release[0].nextSibling.textContent.trim(); // 2021-05-31, or 2021-4-2
      itemData[DB_PROPERTIES.RELEASE_DATE] = dayjs(date).format('YYYY-MM-DD');
    }
    let musician = info.filter(i => i.textContent.trim().startsWith('表演者'));
    if (musician.length) {
      itemData[DB_PROPERTIES.MUSICIAN] = musician[0].textContent.replace('表演者:', '').trim().split('\n').map(v => v.trim()).join('');
      // split and trim to remove extra spaces, rich_text length limited to 2000
    }

  // book item page
  } else if (category === CATEGORY.book) {
    itemData[DB_PROPERTIES.TITLE] = dom.window.document.querySelector('#wrapper h1 [property="v:itemreviewed"]').textContent.trim();
    itemData[DB_PROPERTIES.POSTER] = dom.window.document.querySelector('#mainpic img')?.src.replace(/\.webp$/, '.jpg');
    let info = [...dom.window.document.querySelectorAll('#info span.pl')];
    info.forEach(i => {
      let text = i.textContent.trim();
      let nextText = i.nextSibling?.textContent.trim();
      if (text.startsWith('作者')) {
        let parent = i.parentElement;
        if (parent.id === 'info') { // if only one writer, then parentElement is the #info container
          itemData[DB_PROPERTIES.WRITER] = i.nextElementSibling.textContent.replace(/\n/g, '').replace(/\s/g, '');
        } else { // if multiple writers, there will be a separate <span> element
          itemData[DB_PROPERTIES.WRITER] = i.parentElement.textContent.trim().replace('作者:', '').trim();
        }
      } else if (text.startsWith('出版社')) {
        itemData[DB_PROPERTIES.PUBLISHING_HOUSE] = nextText;
      } else if (text.startsWith('原作名')) {
        itemData[DB_PROPERTIES.TITLE] += nextText;
      } else if (text.startsWith('出版年')) {
        if (/年|月|日/.test(nextText)) {
          nextText = nextText.replace(/年|月|日/g, '-').slice(0, -1); // '2000年5月' special case
        }
        itemData[DB_PROPERTIES.PUBLICATION_DATE] = dayjs(nextText).format('YYYY-MM-DD'); // this can have only year, month, but need to format to YYYY-MM-DD
      } else if (text.startsWith('ISBN')) {
        itemData[DB_PROPERTIES.ISBN] = Number(nextText);
      }
    });

  // game item page
  } else if (category === CATEGORY.game) {
    itemData[DB_PROPERTIES.TITLE] = dom.window.document.querySelector('#wrapper #content h1').textContent.trim();
    itemData[DB_PROPERTIES.POSTER] = dom.window.document.querySelector('.item-subject-info .pic img')?.src.replace(/\.webp$/, '.jpg');
    const gameInfo = dom.window.document.querySelector('#content .game-attr');
    const dts = [...gameInfo.querySelectorAll('dt')].filter(i => i.textContent.startsWith('类型') || i.textContent.startsWith('发行日期'));
    if (dts.length) {
      dts.forEach(dt => {
        if (dt.textContent.startsWith('类型')) {
          itemData[DB_PROPERTIES.GENRE] = [...dt.nextElementSibling.querySelectorAll('a')].map(a => a.textContent.trim()); //array
        } else if (dt.textContent.startsWith('发行日期')) {
          let date = dt.nextElementSibling.textContent.trim();
          itemData[DB_PROPERTIES.RELEASE_DATE] = dayjs(date).format('YYYY-MM-DD');
        }
      })
    }

  // drama item page
  } else if (category === CATEGORY.drama) {
    itemData[DB_PROPERTIES.TITLE] = dom.window.document.querySelector('#content .drama-info .meta h1').textContent.trim();
    let genre = dom.window.document.querySelector('#content .drama-info .meta [itemprop="genre"]').textContent.trim();
    itemData[DB_PROPERTIES.GENRE] = [genre];
    itemData[DB_PROPERTIES.POSTER] = dom.window.document.querySelector('.drama-info .pic img')?.src.replace(/\.webp$/, '.jpg');
  }

  return itemData;
}

function getPropertyValye(value, type, key) {
  let res = null;
  switch (type) {
    case 'title':
      res = {
        title: [
          {
            text: {
              content: value,
            },
          },
        ],
      };
      break;
    case 'file':
      res = {
        files: [
          {
            // file: {}
            name: value,
            external: { // need external:{} format to insert the files property, but still not successful
              url: value,
            },
          },
        ],
      };
      break;
    case 'date':
      res = {
        date: {
          start: value,
        },
      };
      break;
    case 'multi_select':
      res = key === DB_PROPERTIES.RATING ? {
        'multi_select': value ? [
          {
            name: value.toString(),
          },
        ] : [],
      } : {
        'multi_select': (value || []).map(g => ({
          name: g, // @Q: if the option is not created before, can not use it directly here?
        })),
      };
      break;
    case 'rich_text':
      res = {
        'rich_text': [
          {
            type: 'text',
            text: {
              content: value || '',
            },
          },
        ],
      }
      break;
    case 'number':
      res = {
        number: value ? Number(value) : null,
      };
      break;
    case 'url':
      res = {
        url: value || url,
      };
      break;
    default:
      break;
  }

  return res;
}

async function addToNotion(itemData, category) {
  console.log('Going to insert ', itemData[DB_PROPERTIES.RATING_DATE], itemData[DB_PROPERTIES.TITLE]);
  try {
    // @TODO: refactor this to add property value generator by value type
    let properties = {};
    const keys = Object.keys(DB_PROPERTIES);
    keys.forEach(key => {
      if (itemData[DB_PROPERTIES[key]]) {
        properties[DB_PROPERTIES[key]] = getPropertyValye(itemData[DB_PROPERTIES[key]], PropertyType[key], DB_PROPERTIES[key]);
      }
    });

    const dbid = new Item(category).getNotionDbId();
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

    const postData = {
      parent: {
        database_id: dbid,
      },
      icon: {
        type: 'emoji',
        emoji: EMOJI[category],
      },
      // fill in properties by the format: https://developers.notion.com/reference/page#page-property-value
      properties,
    };
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
