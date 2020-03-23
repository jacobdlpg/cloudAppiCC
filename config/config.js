// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DB
let dbUrl;

if (process.env.NODE_ENV == 'dev') {
    dbUrl = 'mongodb://localhost:27017/users';
    
} else {
    dbUrl = process.env.MONGO_URI;
}

process.env.DBURL = dbUrl;
