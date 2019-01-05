const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

// space routes
app.get('/spaces', db.getSpaces);
app.get('/spaces/:space_id', db.getSpaceById);
app.post('/spaces', db.createSpace);
app.put('/spaces/:space_id', db.updateSpace);
app.delete('/spaces/:space_id', db.deleteSpace);

// wikipage routes
app.get('/wikipages/', db.getWikipages);
app.get('/wikipages/:id', db.getWikipageById);
app.post('/wikipages', db.createWikipage);
app.put('/wikipages/:id', db.updateWikipage);
app.delete('/wikipages/:id', db.deleteWikipage);

// spaces routes
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
