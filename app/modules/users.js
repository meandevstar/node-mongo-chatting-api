const hash = require('md5');
const { omit } = require('lodash');

const { User } = require('../models');
const { errorMaker, issueToken } = require('./utils');


const unAllowedUserFields = [
  'password'
];

const registerUser = (payload) => {
  return User.find({ email: payload.email })
          .then(doc => {
            if (doc.length > 0) {
              console.log('Email is the same')
              return Promise.reject(errorMaker('BAD_REQUEST', 'User email already exists'));
            }
          })
          .then(() => {
            payload.password = hash(payload.password);

            return new User(payload).save()
              .then(doc => omit(doc.toObject(), unAllowedUserFields))
          })
};

const getUsers = () => {
  return User.find({})
    .then(docs => docs.map(doc => doc.toObject()))
}

const authenticateUser = (payload) => {
  return User.find({ email: payload.email })
          .then(docs => {
            if (!docs.length) {
              return Promise.reject(errorMaker('UNPROCESSABLE_ENTITY', 'User does not exists'));
            }
            if (docs[0].password !== hash(payload.password)) {
              return Promise.reject(errorMaker('UNAUTHORIZED', 'Password is invalid'));
            }

            const tokenPayload = {
              id: docs[0]._id
            };

            return issueToken(tokenPayload)
                    .then(token => {
                      return {
                        user: omit(docs[0].toObject(), ['password']),
                        token: token
                      };
                    })
          })
};

module.exports = {
  registerUser: registerUser,
  getUsers: getUsers,
  authenticateUser: authenticateUser
};