const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5001; // Using port 5001 to avoid conflicts

// Middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Parse JSON bodies

// Initialize SQLite database
const dbPath = './database.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database at', dbPath);

  // Create skus table
  db.run(`
    CREATE TABLE IF NOT EXISTS skus (
      sku_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating skus table:', err.message);
      return;
    }
    console.log('Skus table created or already exists.');

    // Insert sample data
    const sampleSkus = [
      ['SKU123', 'Laptop', 'active', new Date().toISOString()],
      ['SKU456', 'Phone', 'active', new Date().toISOString()]
    ];

    const insertStmt = db.prepare('INSERT OR IGNORE INTO skus (sku_id, name, status, created_at) VALUES (?, ?, ?, ?)');
    sampleSkus.forEach((sku, index) => {
      insertStmt.run(sku, (err) => {
        if (err) {
          console.error(`Error inserting SKU ${sku[0]}:`, err.message);
        } else {
          console.log(`Inserted or skipped SKU ${sku[0]}`);
        }
        // Finalize after the last SKU
        if (index === sampleSkus.length - 1) {
          insertStmt.finalize();
        }
      });
    });
  });
});

// List all SKUs endpoint
app.get('/skus', (req, res) => {
  db.all('SELECT * FROM skus', [], (err, rows) => {
    if (err) {
      console.error('Error querying skus:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    console.log('Fetched SKUs:', rows);
    res.status(200).json(rows);
  });
});

// Deactivate SKU endpoint
app.post('/deactivate-sku', (req, res) => {
  const { sku_id } = req.body;

  if (!sku_id || typeof sku_id !== 'string' || !sku_id.trim()) {
    return res.status(400).json({ error: 'Invalid or missing sku_id' });
  }

  db.get('SELECT status FROM skus WHERE sku_id = ?', [sku_id], (err, row) => {
    if (err) {
      console.error('Error querying SKU:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'SKU not found' });
    }
    if (row.status === 'inactive') {
      return res.status(400).json({ error: 'SKU is already deactivated' });
    }

    db.run('UPDATE skus SET status = ? WHERE sku_id = ?', ['inactive', sku_id], (err) => {
      if (err) {
        console.error('Error updating SKU:', err.message);
        return res.status(500).json({ error: 'Failed to deactivate SKU: ' + err.message });
      }
      console.log(`Deactivated SKU ${sku_id}`);
      res.status(200).json({ message: 'SKU deactivated successfully' });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Server error:', err.message);
});

// Ensure database is closed on process exit
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});