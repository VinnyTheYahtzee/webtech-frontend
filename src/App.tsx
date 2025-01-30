import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import CalorieCalculator from './Components/CalorieCalculator';
import Register from './Components/Register';
import Login from './Components/Login';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import Contact from './Components/Contact';
import Impressum from './Components/Impressum';
import Diary from './Components/Diary';
import Exercises from './Components/Exercises';
import WorkoutPlan from './Components/WorkoutPlan';
import Nutrition from './Components/Nutrition';

// Protected Route component
function ProtectedRoute({ children, isAuthenticated }: { children: JSX.Element; isAuthenticated: boolean }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <>
                <Login setIsAuthenticated={setIsAuthenticated} />
                <Footer />
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <Register />
                <Footer />
              </>
            }
          />

          {/* 4) Main App route (calculator) - protected */}
          <Route
            path="/app"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrapper">
                    <Sidebar />
                    <div className="main-content">
                      <CalorieCalculator />
                    </div>
                  </div>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 5) Diary route - protected */}
          <Route
            path="/diary"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrapper">
                    <Sidebar />
                    <div className="main-content">
                      <Diary />
                    </div>
                  </div>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 6) Exercises route - protected */}
          <Route
            path="/exercises"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrapper">
                    <Sidebar />
                    <div className="main-content">
                      <Exercises />
                    </div>
                  </div>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 7) Workout plan route - protected */}
          <Route
            path="/workout-plan"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrapper">
                    <Sidebar />
                    <div className="main-content">
                      <WorkoutPlan />
                    </div>
                  </div>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 8) Nutrition route - protected */}
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="app-container">
                  <Navbar />
                  <div className="content-wrapper">
                    <Sidebar />
                    <div className="main-content">
                      <Nutrition />
                    </div>
                  </div>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 9) Profile route - protected, no Navbar/Sidebar */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 10) Public routes for Contact & Impressum */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/impressum" element={<Impressum />} />

          {/* 11) Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
