const assert = require('assert');
const itemData_helper = require('../utils/itemData_helper')
const link = "https://movie.douban.com/subject/26884826/";

describe("itemData_helper tests", () => {
    describe("get Id", () => {
        const id = itemData_helper.getIdByLink(link);
        it('should be 26884826', function() {
            assert.equal("26884826", id);
        })
    })

    describe("get category", () => {
        const category = itemData_helper.getCategoryByLink(link);
        it ("should be movie", function() {
            assert.equal("movie", category);
        })
    }) 
})