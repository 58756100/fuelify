import React, { useState } from 'react';
import "./DriverDetail.css"
import axios from 'axios';

function AddDriverForm() {
  const [regNo, setRegNo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rateType, setRateType] = useState('');
  const [contacts, setContacts] = useState('');
  const [license, setLicense] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newDriver = { reg_no: regNo, first_name: firstName, last_name: lastName, rate_type: rateType, contacts, license };
    try { 
      await axios.post('http://localhost:3000/drivers', newDriver);
      alert('Driver added successfully!');
      setRegNo('');
      setFirstName('');
      setLastName('');
      setRateType('');
      setContacts('');
      setLicense('');
    } catch (error) {
      console.error(error);
      alert('Error adding driver.');
    }
  };

  return (
    <div className="add-driver-form">
      <h2>Add Driver</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vid">Registration number</label>
          <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="rateType">Rate Type</label>
          <input type="text" id="rateType" name="rateType" value={rateType} onChange={(event) => setRateType(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="contacts">Contacts</label>
          <input type="text" id="contacts" name="contacts" value={contacts} onChange={(event) => setContacts(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="license">License</label>
          <input type="text" id="license" name="license" value={license} onChange={(event) => setLicense(event.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddDriverForm;
