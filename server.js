//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    bodyParser= require('body-parser')

const MongoClient = require('mongodb').MongoClient
var db

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: true}))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

//Accessing MongoDB on mLab
MongoClient.connect('mongodb://babyPero:testtest@ds217898.mlab.com:17898/test-project', (err, client) => {
    if (err) return console.log(err)
    db = client.db('test-project') // database name
}}

// top page - retrieve and render quotes
app.get('/', function (req, res) {
    db.collection('quotes').find().toArray(function(err, result) {
	if (err) return console.log(err)
	console.log('-------')
	console.log(result)
	res.render('index.ejs', {quotes: result})
	for(var i=0; i<result.length; i++) {
	    console.log(result[i].name)
	    console.log(result[i].quote)
	}
    })
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
