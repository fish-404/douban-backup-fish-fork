function getCategoryByLink(link) {
  return link.match(/movie|drama|book|game|music/g)[0];
}

function getIdByLink(link) {
  return link.match(/\d+/)[0];
}

module.exports = {
  getCategoryByLink
  , getIdByLink
}
