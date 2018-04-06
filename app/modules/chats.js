
const hash = require('md5');
const { omit } = require('lodash');

const { User, Message, Room } = require('../models');
const { errorMaker, issueToken } = require('./utils');



const saveMessage = (payload) => {
  let sender = null;

  return User.findById(payload.sender)
          .then(doc => {
            if (!doc) {
              return Promise.reject(errorMaker('BAD_REQUEST', 'Sender does not exists'));
            } else {
              sender = doc.toObject();
            }
          })
          .then(() => new Message(payload).save())
          .then(result => Object.assign({}, result.toObject(), { sender: sender }));
};

const getMessages = (roomId) => {
  const startDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));

  return Message.find({ room: roomId, createdAt: {$gt : startDate} })
          .populate('sender')
          .sort('createdAt')
          .find({})
          .then(docs => docs.map(doc => doc.toObject()));
}


const saveRoom = (payload) => {
  return User.count({ _id: { $in: payload.participants } })
    .then(result => {
      if (result !== payload.participants.length) {
         return Promise.reject(errorMaker('BAD_REQUEST', 'Invaild participant id'));
      }
    })
    .then(() => new Room(payload).save());
}

const getRooms = (userId, workSpaceId) => {
  let query = { participants: userId };
  if (workSpaceId) query.workSpaceId = workSpaceId;

  return Room.find(query)
    .populate('participants')
    .then(docs => docs.map(doc => doc.toObject()));
}


module.exports = {
  saveMessage: saveMessage,
  getMessages: getMessages,
  saveRoom: saveRoom,
  getRooms: getRooms,
};