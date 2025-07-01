import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');


  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    };
    fetch();
  }, []);

  // Category-wise expense
  const categoryData = {};
  transactions.forEach((tx) => {
    if (tx.type === 'Expense') {
      categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount;
    }
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ['#dc3545', '#ffc107', '#0d6efd', '#198754', '#6610f2'],
      },
    ],
  };

  // Monthly Summary
  const monthMap = {};
  transactions.forEach((tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
    if (!monthMap[month]) monthMap[month] = { Income: 0, Expense: 0 };
    monthMap[month][tx.type] += tx.amount;
  });

  const barData = {
    labels: Object.keys(monthMap),
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#198754',
        data: Object.values(monthMap).map((val) => val.Income),
      },
      {
        label: 'Expense',
        backgroundColor: '#dc3545',
        data: Object.values(monthMap).map((val) => val.Expense),
      },
    ],
  };

   const categories = [...new Set(transactions.map(tx => tx.category))];
  const dates = [...new Set(transactions.map(tx => new Date(tx.date).toLocaleDateString()))];

  // Filtered transactions
  const filtered = transactions.filter(tx => {
    const matchCategory = categoryFilter ? tx.category === categoryFilter : true;
    const matchDate = dateFilter ? new Date(tx.date).toLocaleDateString() === dateFilter : true;
    return matchCategory && matchDate;
  });

 
  return (
    <div>
      <h3>Reports</h3>
      <div className="row">
        <div className="col-md-6">
          <h5>Expense by Category</h5>
          <Pie data={pieData} style={{ width: '250px', height: '250px', margin: 'auto' }}/>
        </div>
        <div className="col-md-6">
          <h5>Monthly Income vs Expense</h5>
          <Bar data={barData} />
        </div>
      </div>
      <hr className="my-4" />
      <h4 className="mb-3">Transaction History</h4>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Filter by category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Filter by date</option>
            {dates.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtered Transaction Table */}
      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="4" className="text-center">No transactions found.</td></tr>
          ) : (
            filtered.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td><span className="badge bg-secondary">{tx.category}</span></td>
                <td className={tx.type === 'Income' ? 'text-success' : 'text-danger'}>
                  {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
