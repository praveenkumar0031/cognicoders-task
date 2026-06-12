const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Routes
app.use('/api/employees', employeeRoutes);


// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Leave Management System API is running"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
