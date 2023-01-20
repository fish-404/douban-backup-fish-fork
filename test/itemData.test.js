const assert = require('assert');
const {Movie} = require("../models/item/movie");
const {Music} = require("../models/item/music");
const {Book} = require("../models/item/book");
const {Game} = require('../models/item/game');
const {Drama} = require('../models/item/drama');

describe("Item model test", () => {
    // @todo refactor tests (similar tests)
    describe("movie info test", () => {
        it ('should be equal', async() => {
            const link = "https://movie.douban.com/subject/26884826/";
            const item = await new Movie(link);
            item.setInfo();
            const result = item.getInfo();
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
            const link = "https://music.douban.com/subject/1907886/";
            const item = await new Music(link);
            item.setInfo();
            const result = item.getInfo();
            const actual = { '发行日期': '2006-06-06', '音乐家': 'Glenn Gould' };
            assert.deepEqual(actual, result);
        })
    })

    describe('book info test', () => {
        it ("should be equal", async () => {
            const actual = {
                '作者': '西蒙.德.波娃(Simone de Beauvoir)',
                '出版社': '貓頭鷹出版社',
                '标题': 'undefinedLe Deuxième Sexe',
                '出版日期': '2013-10-01',
                ISBN: 9789862621752
            }

            const link = "https://book.douban.com/subject/25712807/";
            const item = await new Book(link);
            item.setInfo();
            const result = item.getInfo();
            assert.deepEqual(actual, result);
        })
    })

    describe('game info test', () => {
        it ("should be equal", async () => {
            const actual = { '类型': [ '游戏', '文字冒险', '模拟' ], '发行日期': '2017-09-16' };
            const link = "https://www.douban.com/game/27613278/";
            const item = await new Game(link);
            item.setInfo();
            const result = item.getInfo();
            assert.deepEqual(actual, result);
        })
    })
    
    describe('drama info test', () => {
        it ("should be equal", async () => {
            const actual = { '类型': [ '舞台剧' ] };
            const link = "https://www.douban.com/location/drama/26701244/";
            const item = await new Drama(link);
            item.setInfo();
            const result = item.getInfo();
            assert.deepEqual(actual, result);
        })
    })
})