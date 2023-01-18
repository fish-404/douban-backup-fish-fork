const assert = require('assert');
const {Movie} = require("../models/item");
const link = "https://movie.douban.com/subject/26884826/";

describe("Item model test", () => {
    describe("movie info test", () => {
        it ('should be equal', async () => {
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
            // @todo rewrite comapre
            assert.equal(result, actual);
        })
    })
})