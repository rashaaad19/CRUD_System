const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postsRouter = require('./routes/postsRouter');
const usersRouter = require('./routes/usersRouter');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// routes /api/v1
app.use('/api/v1/posts', postsRouter); 
app.use('/api/v1/users',usersRouter)
app.use(errorHandler); //Error handling route

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose.connect(MONGOURL)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));
});

