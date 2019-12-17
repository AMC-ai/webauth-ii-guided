const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session'); //install express-session
const KnexSessionStore = require("connect-session-knex")(sessions); //to store in db

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig');

const server = express();

const sessionConfiguration = {

  //session storage options
  name: 'chocolatechip', //default would be sid
  secret: 'keep it secret, keep it safe!', //used for encryption (must be an env var)
  saveUninitialized: true, //has implications w/ 
  resave: false, //read more for this later

  //how to store sessions
  store: new KnexSessionStore({
    //do not forget new (keyword) bc you get back a constructor function
    knex,
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 10,
  }),

  //cookie options
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
    secure: false, //if false the cookie is sent over http, if true only sent over https
    httpOnly: true, //if true JS cannot access the cookie

  }
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration)); //this is going to add a req.session object and can be passed throughout the whole app if it is placed here

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
