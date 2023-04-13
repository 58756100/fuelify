import React, { useState } from 'react';
import axios from 'axios';

function AddVehicleForm() {
  const [regNo, setRegNo] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [updatedMileage, setUpdatedMileage] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [tankCapacity, setTankCapacity] = useState('');
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      reg_no: regNo,
      model: model,
      fuel_type: fuelType,
      updated_mileage: updatedMileage,
      fuel_efficiency: fuelEfficiency,
      tank_capacity: tankCapacity,
      
    };
    try {
      await axios.post('http://localhost:3000/vehicles', data).then((response) => {
        console.log(response);
        // Reset the form after successful submission
        setRegNo('');
        setModel('');
        setFuelType('');
        setUpdatedMileage('');
        setFuelEfficiency('');
        setTankCapacity('');
        
      });
      // Add fuel data to the fuel_data table
      const fuelData = {
        reg_no: regNo,
        tank_capacity: tankCapacity,
        

      };
      await axios.post('http://localhost:3000/fuel_data', fuelData).then((response) => {
        console.log(response);
        // Reset the tank capacity input after successful submission
        setTankCapacity('');
        setRegNo('');
       
      });
    } catch (error) {
      console.error(error);
      alert('Error adding vehicles.');
    }
  };

  return (
    <div className="center-container">
      <div className="card-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <h2>Add Vehicle</h2>
            <div className="form-column">
              <div className="form-row">
                <label>
                  Registration No:
                  <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                </label>
                <label>
                  Model:
                  <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Fuel Type:
                  <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} required>
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </label>
                <label>
                  Tank Capacity:
                  <input type="number" value={tankCapacity} onChange={(e) => setTankCapacity(e.target.value)} required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Current Mileage:
                  <input type="number" value={updatedMileage} onChange={(e) => setUpdatedMileage(e.target.value)} required />
                </label>
                <label>
                  Fuel Efficiency:
                  <input type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} required />
                </label>
            </div>
            </div>
            
            <div className="button-container">
              <button type="submit" className="add-button">
                Add Vehicle
              </button>
            </div>
            </form>
        </div>
      </div>
    </div>
)}
export default AddVehicleForm;
