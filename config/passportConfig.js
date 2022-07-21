const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            console.log("Username",username);
            console.log("password",password);
            User.findOne({ '$or': [{email: username}, {username: username}] },
                (err, user) => {
                    if (err)
                    {
                        return done(err);
                    }
                        
                    // unknown user
                    else if (!user)
                    {
                        return done(null, false, { message: 'Email or username is not registered' });
                    }
                    // wrong password
                    else if (!user.verifyPassword(password))
                    {
                        console.log("-----------",user)
                        return done(null, false, { message: 'Wrong password.' });
                    }
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);