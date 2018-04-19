const hash = require('md5');
const { omit } = require('lodash');

const { User, Workspace } = require('../models');
const { errorMaker, issueToken, sendEmail } = require('./utils');


const unAllowedUserFields = [
  'password'
];

const registerUser = (payload) => {
  // return Workspace.find({ name: payload.workspace })

  //   .then(docs => {
  //     if (!docs.length) {
  //       return Promise.reject(errorMaker('BAD_REQUEST', 'Workspace does not exists'));
  //     } else {
  //       payload.workspace = docs[0]._id;
        return User.count({ email: payload.email/*, workspace: payload.workspace */})
    //   }
    // })

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
  // return Workspace.find({ name: payload.workspace })

  //   .then(docs => {
  //     if (!docs.length) {
  //       return Promise.reject(errorMaker('BAD_REQUEST', 'Workspace does not exists'));
  //     } else {
        return User.find({ email: payload.email/*, workspace: docs[0]._id */})
    //   }
    // })

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

const getUserWorkspaces = (email) => {
  console.log(email)
  return User.find({ email: email }).populate('workspace')
    .then(docs => {
      console.log(docs)
      return docs.filter(doc => !!doc.workspace)
        .map(doc => doc.workspace.name);
    })
    .then(workspaceNames => {
      const subject = 'Your Workspaces';
      let text = 'You have no workspace'
      if (workspaceNames.length) {
        text = 'Your workspaces are ' + workspaceNames.join(', ');
      }

      console.log(workspaceNames, text)

      return sendEmail(email, subject, text)
        .then(() => {
          console.log(`Workspace find email sent to ${email}: ${text}`);
        });
    });
}

const updateUser = (payload) => {
  console.log('', payload)
  return User.findOne({ _id: payload.id })
    .then(doc => {
      if (!doc) {
        return Promise.reject(errorMaker('UNPROCESSABLE_ENTITY', 'User does not exists'));
      }

      let updatePayload = omit(payload, ['id','password', 'oldPass']);

      if (payload.password && payload.oldPass) {
        if (doc.password === hash(payload.oldPass)) {
          const encrypted = hash(payload.password);
          updatePayload = Object.assign(updatePayload, { password: encrypted });
        } else {
          return Promise.reject(errorMaker('BAD_REQUEST', 'Old Password is incorrect'))
        }
      }

      Object.keys(updatePayload).forEach(key => {
        doc[key] = updatePayload[key];
      });
      return doc.save().then(result => result.toObject());
    });
}

module.exports = {
  registerUser: registerUser,
  getUsers: getUsers,
  updateUser: updateUser,
  authenticateUser: authenticateUser,
  getUserWorkspaces: getUserWorkspaces
};