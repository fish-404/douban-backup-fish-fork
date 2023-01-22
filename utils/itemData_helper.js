const {notionDbMap} = require("../utils/config");
const { Music } = require('../models/item/music');
const { Book } = require('../models/item/book');
const { Game } = require('../models/item/game');
const { Drama } = require('../models/item/drama');
const { Movie } = require("../models/item/movie");

function getNotionDbIdByCategory(category) {
  return notionDbMap.get(category);
}

function getCategoryByLink(link) {
  return link.match(/movie|drama|book|game|music/g)[0];
}

function getIdByLink(link) {
  return link.match(/\d+/)[0];
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

module.exports = {
  getCategoryByLink
  , getIdByLink
  , getNotionDbIdByCategory
  , fetchItem
}
