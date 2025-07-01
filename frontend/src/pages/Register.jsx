import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response.data.msg || 'Registration failed');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" name="name" placeholder="Name" onChange={handleChange} />
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
