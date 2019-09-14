const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const server = express();
server.use(cors());
server.use(bodyParser());

server.get('/failure', (_, res) => {
  res.send(503, { message: "I'm a very busy server" });
});

server.get('/other-server', (_, res) => {
  res.send(200, { results: [{ name: 'Here' }] });
});

server.get('/slow', (req, res) => {
  const timeout = req.body.howSlow;

  setTimeout(() => {
    res.send(200, { message: "I'm a very busy server" });
  }, timeout);
});

server.listen(3001);
