import { useState } from 'react';
import axios from 'axios';

function VehicleForm() {
  const [regNo, setRegNo] = useState('');
  const [updatedMileage, setUpdatedMileage] = useState('');
  const [fuelRemaining, setFuelRemaining] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      reg_no: regNo,
      updated_mileage: updatedMileage,
      fuel_remaining: fuelRemaining
    }
    // handle form submission here
    try {
      await axios.post('http://localhost:3000/vehicleUpdate', data).then((response) => {
        console.log(response);
        // Reset the form after successful submission
        setRegNo('');
        setUpdatedMileage('');
        setFuelRemaining('');
      });
    } catch (error) {
      console.error(error);
      alert('Error updating vehicles.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Reg No:
        <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
      </label>
      <label>
        Updated Mileage:
        <input type="text" value={updatedMileage} onChange={(e) => setUpdatedMileage(e.target.value)} />
      </label>
      <label>
        Fuel Remaining:
        <input type="text" value={fuelRemaining} onChange={(e) => setFuelRemaining(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default VehicleForm;
