import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa';
import './css/Navbar.css';
import axios from 'axios';

const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const getCSRFToken = (): string => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return csrfToken || '';
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      // Preparing headers with TypeScript support
      const headers: Record<string, string> = {
        Authorization: `Token ${token}`,
      };

      // Include CSRF token if applicable
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/accounts/logout/`, {}, { headers });

      // On successful logout
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Logout failed:', error.response?.data || error.message);
      } else {
        console.error('Logout failed:', error);
      }
      alert('Logout failed. Please try again later.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          RoboTrainer
        </a>
      </div>
      <div className="navbar-right">
        <span className="navbar-icon">
          <FaBell />
        </span>
        <div className="navbar-profile" onClick={toggleProfileMenu}>
          <span className="navbar-icon">
            <FaUserCircle />
          </span>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <a href="/profile">Profil</a>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;