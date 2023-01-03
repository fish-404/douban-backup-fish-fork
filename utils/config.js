require('dotenv').config();
const {Client} = require('@notionhq/client');
const fs = require("fs");
const path = "./example.rss";

const NOTION = new Client({
  auth: process.env.NOTION_TOKEN,
});
const MOVIE_DB_ID = process.env.NOTION_MOVIE_DATABASE_ID;
const MUSIC_DB_ID = process.env.NOTION_MUSIC_DATABASE_ID;
const BOOK_DB_ID = process.env.NOTION_BOOK_DATABASE_ID;
const GAME_DB_ID = process.env.NOTION_GAME_DATABASE_ID;
const DRAMA_DB_ID = process.env.NOTION_DRAMA_DATABASE_ID;

const doubanUserUrl = `https://www.douban.com/feed/people/${process.env.DOUBAN_USER_ID}/interests`;
const localRssStr = fs.readFileSync((path).toString());

module.exports = {
    NOTION
    , MOVIE_DB_ID
    , MUSIC_DB_ID
    , BOOK_DB_ID
    , GAME_DB_ID
    , DRAMA_DB_ID
    , doubanUserUrl
    , localRssStr
}