// Import the pg-mem library to create an in-memory Postgres instance
const { newDb } = require('pg-mem');

describe('system tests with pg-mem', () => {
  let db; // Will hold our in-memory database instance

  beforeEach(() => {
    // 1) Start a fresh in-memory database before each test
    db = newDb();

    // 2) Apply the full schema/migrations
    // Create a 'books' table with an auto-incrementing ID and a text column
    db.public.none(`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT
      );
    `);
    // Create a 'users' table with an auto-incrementing ID and a non-null name column
    db.public.none(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // 3) Seed all fixtures (initial data for tests)
    // Insert two sample book entries
    db.public.none(`
      INSERT INTO books (title) VALUES
      ('Book1'),
      ('Book2');
    `);
    // Insert two sample user entries
    db.public.none(`
      INSERT INTO users (name) VALUES
      ('alice'),
      ('bob');
    `);
  });

  afterEach(() => {
    // Drop the in-memory database by removing our reference
    db = null;
  });

  test('reads data from books table', () => {
    // Query all book titles, ordered by their ID
    const rows = db.public.many('SELECT title FROM books ORDER BY id');
    // Assert that the returned rows match our seeded data
    expect(rows).toEqual([
      { title: 'Book1' },
      { title: 'Book2' },
    ]);
  });

  test('reads seeded rows from users', () => {
    // Query all user names, ordered by their ID
    const names = db.public.many('SELECT name FROM users ORDER BY id')
                     // Extract just the name field from each row
                     .map(r => r.name);
    // Assert that the user names match our seeded data
    expect(names).toEqual(['alice', 'bob']);
  });

  test('can insert and query a new user', () => {
    // Insert a new user named 'carol'
    db.public.none("INSERT INTO users(name) VALUES('carol')");
    // Query the newly inserted user
    const { name } = db.public.one(
      "SELECT name FROM users WHERE name='carol'"
    );
    // Assert that the queried name matches what we inserted
    expect(name).toBe('carol');
  });
});