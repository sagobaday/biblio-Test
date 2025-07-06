jest.mock('../../src/repositories/bookRepo');
jest.mock('../../src/services/emailService');

const bookRepo = require('../../src/repositories/bookRepo');
const emailService = require('../../src/services/emailService');
const { proposeSwap } = require('../../src/services/swapService');

afterEach(() => {
  jest.clearAllMocks();
});

test('book already swapped', async () => {
  bookRepo.findById.mockResolvedValue({ status: 'swapped' });
  await expect(proposeSwap(1, 'user')).rejects.toThrow('BOOK_UNAVAILABLE');
  expect(emailService.send).not.toHaveBeenCalled();
});

test('happy path', async () => {
  bookRepo.findById.mockResolvedValue({ status: 'available' });
  await proposeSwap(1, 'user');
  expect(emailService.send).toHaveBeenCalledTimes(1);
});
