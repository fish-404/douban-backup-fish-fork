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

module.exports = {
    getRating
    , getComment
}