const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database.');

  db.all('SELECT * FROM skus', [], (err, rows) => {
    if (err) {
      console.error('Error querying table:', err.message);
      return;
    }
    console.log('SKUs in database:');
    console.table(rows);
    db.close();
  });
});