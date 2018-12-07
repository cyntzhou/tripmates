const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tripsRouter = require('./routes/trips');
const itinerariesRouter = require('./routes/itineraries');
const eventsRouter = require('./routes/events');
const activitiesRouter = require('./routes/activities');
const placesRouter = require('./routes/places');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(session({ 
  secret: 'super-secret-password', 
  saveUninitialized: false, 
  resave: true,
  cookie: {
    maxAge: 6*60*60*1000 // 6 hours (in milliseconds)
  }
}));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/itineraries', itinerariesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/places', placesRouter);

app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Listening on ${port}`);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, '/client/public')));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
  });
}

module.exports = app;
