import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    description: '',
    date: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transactions', { ...form, amount: Number(form.amount) });
      navigate('/');
    } catch (err) {
      setError(err.response.data.msg || 'Failed to add transaction');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Add Transaction</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="amount" placeholder="Amount" type="number" onChange={handleChange} />
        <select className="form-control mb-2" name="type" onChange={handleChange}>
          <option>Expense</option>
          <option>Income</option>
        </select>
        <input className="form-control mb-2" name="category" placeholder="Category" onChange={handleChange} />
        <input className="form-control mb-2" name="description" placeholder="Description" onChange={handleChange} />
        <input className="form-control mb-2" name="date" type="date" onChange={handleChange} />
        <button className="btn btn-primary">Add</button>
      </form>
    </div>
  );
};

export default AddTransaction;
