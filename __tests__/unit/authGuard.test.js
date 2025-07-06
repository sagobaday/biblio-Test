const authGuard = require('../../src/middleware/authGuard');

test('unauthenticated request', () => {
  const req = { session: null };
  const res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
  const next = jest.fn();

  authGuard(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});
