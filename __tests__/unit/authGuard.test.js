/* 
Unit tests (__tests__/unit/) verify small functions or services in isolation:
Unit tests cover individual utility functions, middleware, and services.


authGuard.test.js checks the authentication middleware 
and ensures a missing session returns a 401 status.
 */

const authGuard = require('../../src/middleware/authGuard');

test('unauthenticated request', () => {
  const req = { session: null };
  const res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
  const next = jest.fn();

  authGuard(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});
