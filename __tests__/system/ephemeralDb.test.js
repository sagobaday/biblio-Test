const { newDb } = require('pg-mem');

describe('system tests with pg-mem', () => {
  let db;

  beforeEach(() => {
    db = newDb();

    // 1) Apply your full schema/migrations:
    db.public.none(`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT
      );
    `);
    db.public.none(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // 2) Seed all fixtures
    db.public.none(`
      INSERT INTO books (title) VALUES
      ('Book1'),
      ('Book2');
    `);
    db.public.none(`
      INSERT INTO users (name) VALUES
      ('alice'),
      ('bob');
    `);
  });

  afterEach(() => {
    // drop the in-memory DB
    db = null;
  });

  test('reads data from books table', () => {
    const rows = db.public.many('SELECT title FROM books ORDER BY id');
    expect(rows).toEqual([
      { title: 'Book1' },
      { title: 'Book2' },
    ]);
  });

  test('reads seeded rows from users', () => {
    const names = db.public.many('SELECT name FROM users ORDER BY id')
                     .map(r => r.name);
    expect(names).toEqual(['alice', 'bob']);
  });

  test('can insert and query a new user', () => {
    db.public.none("INSERT INTO users(name) VALUES('carol')");
    const { name } = db.public.one(
      "SELECT name FROM users WHERE name='carol'"
    );
    expect(name).toBe('carol');
  });
});
