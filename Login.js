import React, { useState } from 'react';
import axios from 'axios';
import AddVehicle from './AddVehicle'
import DriverDetails from './DriversDetails';
import UpdateVehicle from './UpdateVehile'
import FuelForm from './screens/Transactions/Transactions';

function UserTable() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const[showUpdateVehicle,setshowUpdateVehicle] =useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      if (response.data === 'success') {
        console.log('Login successful');
        setIsLoggedIn(true); // update login status
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddVehicleClick = () => {
    setShowAddVehicle(true);
    setShowDriverDetails(false);
  }

  const handleDriverDetailsClick = () => {
    setShowAddVehicle(false);
    setShowDriverDetails(true);
  }
  const handleUpdateVehicleClick =()=>{
    setshowUpdateVehicle(false);
    setshowUpdateVehicle(true);
   
  }
  const handleTransactionClick =()=>{
    setshowUpdateVehicle(false);
    setshowUpdateVehicle(true);
   
  }


  if (isLoggedIn) {
    return (
      <div>
        <div>
          <button onClick={handleAddVehicleClick}>Add Vehicle</button>
          <button onClick={handleDriverDetailsClick}>Add Driver</button>
          <button onClick={handleUpdateVehicleClick}>update Vehicle</button>
          <button onClick={handleTransactionClick}>Transaction</button>
        </div>
        {showAddVehicle && <AddVehicle />}
        {showDriverDetails && <DriverDetails />}
        {showUpdateVehicle && <UpdateVehicle />}
        {showUpdateVehicle && <FuelForm />}
      </div>
    );
  }

  return (
    <div className="center-container">
      <div className="card-container">
        <div className="card">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="login-button-container">
              <button type="submit" className="login-button">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
