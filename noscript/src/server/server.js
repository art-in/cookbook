const express = require('express');

const app = express();

app.use(express.static('../client'));
app.use(express.static('../../'));

app.get('/api/recipes', (req, res) => {
  // TODO: stub
  res.end(JSON.stringify([{id: 1}, {id: 2}, {id: 3}]));
});

app.listen(3000, () => console.log('Serving at localhost:3000'));
