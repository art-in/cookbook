const express = require('express');
const api = express.Router();

const asyncMiddleware = require('./utils/async-middleware');
const db = require('./storage/db');
const files = require('./storage/files');

api.get(
  '/api/recipes',
  asyncMiddleware(async (req, res) => {
    const sortProp = req.query.sp || 'name';
    const sortDir = req.query.sd || 'asc';
    const pageOffset = Number(req.query.po) || 0;
    const pageLimit = Number(req.query.pl) || 100;

    const data = await db.getRecipes(sortProp, sortDir, pageOffset, pageLimit);
    res.send(data);
  })
);

api.post(
  '/api/recipes',
  asyncMiddleware(async (req, res) => {
    await db.addRecipe(req.body);
    res.end();
  })
);

api.get(
  '/api/recipes/:id',
  asyncMiddleware(async (req, res) => {
    const recipeId = Number(req.params.id);
    const recipe = await db.getRecipe(recipeId);
    if (recipe) {
      res.send(recipe);
    } else {
      res.status(404).end();
    }
  })
);

api.put(
  '/api/recipes/:id',
  asyncMiddleware(async (req, res) => {
    const recipeId = Number(req.params.id);
    const updated = await db.updateRecipe(recipeId, req.body);
    res.status(updated ? 200 : 404).end();
  })
);

api.delete(
  '/api/recipes/:id',
  asyncMiddleware(async (req, res) => {
    const recipeId = Number(req.params.id);
    const deleted = await db.deleteRecipe(recipeId);
    res.status(deleted ? 200 : 404).end();
  })
);

api.get(
  '/api/recipes/:id/image',
  asyncMiddleware(async (req, res) => {
    const recipeId = Number(req.params.id);
    const imageStream = await files.getRecipeImage(recipeId);
    if (imageStream) {
      imageStream.pipe(res);
    } else {
      res.status(404).end();
    }
  })
);

api.post('/api/recipes/:id/image', (req, res) => {
  const recipeId = Number(req.params.id);
  req.busboy.on('file', (_, file) => {
    files.addRecipeImage(recipeId, file).then(() => res.end());
  });
});

api.delete(
  '/api/recipes/:id/image',
  asyncMiddleware(async (req, res) => {
    const recipeId = Number(req.params.id);
    const deleted = await files.deleteRecipeImage(recipeId);
    res.status(deleted ? 200 : 404).end();
  })
);

module.exports = api;
