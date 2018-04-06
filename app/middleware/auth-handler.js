const { verifyToken } = require('../modules/utils');

module.exports = (req, res, next) => {
  const accessToken = req.get('accessToken');
  
  verifyToken(accessToken)
    .then(token => {
      req.token = token;
      next();
    })
    .catch(err => next(err));
}