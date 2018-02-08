//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    bodyParser= require('body-parser')

const request = require('request');
const MongoClient = require('mongodb').MongoClient
var db

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); // set the view engine to ejs
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: true}))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

//Accessing MongoDB on mLab
MongoClient.connect('mongodb://babyPero:testtest@ds217898.mlab.com:17898/test-project', (err, client) => {
    if (err) return console.log(err)
    db = client.db('test-project') // database name
})

// top page - retrieve and render quotes
app.get('/', function (req, res) {
    db.collection('quotes').find().sort({"_id":-1}).toArray(function(err, result) {
	if (err) return console.log(err)
	console.log('-------')
	res.render('index.ejs', {quotes: result})
	for(var i=0; i<result.length; i++) {
	    console.log(result[i].name)
	    console.log(result[i].quote)
	}
    })

    /*
    request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
	if (err) { return console.log(err)};
	console.log(body.url);
	console.log(body.explanation);
	console.log("--------------------");
    });

    request('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', {json: true}, function (error, response, body) {
	if (error) return console.log( error); // Print the error if one occurred
	//console.log('weather forecast------------');
	//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	//console.log(body);
    });

    request('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', {json: true}, function (error, response, body) {
        if (error) return console.log(error); // Print the error if one occurred
	//console.log('weather forecast------------');
	//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log(body);
    });
    */
});

//weather
app.get('/weather', function (req, res) {
    request('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', function (error, response, body) {
	if (error) return console.log( error); // Print the error if one occurred
	console.log('weather forecast response---------------------');
	//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	//console.log('body---------------------');
	console.log('body type---------------------');
	console.log(typeof data);
	console.log(body);
	//console.log(data);
        res.render('weather.ejs', {body});
    });
});

//post new quotes
app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
	if (err) return console.log(err)
	console.log('saved to database')
	res.redirect('/')
    })
})

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
