const config = require("../utils/config");
const notionDbMap = new Map([
  ['movie', config.MOVIE_DB_ID]
  , ['music', config.MUSIC_DB_ID]
  , ['book', config.BOOK_DB_ID]
  , ['drama', config.DRAMA_DB_ID]
  , ['game', config.GAME_DB_ID]
]);

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

const CATEGORY = {
  movie: 'movie',
  music: 'music',
  book: 'book',
  game: 'game',
  drama: 'drama',
};

async function fetchItem(link, category) {
  console.log(`Fetching ${category} item with link: ${link}`);
  let item;

  // movie item page
  if (category === CATEGORY.movie) {
    item = await new Movie(link);
  // music item page
  } else if (category === CATEGORY.music) {
    item = await new Music(link);
  // book item page
  } else if (category === CATEGORY.book) {
    item = await new Book(link);
  // game item page
  } else if (category === CATEGORY.game) {
    item = await new Game(link);
  // drama item page
  } else if (category === CATEGORY.drama) {
    item = await new Drama(link);
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
