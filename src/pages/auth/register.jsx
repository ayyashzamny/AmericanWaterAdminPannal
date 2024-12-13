import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Register = () => {
  // State variables to hold form data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin'); // Default role can be 'user'

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the user data object
    const userData = {
      username,
      password,
      email,
      role,
    };

    try {
      // Sending POST request to the backend
      const response = await axios.post('http://localhost:5050/api/regauth/register', userData);

      // If registration is successful
      if (response.data.message === 'User registered successfully') {
        Swal.fire({
          title: 'Success!',
          text: 'User registered successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        Swal.fire({
          title: 'Error!',
          text: error.response.data.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred, please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Handle form reset
  const handleClear = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setRole('admin');
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="role">Role</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
           
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button with regular size */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
