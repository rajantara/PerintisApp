const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


const app = express();

connectDB();

app.set('view engine', 'ejs');


//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(methodOverride('_method'));


// view engine setup
app.use(express.static(path.join(__dirname, 'public')));


//Define routes
app.use('/', require('./routes/index'));


const PORT = process.env.PORT || '1010';
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
