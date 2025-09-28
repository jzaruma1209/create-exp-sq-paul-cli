const { getAll, create, getOne, remove, update } = require('../controllers/review.controllers');
const express = require('express');

const routerReview = express.Router();

routerReview.route('/')
  .get(getAll)
  .post(create);

routerReview.route('/:id')
  .get(getOne)
  .delete(remove)
  .put(update);

module.exports = routerReview;