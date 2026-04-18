import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuests, addGuest, updateGuest, deleteGuest } from '../../services/userService';

function GuestList() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({ guestName: '', guestEmail: '', guestPhone: '', guestAddress: '', notes: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGuests = async () => {
    try {
      const res = await getGuests();
      setGuests(res.data);
    } catch { }
  };

  useEffect(() => { fetchGuests(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.guestName.trim()) { setError('Guest name is required'); return; }
    try {
      if (editId) {
        await updateGuest(editId, form);
        setSuccess('Guest updated');
      } else {
        await addGuest(form);
        setSuccess('Guest added');
      }
      setForm({ guestName: '', guestEmail: '', guestPhone: '', guestAddress: '', notes: '' });
      setEditId(null);
      fetchGuests();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving guest');
    }
  };

  const handleEdit = (g) => {
    setForm({ guestName: g.guestName, guestEmail: g.guestEmail || '', guestPhone: g.guestPhone || '', guestAddress: g.guestAddress || '', notes: g.notes || '' });
    setEditId(g._id);
    setError(''); setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this guest?')) return;
    try {
      await deleteGuest(id);
      fetchGuests();
    } catch { }
  };

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="top-nav">
          <button className="btn btn-nav" onClick={() => navigate('/user')}>Home</button>
          <button className="btn btn-nav" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="title-banner">Guest List</div>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label>Guest Name *</label>
            <input type="text" name="guestName" value={form.guestName} onChange={handleChange} placeholder="Guest Name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="guestEmail" value={form.guestEmail} onChange={handleChange} placeholder="Email" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="guestPhone" value={form.guestPhone} onChange={handleChange} placeholder="Phone" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="guestAddress" value={form.guestAddress} onChange={handleChange} placeholder="Address" />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editId ? 'Update Guest' : 'Add Guest'}</button>
            {editId && (
              <button type="button" className="btn btn-secondary"
                onClick={() => { setEditId(null); setForm({ guestName: '', guestEmail: '', guestPhone: '', guestAddress: '', notes: '' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No guests added</td></tr>
            ) : guests.map((g) => (
              <tr key={g._id}>
                <td>{g.guestName}</td>
                <td>{g.guestEmail}</td>
                <td>{g.guestPhone}</td>
                <td>{g.guestAddress}</td>
                <td>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => handleEdit(g)}>Update</button>
                </td>
                <td>
                  <button className="btn btn-danger" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => handleDelete(g._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GuestList;
