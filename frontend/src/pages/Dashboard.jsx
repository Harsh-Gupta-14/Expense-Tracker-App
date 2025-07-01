import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.log('Error:', err.response?.data?.msg || 'Failed to load');
      }
    };
    fetchTransactions();
  }, []);

  const income = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatAmount = (amt) => `₹${amt.toFixed(2)}`;

  return (
    <div>
      <h3 className="mb-4">Dashboard</h3>

      {/* Summary Cards */}
      <div className="row mb-4">
  <div className="col-md-4">
    <div className="card text-center text-white bg-primary shadow">
      <div className="card-body">
        <h5>Total Balance</h5>
        <h4 className="fw-bold">{formatAmount(income - expense)}</h4>
      </div>
    </div>
  </div>
  <div className="col-md-4">
    <div className="card text-center text-white bg-success shadow">
      <div className="card-body">
        <h5>Income</h5>
        <h4 className="fw-bold">{formatAmount(income)}</h4>
      </div>
    </div>
  </div>
  <div className="col-md-4">
    <div className="card text-center text-white bg-danger shadow">
      <div className="card-body">
        <h5>Expenses</h5>
        <h4 className="fw-bold">{formatAmount(expense)}</h4>
      </div>
    </div>
  </div>
</div>


      {/* Transactions Table */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Recent Transactions</h5>
        <Link to="/add" className="btn btn-primary">
          Add New Transaction
        </Link>
      </div>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx._id}>
                <td className={tx.type === 'Income' ? 'text-success' : 'text-danger'}>
                  {tx.type === 'Income' ? '+' : '-'}{formatAmount(tx.amount)}
                </td>
                <td>{tx.description}</td>
                <td>
                  <span
                    className={`badge ${
                      tx.type === 'Income'
                        ? 'bg-success'
                        : tx.category === 'Food'
                        ? 'bg-primary'
                        : tx.category === 'Housing'
                        ? 'bg-warning text-dark'
                        : 'bg-secondary'
                    }`}
                  >
                    {tx.category}
                  </span>
                </td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
