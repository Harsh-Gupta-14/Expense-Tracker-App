import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">💰 Expense Tracker</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {token ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/add">Add Transaction</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
              <li className="nav-item"><button className="btn btn-danger ms-2" onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
