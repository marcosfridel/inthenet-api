//npm install dotenv --save.
require('dotenv').config();

const express = require('express');
const app = express();

const expressSession = require('express-session');

/* const cookieSession = require("cookie-session"); */

app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

//npm install cookie-parser
const cookieParser = require('cookie-parser');

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));

app.use(expressSession({
    secret: process.env.PASSPORT_LOCAL_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge : 6000000 }
    
}));

/* app.use(cookieSession({
    name: 'session',
    keys: [ process.env.COOKIE_PARSER_SECRET_KEY ],
    maxAge: 24 * 60 * 60 * 1000 // session will expire after 24 hours
  })) */

// CORS
//npm i cors
const cors = require('cors');

var corsOptions = {
    origin: '*', // Aqui debemos reemplazar el * por el dominio de nuestro front
    credentials: true,            //access-control-allow-credentials:true
    optionsSuccessStatus: 200 // Es necesario para navegadores antiguos o algunos SmartTVs
}
app.use(cors(corsOptions));

//app.use('/login', auth.verify, require('./routes/login'));


app.use('/user', require('./routes/user'));

app.use('/blog', require('./routes/blog'));
app.use('/content', require('./routes/content'));
//app.use('/file', require('./routes/file'));
app.use('/file', require('./routes/file'));
//app.use('/r2edirect', require('./routes/re2direct'));

const cluster = require('./lib/cluster');
const chat = require('./lib/chat');

if(!cluster.isMaster){
    console.log(`Iniciando Servidor. Puerto ${process.env.SERVER_PORT}.`);
    const server = app.listen(process.env.SERVER_PORT, () => {
        console.log(`Servidor iniciado.`);
    })

    // CHAT
    chat.create(process.env.SERVER_PORT_CHAT);

    
    const twilio = require('./lib/twilio')
    //twilio.sendWsp('5491157531979', '1, 2, 3, Probando...')
    //twilio.sendSms('+54 011 57531979', '1, 2, 3, Probando...')
}

// PASSPORT
const passport = require("passport");

app.use('/auth', require('./routes/auth')(passport));
//app.use('/auth', require('./routes/authLocal'));
app.use('/auth', require('./routes/authFacebook')(passport)); 
app.use('/auth', require('./routes/authGoogle')(passport)); 
app.use('/auth', require('./routes/authInstagram')(passport)); 


app.use(passport.initialize());
app.use(passport.session());


/* const passport = require('./lib/authLocal');

app.use(expressSession({
    secret: process.env.PASSPORT_LOCAL_SECRET_KEY,
    resave: false,
    saveUninitialized: true
    }
));
app.use(passport.initialize());
app.use(passport.session()); */

// ROUTES
app.use(express.static(__dirname + '/public'));


app.use('/files', express.static(__dirname + '/files'));

app.get('/', (req, res, next) => {
    next();
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


