const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

const path = "./test.rss";

let rssdata = fs.readFileSync(path).toString();

(async () => {
    let feed;
    feed = await parser.parseString(rssdata);
    console.log(feed);
})();
