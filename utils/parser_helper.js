const config = require('../utils/config');
const fs = require("fs");
const Parser = require('rss-parser');
const parser = new Parser();

/**
 * Get rss data from rss rousource
 * If NODE_ENV = test, rss resource is exampleRss file, or douban users Url
 * @async
 * @returns 
 */
async function getRssData() {
    if (process.env.NODE_ENV === 'test') {
        const localRssStr = fs.readFileSync((config.exampleRssFilePath).toString());
        return await parser.parseString(localRssStr);
    }
    else {
        return await parser.parseURL(config.doubanUserUrl);
    }
}

module.exports = {
    getRssData
}