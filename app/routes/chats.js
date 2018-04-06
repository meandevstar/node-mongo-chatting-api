
const Joi = require('joi');
const { ChatModule, WorkspaceModule } = require('../modules');
const { validate, isAuthenticated } = require('../middleware');


const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
const roomRegisterSchema = {
	name: Joi.string().allow('').optional(),
	participants: Joi.array().required()
};

const workspaceRegisterSchema = {
	name: Joi.string().required(),
	displayName: Joi.string().required(),
	email: Joi.string().required(),
	password: Joi.string().regex(passwordRegx).required(),
}


module.exports = (app) => {
	app.get('/v1/room/:roomId/messages', isAuthenticated, (req, res, next) => {
		const roomId = req.params.roomId;

		ChatModule.getMessages(roomId)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.get('/v1/rooms', isAuthenticated, (req, res, next) => {
		const userId = req.token.id;
		const workspaceId = req.token.workspaceId;
		console.log(userId)

		ChatModule.getRooms(userId)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.post('/v1/rooms', isAuthenticated, validate(roomRegisterSchema), (req, res, next) => {
		const payload = req.body;

		ChatModule.saveRoom(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.get('/v1/workspaces', (req, res, next) => {
		WorkspaceModule.getWorkspaces()
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.post('/v1/workspaces', validate(workspaceRegisterSchema), (req, res, next) => {
		const payload = req.body;

		WorkspaceModule.createWorkspace(payload)
			.then(result => res.status(200).json(result))
			.catch(err => {
				console.log(err.message)
				next(err)
			});
	});

};