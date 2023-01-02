const RATING_TEXT = {
  '很差': 1,
  '较差': 2,
  '还行': 3,
  '推荐': 4,
  '力荐': 5,
};

function getCategoryAndId(title, link) {
  const done = /^(看过|听过|读过|玩过)/;
  const CATEGORY = {
    movie: 'movie',
    music: 'music',
    book: 'book',
    game: 'game',
    drama: 'drama',
  };
  let m = title.match(done);
  m = m[1];
  let res, id;
  switch (m) {
    case '看过':
      if (link.startsWith('http://movie.douban.com/')) {
        res = CATEGORY.movie; // "看过" maybe 舞台剧
        id = link.match(/movie\.douban\.com\/subject\/(\d+)\/?/);
        id = id[1]; // string
      } else {
        res = CATEGORY.drama; // 舞台剧
        id = link.match(/www\.douban\.com\/location\/drama\/(\d+)\/?/);
        id = id[1]; // string
      }
      break;
    case '读过':
      res = CATEGORY.book;
      id = link.match(/book\.douban\.com\/subject\/(\d+)\/?/);
      id = id[1]; // string
      break;
    case '听过':
      res = CATEGORY.music;
      id = link.match(/music\.douban\.com\/subject\/(\d+)\/?/);
      id = id[1]; // string
      break;
    case '玩过':
      res = CATEGORY.game;
      id = link.match(/www\.douban\.com\/game\/(\d+)\/?/);
      id = id[1]; // string
      break;
    default:
      break;
  }

  return {category: res, id};
}

function getId(link) {
    return link.match(/\d+/)[0];
}

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
    , getCategoryAndId
    , getId
}