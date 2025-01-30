import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './css/Login.css';

type LoginProps = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN, {
        username, 
        password,
      });

      if (response.status === 200) {
        // Assuming the response contains a token
        const { token } = response.data;
        localStorage.setItem('token', token); // Store the token

        setIsAuthenticated(true);
        setError(null); // Clear any previous errors
        navigate('/app'); // Redirect to main app after login
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError('Login fehlgeschlagen. Bitte überprüfe deine Eingabe.');
        console.error('Login error:', error.response.data);
      }
    }
  };

  const handleAnonymousAccess = () => {
    setIsAuthenticated(true);
    navigate('/app');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Willkommen </h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="E-Mail eingeben"
            required
          />
        </div>
        <div className="form-group">
          <label>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="login-actions">
        <button onClick={() => navigate('/register')} className="register-button">
          Registrieren
        </button>
        <button onClick={handleAnonymousAccess} className="anonymous-button">
          Anonym weiter
        </button>
      </div>
    </div>
  );
};

export default Login;