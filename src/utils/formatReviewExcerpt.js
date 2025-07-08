function formatReviewExcerpt(text) {
  if (text.length > 140) {
    return text.slice(0, 140) + '...';
  }
  return text;
}

module.exports = { formatReviewExcerpt };
