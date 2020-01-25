const db = require("../models/index");  //same as ../models/index.js
const jwt = require("jsonwebtoken");

exports.signin = function() {};

exports.signup = async function(req, res, next){
	try{
		let user = await db.User.create(req.body);
		let {id, username, profileImageurl} = user;
		let token = jwt.sign({
				id,
				username,
				profileImageurl
			}, 
			process.env.SECRET_KEY
		);
		return res.status(200).json({
			id,
			username,
			profileImageurl,
			token
		});
	}	
	catch(err){
		if(err.code===11000){
			err.message = "Sorry, that username and/or email is taken"; 
		}
		return next({
			status: 400,
			message: err.message
		})
	}
}