const { newDb } = require('pg-mem');

describe('system test with ephemeral database', () => {
  let db;

  beforeEach(() => {
    // Start an in-memory Postgres instance
    db = newDb();

    // Apply schema (migrations)
    db.public.none(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // Seed fixture data
    db.public.none(`
      INSERT INTO users (name) VALUES
      ('alice'),
      ('bob');
    `);
  });

  afterEach(() => {
    // Drop the database by clearing the reference
    db = null;
  });

  test('reads seeded rows', () => {
    const rows = db.public.many('SELECT name FROM users ORDER BY id');
    expect(rows.map(r => r.name)).toEqual(['alice', 'bob']);
  });

  test('can insert and query', () => {
    db.public.none("INSERT INTO users(name) VALUES('carol')");
    const { name } = db.public.one("SELECT name FROM users WHERE name='carol'");
    expect(name).toBe('carol');
  });
});
