const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

connectDB();

app.set('view engine', 'ejs');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Define routes
app.use('/', require('/.routes/index'));


const PORT = process.env.PORT || '8080';
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
