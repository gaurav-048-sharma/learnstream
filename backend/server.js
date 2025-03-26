const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB.js');
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require('./routes/userRoutes.js');
const courseRoutes = require('./routes/cources.js');
const progressRoutes = require('./routes/progressRoutes.js');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); 
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.send('LearnStream Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});