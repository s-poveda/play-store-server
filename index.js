const express = require('express');
const morgan = require('morgan');
const Store = require('./playStore');


const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let collection = Store;
  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

  if (sort && sort !== 'Rating' && sort !== 'App') {
    return res
      .status(400)
      .json({ message: 'invalid sort: must be one of "Rating" or "App"' });
  }

  if (genres && !validGenres.some(currEl => genres.toLowerCase() === currEl.toLowerCase())) {
    return res
      .status(400)
      .json({ message: `invalid genre: must be one of ${validGenres.join(', ')}` });
  }

  if (sort) {
    collection.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  if (genres) {
    collection = collection.filter(app => app.Genres.includes(genres));
  }

  res.json(collection);
});

app.listen(8000, () => 'Server listening on PORT 8000');
