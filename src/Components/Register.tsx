import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Register.css';

// Define types for form data and error data
type FormData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  birthdate: string; // Field for birthdate
};

type ErrorData = {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  birthdate?: string; // Field for birthdate errors
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    birthdate: '', // Initialize with an empty string
  });

  const [errors, setErrors] = useState<ErrorData>({});
  const [success, setSuccess] = useState<boolean>(false);
  
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Register endpoint:", import.meta.env.VITE_REGISTER);

    try {
      const response = await axios.post(import.meta.env.VITE_REGISTER || '', formData);

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration error:', error.response);
        setErrors((error.response?.data || {}) as ErrorData);
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className='registerText'>Registrieren</h2>
      {success && <p className="success-message">Registration successful! Redirecting to login...</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error-message">{errors.first_name}</p>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error-message">{errors.last_name}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Birthdate</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
          {errors.birthdate && <p className="error-message">{errors.birthdate}</p>}
        </div>
        <button type="submit" className="register-button">Register</button>
        <h2 className='registerText'>Bereits registriert? </h2>
        <button type="button" className="login-button" onClick={() => navigate('/login')}>Login</button>
      </form>
    </div>
  );
};

export default Register;