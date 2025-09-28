const { getAll, create, getOne, remove, update, login, logged } = require('../controllers/user.controllers');
const express = require('express');
const { passwordMiddlewares } = require('../middlewares/password.middlewares');
const fieldsDeleteUpdate = require('../middlewares/fieldsDeleteUpdate.middlewares');
const { loginMiddleware } = require('../middlewares/login.middlewares');
const { verifyJWT } = require('../utils/verifyJWT');

const routerUser = express.Router();

routerUser.route('/')
  .get(verifyJWT, getAll)
  .post(passwordMiddlewares, create);

routerUser.route('/login')
  .post(loginMiddleware, login)

routerUser.route('/me')
  .get(verifyJWT, logged)

routerUser.route('/:id')
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, fieldsDeleteUpdate, update);

module.exports = routerUser;