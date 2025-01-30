import React, { useState } from 'react';
import { FaCalculator, FaBook, FaDumbbell } from 'react-icons/fa'; 
import { GiMuscleUp } from "react-icons/gi";
import { MdFoodBank } from "react-icons/md";
import './css/Sidebar.css';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  route: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Rechner', icon: <FaCalculator />, route: '/app' },
  { label: 'Tagebuch', icon: <FaBook />, route: '/diary' },
  { label: 'Übungen', icon: <FaDumbbell />, route: '/exercises' },
  { label: 'Trainingspläne', icon: <GiMuscleUp />, route: '/workout-plan' },
  { label: 'Ernährung', icon: <MdFoodBank />, route: '/nutrition' },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </button>
      <div className="sidebar-content">
        {sidebarItems.map((item, index) => (
          <a key={index} href={item.route} className="sidebar-item">
            <span className="sidebar-icon">{item.icon}</span>
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

