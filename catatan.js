const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

connectDB();

app.set('view engine', 'ejs');

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

//Public Static Folder
app.use('/plugins', express.static(path.join(__dirname, 'plugins')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Define routes
app.use('/', require('./routes/index'));
app.use('/akun-user', require('./routes/user'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/divisi', require('./routes/divisi'));
app.use('/index', require('./routes/Magang'));
app.use('/kontrak', require('./routes/kontrak'));
app.use('/karyawancuti',require('./routes/Karyawancuti'));
app.use('/karyawan', require('./routes/karyawan'));

const PORT = process.env.PORT || '8080';
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
