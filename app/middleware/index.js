const validate = require('./validator');
const errorHandler = require('./error-handler');
const corsHandler = require('./cors-handler');
const authHandler = require('./auth-handler');

module.exports = {
  validate: validate,
  errorHandler: errorHandler,
  corsHandler: corsHandler,
  isAuthenticated: authHandler
};