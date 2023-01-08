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
      rating = rating[0].textContent.replace(/^推荐: /, '').trim();
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
 * 对于影视作品，此处的 title 是原名
 * douban 影视作品页面的 title 是简体中文名+原名
 * 对于 db 似乎分开比较好
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