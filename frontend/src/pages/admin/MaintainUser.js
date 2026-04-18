import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/adminService';

function MaintainUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Error fetching users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="top-nav">
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>Home</button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-outline" onClick={handleLogout}>LogOut</button>
        </div>

        <div className="title-banner">User Management</div>

        <div className="maintain-section">
          <div className="section-label">Membership</div>
          <div className="section-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/admin/membership/add', { state: { type: 'User' } })}>
              Add
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/admin/membership/update', { state: { type: 'User' } })}>
              Update
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Registered Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No users registered</td></tr>
              ) : users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MaintainUser;
