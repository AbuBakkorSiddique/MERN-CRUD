const express = require('express');
const app = express();
const api = require('../server/src/Router/api'); // Ensure this path is correct
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

// Security imports
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');

// Rate limiter
const rateLimit = require('express-rate-limit');

// Database import
const mongoose = require('mongoose');

// Security middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Body parser middleware
app.use(bodyParser.json());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // limit each IP to 3000 requests per windowMs
});
app.use(limiter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/FullstackCRUD', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connection successful.');
  })
  .catch((err) => {
    console.log('Connection failed', err);
  });

// API routing
app.use('/api', api);


//static file 

app.use(express.static('client/my-app/dist')) ; 

// Serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client','my-app', 'dist', 'index.html'));
});

module.exports = app;
