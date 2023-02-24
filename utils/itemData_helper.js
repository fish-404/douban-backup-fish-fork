const {notionDbMap, EMOJI} = require("../utils/config");
const { Music } = require('../models/item/music');
const { Book } = require('../models/item/book');
const { Game } = require('../models/item/game');
const { Drama } = require('../models/item/drama');
const { Movie } = require("../models/item/movie");
const {DB_PROPERTIES} = require("./util");

function getNotionDbIdByCategory(category) {
  return notionDbMap.get(category);
}

function getCategoryByLink(link) {
  return link.match(/movie|drama|book|game|music/g)[0];
}

function getIdByLink(link) {
  return link.match(/\d+/)[0];
}

function getItemStatus(title) {
  const done = /^(看过|听过|读过|玩过)/;
  const doing = /^(在看|最近在听|最近在读|最近在玩)/;
  const toDo = /^(想看|想听|想读|想玩)/;

  let status;
  if (title.match(done)) {
    status = "done";
  }
  else if (title.match(doing)) {
    status = "doing";
  }
  else if (title.match(toDo)) {
    status = "toDo";
  }

  return status;
}

/**
 * @async 
 * @param {string} link - douban item link
 * @returns 
 */
async function fetchItem(link) {
  let category = getCategoryByLink(link);
  console.log(`Fetching ${category} item with link: ${link}`);
  let item;

  switch (category) {
    case 'movie':
      item = await new Movie(link);
      break;
    case 'music':
      item = await new Music(link);
      break;
    case 'book':
      item = await new Book(link);
      break;
    case 'game':
      item = await new Game(link);
      break;
    case 'drama':
      item = await new Drama(link);
      break;
  }
  item.setInfo();
  return item.getInfo();
}

function getPropertyValue(value, type, key) {
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

function getNotionPostData(dbid, category, properties) {
  let postData = {
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

  return postData;
}

module.exports = {
  getCategoryByLink
  , getIdByLink
  , getNotionDbIdByCategory
  , getPropertyValue
  , fetchItem
  , getItemStatus
  , getNotionPostData
}
