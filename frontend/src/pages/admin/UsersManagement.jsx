import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Trash2 } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const roleBadgeColor = {
  ADMIN: { bg: 'rgba(245,158,11,0.15)', color: 'var(--amber-400)' },
  BEEKEEPER: { bg: 'rgba(16,185,129,0.15)', color: 'var(--emerald-400)' },
  QUALITY_OFFICER: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  PROCESSOR: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      if (data.ok) setUsers(data.users);
    } catch (err) { /* fallback to empty */ }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesQuery = (u.name + u.email + u.cluster).toLowerCase().includes(query.toLowerCase());
    return matchesRole && matchesQuery;
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const role = e.target.elements.role.value;
    const cluster = e.target.elements.cluster.value;
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, cluster }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchUsers();
        setShowAddForm(false);
        e.target.reset();
      }
    } catch (err) { /* ok in demo */ }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        fetchUsers();
        setConfirmDelete(null);
      } else {
        alert(data.error || 'Failed to remove user');
      }
    } catch (err) { /* ok in demo */ }
  };

  return (
    <section className="view-pane active" id="view-users">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Users size={13} /> Access &amp; Role Management</div>
        <h2>Users</h2>
        <p className="section-lede">Manage admin, beekeeper, quality officer and processor accounts and their cluster assignments.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <div className="flex-between">
          <div className="search-field">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text" placeholder="Search by name, email or cluster..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="input"
            />
          </div>
          <div className="toolbar-group">
            {['ALL', 'ADMIN', 'BEEKEEPER', 'QUALITY_OFFICER', 'PROCESSOR'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`chart-toggle ${roleFilter === r ? 'active' : ''}`}
              >
                {r === 'ALL' ? 'All' : r.replace('_', ' ')}
              </button>
            ))}
          </div>
          <button className="btn-luxury btn-luxury-primary" onClick={() => setShowAddForm(v => !v)}>
            <UserPlus size={15} /> {showAddForm ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddUser} className="grid-4-auto divider-top mt-16">
            <div className="field">
              <label className="field-label">Full Name</label>
              <input name="name" required className="input" />
            </div>
            <div className="field">
              <label className="field-label">Email</label>
              <input name="email" type="email" required className="input" />
            </div>
            <div className="field">
              <label className="field-label">Role</label>
              <select name="role" className="select">
                <option value="BEEKEEPER">Beekeeper</option>
                <option value="QUALITY_OFFICER">Quality Officer</option>
                <option value="PROCESSOR">Processor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Cluster</label>
              <input name="cluster" placeholder="e.g. Satara" className="input" />
            </div>
            <button type="submit" className="btn-luxury btn-luxury-primary">Invite</button>
          </form>
        )}
      </div>

      <div className="glass-card">
        <table className="mm-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Cluster</th><th>Status</th><th>Joined</th><th style={{ width: '60px' }}>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td>
                  <span className="pill" style={{
                    background: (roleBadgeColor[u.role] || {}).bg, color: (roleBadgeColor[u.role] || {}).color
                  }}>
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td>{u.cluster}</td>
                <td className={u.status === 'Active' ? 'status-ok' : ''}>{u.status}</td>
                <td style={{ color: 'var(--text-muted)' }}>{u.joined}</td>
                <td>
                  {u.role !== 'ADMIN' && (
                    confirmDelete === u.id ? (
                      <div className="flex gap-6">
                        <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger btn-sm">Confirm</button>
                        <button onClick={() => setConfirmDelete(null)} className="btn btn-soft btn-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(u.id)} title="Remove user" className="btn btn-danger btn-sm">
                        <Trash2 size={13} /> Remove
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="state-empty">No users match this search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}