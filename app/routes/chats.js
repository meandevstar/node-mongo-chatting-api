
const Joi = require('joi');
const { ChatModule } = require('../modules');
const { validate, isAuthenticated } = require('../middleware');



const roomRegisterSchema = {
	name: Joi.string().allow('').optional(),
	participants: Joi.array().required()
};


module.exports = (app) => {
	app.get('/v1/room/:roomId/messages', isAuthenticated, (req, res, next) => {
		const roomId = req.params.roomId;

		ChatModule.getMessages(roomId)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.get('/v1/rooms', isAuthenticated, (req, res, next) => {
		const userId = req.token.id;
		console.log(userId)

		ChatModule.getRooms(userId)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.post('/v1/rooms', validate(roomRegisterSchema), isAuthenticated, (req, res, next) => {
		const payload = req.body;

		ChatModule.saveRoom(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err))
	});

};