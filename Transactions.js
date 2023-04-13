import React, { useState } from 'react';
import axios from 'axios';
function FuelForm() {
  const [regNo, setRegNo] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [litresPurchased, setLitresPurchased] = useState('');

  const handleSubmit =  async (e) => {
    e.preventDefault();
    // handle form submission here
    const data={        
        reg_no:regNo,
        fuel_price_per_l:fuelPrice,
        litres_purchased:litresPurchased,}

    console.log(data);
    try{await axios.post('http://localhost:3000/fuel-purchase', data).then((response) => {
        console.log(response);
        // Reset the form after successful submission
        setRegNo('');
        setFuelPrice('');
        setLitresPurchased('');
        
      });
    }catch (error) {
        console.error(error);
        alert('error adding transactions.');
      }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Registration Number:
        <input type="text" required value={regNo} onChange={(e) => setRegNo(e.target.value)} />
      </label>
      <label>
        Fuel Price per Litre:
        <input type="number" min="0" step="0.01" required value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
      </label>
      <label>
        Litres Purchased:
        <input type="number" min="0" step="0.01" required value={litresPurchased} onChange={(e) => setLitresPurchased(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default FuelForm;
