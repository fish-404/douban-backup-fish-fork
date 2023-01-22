require('dotenv').config();
const {Client} = require('@notionhq/client');
const exampleRssFilePath = "./example.rss";

const NOTION = new Client({
  auth: process.env.NOTION_TOKEN,
});

const notionDbMap = new Map([
  ['movie', process.env.NOTION_MOVIE_DATABASE_ID]
  , ['music', process.env.NOTION_MUSIC_DATABASE_ID]
  , ['book', process.env.NOTION_BOOK_DATABASE_ID]
  , ['drama', process.env.NOTION_DRAMA_DATABASE_ID]
  , ['game', process.env.NOTION_GAME_DATABASE_ID]
]);

const doubanUserUrl = `https://www.douban.com/feed/people/${process.env.DOUBAN_USER_ID}/interests`;

module.exports = {
    NOTION
    , notionDbMap
    , doubanUserUrl
    , exampleRssFilePath
}