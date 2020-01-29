const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: 'https://frozen-springs-24316.herokuapp.com/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ googleId: profile.id })

  if (existingUser) {
      //we already have an user with the same ID
    return done(null, existingUser);
  }
      //we dont have
    const user = await new User({ googleId: profile.id }).save()
    done(null, user);
  }
)
);
