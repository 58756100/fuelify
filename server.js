const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fuel tracking'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database...');
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM admin_login WHERE Username='${username}' AND Password='${password}'`;
  connection.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send('success');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

// Drivers Route
app.post('/drivers', (req, res) => {
  const { reg_no, first_name, last_name, rate_type, contacts, license } = req.body;

  // Check if the vehicle exists in the database
  const checkIfExists = `SELECT COUNT(*) as count FROM vehicle WHERE reg_no = ?`;
  connection.query(checkIfExists, [reg_no], (err, result) => {
    if (err) throw err;

    const count = result[0].count;

    if (count === 0) {
      // Vehicle not available in the database, don't add the driver
      res.status(404).send('Vehicle not available in the database');
    } else {
      // Vehicle exists in the database, add the driver
      const sql = `INSERT INTO drivers_details (reg_no, first_name, last_name, rate_type, contacts, license) VALUES ('${reg_no}', '${first_name}', '${last_name}', '${rate_type}', '${contacts}', '${license}')`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send('Driver added successfully');
      });
    }
  });
});

// Vehicles Route
app.post('/vehicles', (req, res) => {
  const { reg_no, model, fuel_type, updated_mileage, fuel_efficiency } = req.body;
  let old_mileage = req.body.old_mileage || updated_mileage;
  if (updated_mileage < old_mileage) {
    res.status(400).send('Updated mileage cannot be less than old mileage');
    return;
  }
  const distance_travelled = updated_mileage - old_mileage;
  const fuel_consumption = fuel_efficiency * distance_travelled;

  const sql = `INSERT INTO vehicle (reg_no, model, fuel_type, old_mileage, updated_mileage, fuel_efficiency, distance_travelled, fuel_consumed) VALUES ('${reg_no}', '${model}', '${fuel_type}', '${old_mileage}', '${updated_mileage}', '${fuel_efficiency}', '${distance_travelled}', '${fuel_consumption}')`;
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.send('Vehicle added successfully');
  });
});
//Fuel data
app.post('/fuel_data', (req, res) => {
  const { tank_capacity,reg_no} = req.body;
 
 const sql = `INSERT INTO fuel_data (tank_capacity,reg_no) VALUES ('${tank_capacity}', '${reg_no}')`;
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.send('Fuel data added successfully');
  });
});

app.post('/vehicleUpdate', (req, res) => {
  const {
    reg_no,
    updated_mileage,
    fuel_remaining
  } = req.body;

  const checkIfExists = `SELECT COUNT(*) as count FROM vehicle WHERE reg_no = ?`;

  // Check if the vehicle exists in the database
  connection.query(checkIfExists, [reg_no], (err, result) => {
    if (err) throw err;

    const count = result[0].count;

    if (count === 0) {
      // Vehicle not available in the database
      res.status(404).send('Vehicle not available in the database');
    } else {
      // Get the tank capacity of the vehicle from the database
      const getTankCapacity = `SELECT tank_capacity FROM fuel_data WHERE reg_no = ?`;
      connection.query(getTankCapacity, [reg_no], (err, result) => {
        if (err) throw err;

        const tank_capacity = result[0].tank_capacity;

        // Calculate the fuel used
        const fuel_used = tank_capacity - fuel_remaining;
       
 
        // Update the vehicle's updated_mileage
        const updateMileage = `UPDATE vehicle SET old_mileage = updated_mileage ,updated_mileage = ? WHERE reg_no = ?`;
        connection.query(updateMileage, [updated_mileage, reg_no], (err, result) => {
          if (err) throw err;

          // Update fuel_remaining column in fuel_data table
          const updateFuelRemaining = `UPDATE fuel_data SET fuel_remaining = ?, fuel_used = ? WHERE reg_no = ?`;
          connection.query(updateFuelRemaining, [fuel_remaining, fuel_used, reg_no], (err, result) => {
            if (err) throw err;

            // Update the driver's rate_type based on fuel consumption data
            const updateDriverRateType = `
              UPDATE drivers_details
              JOIN vehicle ON drivers_details.reg_no = vehicle.reg_no
              JOIN fuel_data ON vehicle.reg_no = fuel_data.reg_no
              SET drivers_details.rate_type = 
                CASE
                  WHEN (fuel_data.fuel_used / vehicle.fuel_consumed) > 1.2 THEN 'Inefficient'
                  WHEN (fuel_data.fuel_used / vehicle.fuel_consumed) > 1.15 THEN 'Average'
                  ELSE 'Economical'
                END
              WHERE vehicle.reg_no = ?
            `;
            connection.query(updateDriverRateType, [reg_no], (err, result) => {
              if (err) throw err;

              // Send a success response to the client
              res.status(200).send('Vehicle and driver details updated successfully');
            });
          });
        });
      });
    }
  });
});
// API endpoint to handle fuel purchase requests
app.post('/fuel-purchase', (req, res) => {
  const { reg_no, fuel_price_per_l, litres_purchased } = req.body;

  // Check if vehicle exists in the vehicles table
  connection.query(`SELECT * FROM vehicle WHERE reg_no = '${reg_no}'`, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(400).json({ error: 'Invalid vehicle registration number' });
    } else {
      const vehicle = results[0];

      // Check if litres_purchased + fuel_remaining exceeds tank_capacity
      connection.query(`SELECT * FROM fuel_data WHERE reg_no = '${reg_no}'`, (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
          res.status(400).json({ error: 'Invalid fuel data for vehicle' });
        } else {
          const fuelData = results[0];

          const fuelRemaining = fuelData.fuel_remaining;
          const tankCapacity = fuelData.tank_capacity;
          console.log(tankCapacity);
          const totalFuel = parseInt(fuelRemaining) + parseInt(litres_purchased);
         
          const isExceedingCapacity = totalFuel > tankCapacity;

          if (isExceedingCapacity) {
            res.status(400).json({ error: 'Fuel purchase exceeds tank capacity' });
          } else {
            // Add litres_purchased to fuel_remaining in fuel_data table
            const newFuelRemaining = parseInt(fuelRemaining) + parseInt(litres_purchased);
            connection.query(
              `UPDATE fuel_data SET fuel_remaining = ${newFuelRemaining} WHERE reg_no = '${reg_no}'`,
              (err, results) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  connection.query(
                    `INSERT INTO fuel_purchases (reg_no, fuel_price_per_l, litres_purchased) VALUES ('${reg_no}', ${fuel_price_per_l}, ${litres_purchased})`,
                    (err, results) => {
                      if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal server error' });
                      } else {
                        res.status(200).json({ message: 'Fuel purchase recorded successfully' });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      });
    }
  });
});



const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
