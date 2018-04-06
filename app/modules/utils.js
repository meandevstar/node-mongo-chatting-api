const jwt = require('jsonwebtoken');
const config = require('../../config');



const issueToken = (payload) => {
  const secret = config.app.jwtSecret,
      expiresIn = config.app.jwtExpiresIn,
      algorithm = config.app.jwtAlgorithm;

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, {expiresIn, algorithm}, (err, token) => {
      if(err) reject(err);
      else resolve(token);
    });
  });
};

const verifyToken = (accessToken) => {
  const secret = config.app.jwtSecret,
        algorithm = config.app.jwtAlgorithm;

  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, secret, {algorithm}, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

const errorMaker = (type, message, customName) => {
  let error = new Error(message);
  
  switch (type) {
    case 'UNAUTHORIZED':
      error.name = customName || 'UnauthorizedError';
      error.status = 401;
      error.message = error.message || 'Authentication required';
      
      break;
    
    case 'BAD_REQUEST':
      error.name = customName || 'BadRequest';
      error.status = 400;
      error.message = error.message || 'Invalid request';
      
      break;

    case 'UNPROCESSABLE_ENTITY':
      error.name = customName || 'BadRequest';
      error.status = 422;
      error.message = error.message || 'Entity does not exists';
      
      break;

    case 'BAD_PERMISSION':
      error.name = customName || 'BadPermission';
      error.status = 550;
      error.message = error.message || 'Permission Denied';
      
      break;
    
    default:
      error.name = customName || 'InternalServerError';
      error.status = 500;
      error.message = error.message || 'An error occurred';
      
      break;
  }

  return error;
};


module.exports = {
  errorMaker: errorMaker,
  issueToken: issueToken,
  verifyToken: verifyToken
};