const Utente = require('../models/utente'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const crypto = require('crypto');

// login
const login = async (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ success: false, message: 'Please, pass a username, password.' });
	}
	// find the user
	let user = await Utente.findOne({ username: req.body.username }).exec().catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	// user not found
	if (!user) {
		console.log("User not found");
		return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
	}

	// check if password hashes match
	let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');

	if (user.hash_password != hash) {
		return res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
	}

	// if user is found and password is right create a token
	var payload = {
		username: user.username,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	return res.status(200).json({
		success: true,
		message: 'Enjoy your token!',
		token: token
	});
};

// signup
const signup = async (req, res) => {
	if (!req.body.username || !req.body.password || !req.body.email || !req.body.numero_tel) {
		res.status(400).json({ success: false, message: 'Please, pass a username, password, email and phone number.' });
		return;
	}
	// check if username is already taken
	let user;
	await Utente.findOne({ username: req.body.username }).exec().then((result) => {
		user = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (user) {
		res.status(409).json({ success: false, message: 'Username already taken.' });
		return;
	}

	// create a new user
	let newUser = new Utente({
		username: req.body.username,
		hash_password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
		email: req.body.email,
		numero_tel: req.body.numero_tel,
		ruolo: "user",
		nomi_organizzazioni: []
	});

	// save the user
	newUser.save((err) => {
		if (err) {
			return res.status(500).json({ Error: "Internal server error: " + err });
		}
		return res.status(201).json({ success: true, message: 'User created successfully.' });
	});
};

const logout = (req, res) => {
	// TODO
};

const getProfile = async (req, res) => {
	user = req.loggedUser;

	if (!user) {
		res.status(401).json({ success: false, message: 'Unauthorized.' });
		return;
	}

	// Get the user profile using the username
	let profile;
	await Utente.findOne({ username: user.username }).exec().then((result) => {
		profile = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!profile) {
		res.status(404).json({ success: false, message: 'User not found.' });
		return;
	}

	return res.status(200).json({ success: true, profile: profile });
};

const getOrganisations = async (req, res) => {
	user = req.loggedUser;

	if (!user) {
		res.status(401).json({ success: false, message: 'Unauthorized.' });
		return;
	}

	// Get the user profile using the username
	let profile;
	await Utente.findOne({ username: user.username }).exec().then((result) => {
		profile = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!profile) {
		res.status(404).json({ success: false, message: 'User not found.' });
		return;
	}

	return res.status(200).json({ success: true, nomi_organizzazioni: profile.nomi_organizzazioni });
};

module.exports = {
	login: login,
	signup: signup, 
	logout: logout,
	getProfile: getProfile,
	getOrganisations: getOrganisations
};