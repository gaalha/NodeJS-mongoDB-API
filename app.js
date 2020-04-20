const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const cors = require('cors');

//const mongoDB = 'mongodb://localhost/betterride-evaluation';
//const mongoDB = 'mongodb://root:pass123@ds229474.mlab.com:29474/creativa';
// mongoose.connect('mongodb://root:pass123@ds229474.mlab.com:29474/creativa', { useNewUrlParser: true })
mongoose.connect('mongodb+srv://admin:123123123@storage-cntdr.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const routes = require('./app/routes');
const app = express();

app.use(cors({origin: 'http://localhost:8100'}));
app.use(expressValidator());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({ error: err })
});

module.exports = app;