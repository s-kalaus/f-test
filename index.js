'use strict';

var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');

var API = require('./api/services/api');
var SOCKET = require('./api/services/socket');

var app = express();
var server = require('http').Server(app);

var api = new API(app, config);
var socket = new SOCKET(config);

app.engine('ejs',       engine);
app.set('view engine',  'ejs');
app.set('views',        'views');
app.use(bodyParser.json({limit: '512mb'}));
app.use(bodyParser.urlencoded({ extended: false , limit: '512mb'}));

socket.setup(server);

api.setup();

server.listen(config.server.port);