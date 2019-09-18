const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const algoliasearch = require('algoliasearch');

const client = algoliasearch('D8CTF91GO7', '90ca3e16aa6c943e19903da80a0fed2d');
const index = client.initIndex('actors');

const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser());

server.get('/failure', (req, res) => {
  const timeout = parseInt(req.query.howSlow) || 0;
  setTimeout(() => {
    res.send(503, { message: 'Server is overloaded, hopefully today is not Black Friday...' });
  }, timeout);
});

server.get('/other-server', (req, res) => {
  index.search({ query: req.query.query, hitsPerPage: 6 }).then(algoliaresults => {
    res.send(200, { results: algoliaresults.hits });
  });
});

server.get('/slow', (req, res) => {
  const timeout = parseInt(req.query.howSlow) || 0;

  index.search({ query: req.query.query, hitsPerPage: 6 }).then(algoliaresults => {
    setTimeout(() => {
      res.send(200, res.send(200, { results: algoliaresults.hits }));
    }, timeout);
  });
});

server.listen(3001);
