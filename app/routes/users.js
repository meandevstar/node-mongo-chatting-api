
const Joi = require('joi');
const { UserModule } = require('../modules');
const { validate, isAuthenticated } = require('../middleware');



const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
const userRegisterSchema = {
	name: Joi.string(),
	password: Joi.string().regex(passwordRegx).required(),
	email: Joi.string().email().required(),
	workspace: Joi.string().required()
};

const userAuthenticateSchema = {
	email: Joi.string().email().required(),
	password: Joi.string().regex(passwordRegx).required(),
	workspace: Joi.string().required()
};


module.exports = (app) => {
	app.get('/v1/users', isAuthenticated, (req, res, next) => {
		const workspaceId = req.token.workspaceId
		UserModule.getUsers(workspaceId)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.post('/v1/users', validate(userRegisterSchema), (req, res, next) => {
		const payload = req.body;
		const cred = {
			email: payload.email,
			password: payload.password,
			workspace: payload.workspace
		};

		UserModule.registerUser(payload)
			.then(() => UserModule.authenticateUser(cred))
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	app.post('/v1/user/authenticate', validate(userAuthenticateSchema), (req, res, next) => {

		const payload = req.body;

		UserModule.authenticateUser(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

};