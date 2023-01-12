const RATING_TEXT = {
  '很差': 1,
  '较差': 2,
  '还行': 3,
  '推荐': 4,
  '力荐': 5,
};

function getRating(contents) {
    let rating = contents.filter(el => el.textContent.startsWith('推荐'));
    if (rating.length) {
      rating = rating[0].textContent.slice(3).trim();
      rating = RATING_TEXT[rating];
    }
    return typeof rating === 'number' ? rating : null;
}

function getComment(contents) {
    let comment = contents.filter(el => el.textContent.startsWith('备注'));
    if (comment.length) {
      comment = comment[0].textContent.replace(/^备注: /, '').trim();
    }

    // 备注：XXX -> 短评
    return typeof comment === 'string' ? comment : null;
}

function getPoster(dom) {
  return dom.window.document.querySelector('img').src.replace(/\.webp$/, '.jpg');
}

/**
 * Rss data title
 * @param {*} dom 
 * @returns 
 * @todo 
 * type   | douban 页面      | Rss Title    | Rss des title 
 * 影视   | 简体中文名 + 原名 | 简体中文名    | 原名
 * 书籍   | 书名             | 书名          | 书名
 * 游戏   | 中文名 + 原名     | 中文名 + 原名 | 中文名 + 原名
 * 音乐   | 唱片名            | 唱片名       | 唱片名
 * 舞台剧 | 剧目名称          | 剧目名称      | 剧目名称
 */
function getTitle(dom) {
  return dom.window.document.querySelector('td a').title;
}

module.exports = {
    getRating
    , getComment
    , getPoster
    , getTitle
}