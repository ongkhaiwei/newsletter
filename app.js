/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var cfenv = require('cfenv');

var bodyParser = require('body-parser');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
// app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/', function (req, res) {
	//console.log('request_ip:'+req.connection.remoteAddress);
	console.log('header:'+req.headers['x-forwarded-for']);
	//console.log('socket:'+req.socket.remoteAddress);
	//console.log('connection.socket:'+req.connection.socket.remoteAddress);

	var source_ips = req.headers['x-forwarded-for'].split(',');

	if( checkWhitelist(source_ips[0]) )
		res.render('home');
	else
		res.render('denied');
});

var whitelist = ['127.0.0.1','IP_ADDRESS']

function checkWhitelist(ip) {

	if(whitelist.indexOf(ip) > -1) 
		return true;
	else
		false;

}

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
