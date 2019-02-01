const express = require('express');
const bodyParser = require('body-parser');
const rest = require('./routes/rest-api');
const gpxRoute = require('./routes/gpxData');
const path = require('path');
const mongoose = require('mongoose');
const dbConf = require('./conf/conf');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(dbConf.database, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('Connected with database');
});
app.use(passport.initialize());
app.use(passport.session());
require('./authentication/passport')(passport);
app.use(require('cors')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'));
app.use('/api', rest);
app.use('/gpx', gpxRoute);

app.listen(port, () => {
    console.log("Server is listening on port:" + port);
});