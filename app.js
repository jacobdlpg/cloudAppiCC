// Requires
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const routes = require('./routes/routes');
require('./config/config');

// Variable initialization
const app = express();


// Middlewares
// CORS
app.use( cors( { origin: true } ) );

// Body parser
app.use( bodyParser.json() );

// Express Handlebars
app.engine( '.hbs', hbs({
    defaultLayout: 'index',
    extname: '.hbs'
}));
app.set( 'view engine', '.hbs' );

// Routes
app.use( '/', routes );


// DB connection
const opts = { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect( process.env.DBURL, opts, (err, res) => {
    if (err) throw Error( err );
    console.log('DB online!');
});


app.listen( process.env.PORT, () => console.log( `Express server online at port ${ process.env.PORT }` ) );


// For tests purposes
module.exports = app;
