const hash = require('md5');
const { omit } = require('lodash');

const { User, Workspace } = require('../models');
const { errorMaker, issueToken } = require('./utils');


const unAllowedUserFields = [
  'password'
];

const registerUser = (payload) => {
  return Workspace.find({ name: payload.workspace })

    .then(docs => {
      if (!docs.length) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'Workspace does not exists'));
      } else {
        payload.workspace = docs[0]._id;
        return User.count({ email: payload.email, workspace: payload.workspace });
      }
    })

    .then(count => {
      if (count > 0) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'User email already exists'));
      }
    })

    .then(() => {
      payload.password = hash(payload.password);

      return new User(payload).save()
        .then(doc => omit(doc.toObject(), unAllowedUserFields))
    })
};

const getUsers = (workspaceId) => {
  let query = workspaceId ? { workspace: workspaceId } : {};

  return User.find(query)
    .then(docs => docs.map(doc => doc.toObject()))
}

const authenticateUser = (payload) => {
  console.log(payload)
  return Workspace.find({ name: payload.workspace })

    .then(docs => {
      if (!docs.length) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'Workspace does not exists'));
      } else {
        return User.find({ email: payload.email, workspace: docs[0]._id })
      }
    })

    .then(docs => {
      if (!docs.length) {
        return Promise.reject(errorMaker('UNPROCESSABLE_ENTITY', 'User does not exists'));
      }
      if (docs[0].password !== hash(payload.password)) {
        return Promise.reject(errorMaker('UNAUTHORIZED', 'Password is invalid'));
      }

      const tokenPayload = {
        id: docs[0]._id,
        workspaceId: docs[0].workspace
      };

      return issueToken(tokenPayload)
        .then(token => {
          return {
            user: omit(docs[0].toObject(), ['password']),
            token: token
          };
        })
    });
};

module.exports = {
  registerUser: registerUser,
  getUsers: getUsers,
  authenticateUser: authenticateUser
};