const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./DBConnection');
const client = require('./mqtt');
const router = require('./router');
con
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use('/', router);
var server = app.listen(3004, function() {
  console.log('Server listening on port ' + server.address().port);
});

