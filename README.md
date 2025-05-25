# SKU Deactivation Library

An ERP system for deactivating SKUs while preserving historical data, built with Node.js/Express, SQLite, and React.

## Setup
1. **Backend**:
   - Navigate to `backend/`.
   - Run `npm install` and `npm start`.
   - Server runs on `http://localhost:5001`.
2. **Frontend**:
   - Navigate to `frontend/`.
   - Run `npm install` and `npm start`.
   - App runs on `http://localhost:3000`.
3. **Verification**:
   - Run `node check_db.js` in `backend/` to inspect `database.db`.
   - Use `curl http://localhost:5001/skus` to view SKUs.

## Features
- Deactivate SKUs via a React form.
- Display SKU list with status updates.
- Preserve historical data (`name`, `created_at`).
- Handle errors for invalid/missing SKUs.

## Files
- `backend/server.js`: Express server and SQLite setup.
- `backend/check_db.js`: Database verification script.
- `frontend/src/components/SkuForm.js`: React form and SKU table.
- `frontend/src/components/SkuForm.css`: Styling.# ERP-Assignment
