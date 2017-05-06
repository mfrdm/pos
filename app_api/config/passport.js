var passport = require('passport');
var mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserModel = mongoose.model('users');
var LocalStrategy = require ('passport-local').Strategy;

module.exports = function(passport) {   
	// used to serialize the user for the session
    passport.serializeUser (function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser (function(id, done) {
        UserModel.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use (new GoogleStrategy({
		clientID: '734454815123-6mm9nbsp7gd4ibiumb84kk30c3kd2as0.apps.googleusercontent.com',
		clientSecret: 'YLY5INoa9CqzBgpkw10lmbX6',
		callbackURL: "http://localhost:3000/auth/google/callback", // NOTICE
	},

    passport.use (new LocalStrategy(
        {},
        function (username, password, done){
            UserModel.findOne({ $or: [{'phone': username}, {'email': username}] }, // need to check either email or phone
                function(err, user) {
                    if (err) return done (err);
                    if (!user) {
                        return done(null, user);
                    }
                    if (!user.validPassword (password)){
                        return done (null, false, {
                            message: 'Incorrect password'
                        });
                    }

                    return done (null, user);
                }
            );
        }
    )),

	function(token, refreshToken, profile, done) {
        // try to find the user based on their google id
        UserModel.findOne({ 'google.id': profile.id }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                // if a user is found, log them in
                return done(null, user);
            } else {
                // if the user isnt in our database, create a new user
                var newUser = new UserModel();
                // set all of the relevant information
                newUser.google.id = profile.id;
                newUser.google.token = token;
                newUser.google.name = profile.displayName;
                newUser.google.email = profile.emails[0].value; // pull the first email

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));
}
	
