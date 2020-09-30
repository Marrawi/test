require('dotenv').config();
require('./models/siteInfo.js');

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const expressStaticGzip = require("express-static-gzip");
const helmet = require("helmet");
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./schema/index');
const graphqlResolvers = require('./resolvers/index');
const expressPlayground = require('graphql-playground-middleware-express').default;
const isAuth = require('./middleware/isAuth');

const app = express();

try {

  app.use(express.json());

  // cookie parser middleware
  app.use(cookieParser());

  // compress your api
  app.use(compression());

  // secure express
  app.use(helmet({contentSecurityPolicy: false }));

  // check authentication
  app.use(isAuth);

  // aowsome graphql playground
  // app.get('/api', expressPlayground({ endpoint: '/api' }));

  app.use('/api', graphqlHTTP({ schema: graphqlSchema, rootValue: graphqlResolvers }));

  app.use('/', expressStaticGzip("/public/"));

  app.use(express.static(__dirname + '/public/'));

  app.get(/.*/, (req,res) => res.sendFile(__dirname + '/public/index.html'));

  // connect to Database , after that start the Server
  mongoose.connect(process.env.MONGODB_SERVER,
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then( () => { app.listen({ port: process.env.APP_PORT }) })
    .catch( err => { console.log(err) } );

  // Listen the server
  console.log(`Server listening for marrawi on http://localhost:${process.env.APP_PORT}`);

} catch (err) {
  console.log(err);
}
