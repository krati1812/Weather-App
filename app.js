var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Setup empty JS object to act as endpoint for all routes
const projectData = { data: [] };

var app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('public'));

// Routers
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
  res.send(projectData);
});

app.post('/database', (req, res) => {
  const { temp, currentTime, userResponse } = req.body.main;
  const returnedTemp = `${temp}°C`;
  const returnedcurrentDate = currentTime;
  const returneduserResponse = userResponse;
  const cityName = req.body.name;
  const weatherCondition = req.body.weather[0].main;

  console.log('cityName', cityName);
  projectData.data.push({
    temperature: returnedTemp,
    currentDate: returnedcurrentDate,
    userResponse: returneduserResponse,
    cityName: cityName,
    weatherCondition: weatherCondition
  });

  res.send(projectData);
});

app.get('/all', (req, res) => {
  res.send(projectData);
});

app.delete('/database', (req, res) => {
  res.send(projectData);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.render('error');
});

module.exports = app;
