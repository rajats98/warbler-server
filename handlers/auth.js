const db = require("../models");  //same as ../models/index.js
const jwt = require("jsonwebtoken");


exports.signin =async function(req, res, next) {
	try{

		let user = await db.User.findOne({
			email: req.body.email
		});
		let {email, username, profileImageurl} = user;
	
		let isMatched = await user.comparePassword(req.body.password);
		if(isMatched){
			let token = jwt.sign({
					email,
					username,
					profileImageurl
				},
				process.env.SECRET_KEY
			);

			return res.status(200).json({
				email,
				username,
				profileImageurl,
				token
			});
		}
		else{
			return next({
				status:400,
				message: "Invalid Username/Password."
			})
		}

	}
	catch(e){
		return next({
			status:400,
			message: "Invalid Username/Password."
		})
	}
};

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