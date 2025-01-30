import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Contact.css';  // Ensure this path is correct

interface ContactFormProps {
  maxMessageLength?: number; 
  // Optional prop to allow easy changes or a default
}

const ContactForm: React.FC<ContactFormProps> = ({ maxMessageLength = 500 }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

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

    setError(null);

    const contactData = {
      name,
      email,
      message,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/contact/contactform/',
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
              // Optional: limit name length
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
              // Optional: pattern for extra validation
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
              maxLength={maxMessageLength} // Enforce length on the textarea
              rows={6}
            />
            {/* Character counter */}
            <small>
              {message.length}/{maxMessageLength} Zeichen
            </small>
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
