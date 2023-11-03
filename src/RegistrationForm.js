import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');


  const generateAvalancheAddress = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate-avalanche-address', {
  email: email,
   });
   if (response.status === 200) {

    setMessage('Avalanche address sent to your email');
  } else if (response.status === 400) {

    setMessage('Email from the same address has already been sent');
  }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate Avalanche address and send email');
    }
  };
  

  return (
    <div className="container container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Event Registration</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={generateAvalancheAddress}
                  >
                    Generate Address and Send Email
                  </button>
                </div>
                {message && <p>{message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
