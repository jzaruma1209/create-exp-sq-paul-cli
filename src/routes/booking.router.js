const { getAll, create, getOne, remove, update } = require('../controllers/booking.controllers');
const express = require('express');

const routerBooking = express.Router();

routerBooking.route('/')
  .get(getAll)
  .post(create);

routerBooking.route('/:id')
  .get(getOne)
  .delete(remove)
  .put(update);

module.exports = routerBooking;