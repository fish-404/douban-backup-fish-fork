const assert = require('assert');
const {Movie} = require("../models/item/movie");
const {Music} = require("../models/item/music");

describe("Item model test", () => {
    describe("movie info test", () => {
        it ('should be equal', async () => {
            const link = "https://movie.douban.com/subject/26884826/";
            const movieItem = new Movie('movie');
            movieItem.setLink(link);
            await movieItem.setInfo();
            const result = await movieItem.getInfo();
            const actual = {
                '上映年份': '2016',
                '导演': '黄惠侦',
                '主演': '黄惠侦',
                '类型': [ '纪录片', '同性' ],
                'IMDb 链接': 'https://www.imdb.com/title/tt6041174'
            }
            assert.deepEqual(actual, result);
        })
    })

    describe("music info test", () => {
        it ("should be equal", async () => {
            const item = new Music();
            const link = "https://music.douban.com/subject/1907886/";
            item.setLink(link);
            item.setLink(link);
            await item.setInfo();
            const result = await item.getInfo();
            const actual = { '发行日期': '2006-06-06', '音乐家': 'Glenn Gould' };
            assert.deepEqual(actual, result);
        })
    })
})