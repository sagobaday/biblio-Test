const { newDb } = require('pg-mem');

describe('system test with ephemeral database', () => {
  let db;

  beforeEach(() => {
    db = newDb();
    db.public.none('CREATE TABLE books(id SERIAL PRIMARY KEY, title TEXT);');
    db.public.none("INSERT INTO books(title) VALUES ('Book1'), ('Book2');");
  });

  test('reads data from in-memory db', () => {
    const rows = db.public.many('SELECT title FROM books ORDER BY id');
    expect(rows).toEqual([
      { title: 'Book1' },
      { title: 'Book2' },
    ]);
  });
});
