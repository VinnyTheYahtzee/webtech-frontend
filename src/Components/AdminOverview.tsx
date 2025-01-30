import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

const AdminOverview: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (query?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      let url = `${import.meta.env.VITE_BACKENDURL}/api/accounts/users/`;
      if (query) {
        url += `?search=${encodeURIComponent(query)}`;
      }

      const response = await axios.get<AdminUser[]>(url, {
        headers: { Authorization: `Token ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  return (
    <div>
      <h2>Admin Overview</h2>
      <p>Manage all registered users. Use the search bar to filter by email or name.</p>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by email, first or last name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button type="submit">Search</button>
      </form>

      {/* Users list */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>First Name</th>
              <th style={thStyle}>Last Name</th>
              <th style={thStyle}>Staff?</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ textAlign: 'left' }}>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.first_name}</td>
                <td style={tdStyle}>{user.last_name}</td>
                <td style={tdStyle}>{user.is_staff ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
};

export default AdminOverview;
