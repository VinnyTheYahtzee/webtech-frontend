import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authorization token not found.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/accounts/change-password/`,
        { oldpassword: oldPassword, newpassword: newPassword, new_password2: newPassword2 },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessage(response.data.detail);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.detail || 'An error occurred.');
      } else {
        setMessage('Password change request failed.');
      }
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authorization token not found.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/accounts/delete-account/`,
        { password: deletePassword },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessage(response.data.detail);
      
      // Clear the token and redirect to login page
      localStorage.removeItem('token');
      navigate('/login'); // Navigate to login after account deletion

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.detail || 'An error occurred.');
      } else {
        setMessage('Account deletion failed.');
      }
    }
    setShowDeleteModal(false);
  };

  return (
    <div>
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="Altes Passwort"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Neues Passwort"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Neues Passwort bestätigen"
        value={newPassword2}
        onChange={(e) => setNewPassword2(e.target.value)}
      />
      <button onClick={handleChangePassword}>Passwort Ändern</button>

      <h2>Delete Profile</h2>
      <button onClick={handleShowDeleteModal}>Account Löschen</button>

      {showDeleteModal && (
        <div className="modal">
          <h3>Löschen bestätigen</h3>
          <input
            type="password"
            placeholder="Passwort eingeben zum bestätigen"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <button onClick={handleDeleteAccount}>Confirm Delete</button>
          <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
