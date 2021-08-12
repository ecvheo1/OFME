const express = require('./config/express');
const {logger} = require('./config/winston');

// dev port : 5000
// prod prot : 6000
const port = 5000;
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
