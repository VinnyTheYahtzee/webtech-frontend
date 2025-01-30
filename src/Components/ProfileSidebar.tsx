import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faChevronLeft,
  faChevronRight,
  faShieldAlt, // for Admin icon
  faEnvelopeOpenText // for Messages icon
} from '@fortawesome/free-solid-svg-icons';
import './css/ProfileSidebar.css';

interface ProfileSidebarProps {
  onSectionChange: (section: string) => void;
  isAdmin: boolean;  // <-- new prop
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onSectionChange, isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleProfileSection = (section: string) => {
    onSectionChange(section);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`profile-sidebar ${isCollapsed ? 'profile-sidebar--collapsed' : ''}`}>
      <button className="collapse-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </button>
      <h3 className="menu-title">Profil Menü</h3>
      <ul>
        <li onClick={() => handleProfileSection('overview')}>
          <FontAwesomeIcon icon={faUser} />
          <span className="menu-text">Persönliche Daten</span>
        </li>
        <li onClick={() => handleProfileSection('settings')}>
          <FontAwesomeIcon icon={faUser} />
          <span className="menu-text">Sicherheit</span>
        </li>

        {/* Admin-only menu items */}
        {isAdmin && (
          <>
            <li onClick={() => handleProfileSection('adminOverview')}>
              <FontAwesomeIcon icon={faShieldAlt} />
              <span className="menu-text">Admin Overview</span>
            </li>
            <li onClick={() => handleProfileSection('adminMessages')}>
              <FontAwesomeIcon icon={faEnvelopeOpenText} />
              <span className="menu-text">Nachrichten</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfileSidebar;
