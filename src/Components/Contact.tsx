// Contact.tsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; 
import './css/Contact.css'; 

interface ContactFormProps {
  maxMessageLength?: number; 
}

const ContactForm: React.FC<ContactFormProps> = ({ maxMessageLength = 500 }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null); // State to store reCAPTCHA token
  const recaptchaRef = useRef<ReCAPTCHA>(null); // Ref to reset reCAPTCHA if needed
  const navigate = useNavigate(); // Hook for navigation

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setError(null); // Clear error if reCAPTCHA is successful
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Front-end validation for email pattern
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Bitte eine gültige E-Mail Adresse angeben.');
      return;
    }

    if (message.length > maxMessageLength) {
      setError(`Ihre Nachricht überschreitet das Limit von ${maxMessageLength} Zeichen.`);
      return;
    }

    if (!recaptchaToken) {
      setError('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }

    setError(null);

    const contactData = {
      name,
      email,
      message,
      recaptcha_token: recaptchaToken, // Include the reCAPTCHA token
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/contact/contactform/`,
        contactData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Assuming 201 Created or 200 OK means success
      if (response.status === 200 || response.status === 201) {
        alert('Nachricht erfolgreich gesendet!');
        // Reset form
        setName('');
        setEmail('');
        setMessage('');
        setRecaptchaToken(null);
        recaptchaRef.current?.reset(); // Reset reCAPTCHA
      } else {
        alert('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      console.error(err);
      alert('Ein Fehler ist aufgetreten. Bitte später erneut versuchen.');
    }
  };

  const handleReturn = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <div className="contact-page-container">
      <div className="contact-card">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Kontaktformular</h2>

          {/* Display an error message if any */}
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Ihr Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">E-Mail</label>
            <input
              id="contact-email"
              type="email"
              placeholder="Ihre E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="^\S+@\S+\.\S+$"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Nachricht</label>
            <textarea
              id="contact-message"
              placeholder="Ihre Nachricht"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={maxMessageLength}
              rows={6}
            />
            {/* Character counter */}
            <small>
              {message.length}/{maxMessageLength} Zeichen
            </small>
          </div>

          {/* reCAPTCHA Widget */}
          <div className="form-group">
          <ReCAPTCHA
  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
  onChange={handleRecaptchaChange}
  ref={recaptchaRef}
/>

          </div>

          <button type="submit" className="send-button">Senden</button>
        </form>

        {/* Return button */}
        <button className="return-button" onClick={handleReturn}>
          Zurück
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
