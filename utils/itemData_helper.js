const config = require("../utils/config");
const notionDbMap = new Map([
  ['movie', config.MOVIE_DB_ID]
  , ['music', config.MUSIC_DB_ID]
  , ['book', config.BOOK_DB_ID]
  , ['drama', config.DRAMA_DB_ID]
  , ['game', config.GAME_DB_ID]
]);

function getNotionDbIdByCategory(category) {
  return notionDbMap.get(category);
}

function getCategoryByLink(link) {
  return link.match(/movie|drama|book|game|music/g)[0];
}

function getIdByLink(link) {
  return link.match(/\d+/)[0];
}

module.exports = {
  getCategoryByLink
  , getIdByLink
  , getNotionDbIdByCategory
}
