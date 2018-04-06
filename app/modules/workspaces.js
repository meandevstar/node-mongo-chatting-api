
const { pick } = require('lodash');

const { User, Workspace } = require('../models');
const UserModule = require('./users');
const { errorMaker } = require('./utils');

const userAllowedFields = [
  'email',
  'password'
];
const workspaceAllowedFields = [
  'name',
  'displayName'
];



const createWorkspace = (payload) => {
  return Workspace.count({ name: payload.name })

    .then(count => {
      if (count > 0) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'Workspace name is already used, please use another name'));
      } else {
        const workspacePayload = pick(payload, workspaceAllowedFields);
        return new Workspace(workspacePayload).save()
      }
    })
    
    .then(workspace => {
      let userPayload = pick(payload, userAllowedFields);
      userPayload.workspace = payload.name;

      return UserModule.registerUser(userPayload)
        .then(user => {
          workspace.admin = user._id;

          const userUpdateParams = {
            workspace: workspace._id,
            name: 'Administrator'
          };
          return User.findByIdAndUpdate(user._id, { $set: userUpdateParams });
        })
        .then(() => workspace.save())
        .then(workspace => workspace.toObject())
    });
}

const getWorkspaces = (query) => {
  return Workspace.find(query)
    .then(docs => docs.map(doc => doc.toObject()))
}

module.exports = {
  createWorkspace: createWorkspace,
  getWorkspaces: getWorkspaces
}