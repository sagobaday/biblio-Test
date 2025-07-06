/* 
formatReviewExcerpt.test.js tests truncation logic for long review texts 
*/
const { formatReviewExcerpt } = require('../../src/utils/formatReviewExcerpt');

describe('formatReviewExcerpt', () => {
  test('text longer than 140 characters', () => {
    const longText = 'a'.repeat(150);
    const result = formatReviewExcerpt(longText);
    expect(result).toBe(longText.slice(0, 140) + '...');
  });

  test('short text', () => {
    const shortText = 'a'.repeat(50);
    expect(formatReviewExcerpt(shortText)).toBe(shortText);
  });
});
