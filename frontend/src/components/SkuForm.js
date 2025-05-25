import React, { useState } from 'react';
import axios from 'axios';
import './SkuForm.css';

const SkuForm = () => {
  const [skuId, setSkuId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [skus, setSkus] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!skuId.trim()) {
      setError('Please enter a valid SKU ID');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/deactivate-sku', {
        sku_id: skuId
      });
      setMessage(response.data.message || 'SKU deactivated successfully');
      setSkuId('');
      // Refresh SKU list after deactivation
      fetchSkus();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const fetchSkus = async () => {
    try {
      const response = await axios.get('http://localhost:5001/skus');
      setSkus(response.data);
    } catch (err) {
      setError('Failed to fetch SKUs');
    }
  };

  return (
    <div className="sku-form-container">
      <h2>Deactivate SKU</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>SKU ID:</label>
          <input
            type="text"
            value={skuId}
            onChange={(e) => setSkuId(e.target.value)}
            placeholder="Enter SKU ID (e.g., SKU123)"
          />
        </div>
        <button type="submit">Deactivate</button>
      </form>
      <button onClick={fetchSkus} style={{ marginTop: '10px' }}>
        Show All SKUs
      </button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {skus.length > 0 && (
        <div>
          <h3>SKU List</h3>
          <table>
            <thead>
              <tr>
                <th>SKU ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={sku.sku_id}>
                  <td>{sku.sku_id}</td>
                  <td>{sku.name}</td>
                  <td>{sku.status}</td>
                  <td>{sku.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SkuForm;