const assert = require('assert');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const itemData_helper = require('../utils/recordData_helper');

const content = '\n' +
        '\n' +
        '    <table><tr>\n' +
        '    <td width="80px"><a href="https://movie.douban.com/subject/26884826/" title="日常對話">\n' +
        '    <img src="https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2499696096.webp" alt="日常對話"></a></td>\n' +
        '    <td>\n' +
        '        <p>推荐: 力荐</p>\n' +
        '        <p>备注: test' +
        '「我們以爲，只要都不提起，總有一天我們就能把那些過去都忘記，但是什麽都不説，反而讓我們記得更加清楚」</p>\n' +
        '    </td></tr></table>\n';

const dom = new JSDOM(content.trim());
const contents = [...dom.window.document.querySelectorAll('td p')];
const link = "https://movie.douban.com/subject/26884826/";
const title = "看过日常对话";

describe("itemData_helper test", () => {
    describe("get rating", () => {
        const rating = itemData_helper.getRating(contents);
        it('should be 5', function() {
            assert.equal(5, rating);
        })
    })

    describe("get Id", () => {
        const id = itemData_helper.getId(link);
        it('id test', function() {
            assert.equal("26884826", id);
        })
    })
})

