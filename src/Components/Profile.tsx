import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import axios from 'axios';
import ChangePassword from './ChangePassword';
import AdminOverview from './AdminOverview';

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  is_staff?: boolean;
  last_calories?: number | null;
  last_protein?: number | null;
  last_carbs?: number | null;
  last_fats?: number | null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/api/accounts/profile/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const handleBack = () => {
    navigate('/app');
  };

  return (
    <div className="profile-container">
      <ProfileSidebar
        onSectionChange={handleSectionChange}
        isAdmin={!!profile?.is_staff}
      />
      <div className="profile-content">
        {currentSection === 'overview' && (
          <>
            <h2>Nutzerprofil</h2>
            {profile ? (
              <ul className="profile-list">
                <li className="profile-item">
                  <span className="profile-label">Vorname:</span>
                  <span className="profile-value">{profile.first_name}</span>
                </li>
                <li className="profile-item">
                  <span className="profile-label">Nachname:</span>
                  <span className="profile-value">{profile.last_name}</span>
                </li>
                <li className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{profile.email}</span>
                </li>
                <li className="profile-item">
                  <span className="profile-label">Geburtsdatum:</span>
                  <span className="profile-value">{profile.birthdate}</span>
                </li>

                {/* Last-calculated macros */}
                {profile.last_calories !== undefined && (
                  <li className="profile-item">
                    <span className="profile-label">Zuletzt berechnete Kalorien (TDEE):</span>
                    <span className="profile-value">
                      {profile.last_calories?.toFixed(2)}
                    </span>
                  </li>
                )}
                {/* Repeat for protein, carbs, fats if needed */}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </>
        )}

        {currentSection === 'settings' && <ChangePassword />}

        {/* Admin-only sections */}
        {currentSection === 'adminOverview' && profile?.is_staff && (
          <AdminOverview />
          )}
        {currentSection === 'adminMessages' && profile?.is_staff && (
          <AdminMessages />
        )}

        <button className="back-button" onClick={handleBack}>
          Zurück zur App
        </button>
      </div>
    </div>
  );
};

export default Profile;


interface ContactMessage {
  name: string;
  email: string;
  message: string;
  // Add other fields if your backend sends more data
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchMessages = async () => {
      try {
        // Suppose you have an endpoint returning contact form data
        const res = await axios.get<ContactMessage[]>(
          `${import.meta.env.VITE_BACKENDURL}/api/contact/messages/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch admin messages:', err);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Kontaktformular Nachrichten</h2>
      {messages.length === 0 ? (
        <p>Keine Nachrichten vorhanden.</p>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem' }}>
            <p>
              <strong>Name: </strong>
              {msg.name}
            </p>
            <p>
              <strong>Email: </strong>
              {msg.email}
            </p>
            <p>
              <strong>Message: </strong>
              {msg.message}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};
