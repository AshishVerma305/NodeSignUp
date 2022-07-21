const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { use } = require('passport');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    console.log("Inside register Service");
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.username = req.body.username;
    user.address = req.body.address;
    user.mobile = req.body.mobile;
    console.log("User----------",user)
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email address or username found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    console.log(req.body);
    console.log("inside Authenticate")
    console.log("email",req.body.email);
    console.log("password",req.body.passWord)
    User.findOne({ '$or': [{email: req.body.email}, {username: req.body.email}] },
                (err, user) => {
                    if (err)
                    {
                        console.log("first");
                        return res.status(400).json(err);
                    }
                    // unknown user
                    else if (!user)
                    {
                        console.log("second");
                        return res.status(400).json({ status: false,message: 'Email or username is not registered' });
                    }
                    // wrong password
                    else if (!user.verifyPassword(req.body.passWord))
                    {
                        console.log("third");
                        return res.status(404).json({ status: false,message: 'Wrong password.' });
                    }
                    // authentication succeeded
                    else
                    {
                        console.log("fourth");
                        return res.status(200).json({status:true,'token':user.generateJwt() })
                    }
                });
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email', 'username', 'address', 'mobile']) });
        }
    );
}

module.exports.updateUserProfile = (req, res, next) =>{
    User.findOneAndUpdate({ _id: req._id }, {fullName: req.body.fullName}, {upsert:true},
        (err, user) => {
        if (!user)
    return res.status(404).json({ status: false, message: 'User record not found.' });
else
    {
        return res.status(200).json({
            status: true
        });
    }
}
);
}

module.exports.findAllUsers = (req, res, next) => {
    User.find({}, (err, docs) => {
        if (!err)
            return res.status(200).json({ status: true, user: docs });
        else {
            res.status(404).json({ status: false, message: 'Users record not found.' });
        }
    });
};




module.exports.findUser = (req, res, next) => {

    User.findOne({ '$or': [{email: req.params.username}, {username: req.params.username}] },(err, users) => {
        if (!users)
        {
            return res.status(404).json({ status: false, message: 'User record not found.' });
        }
        else {
            return res.status(200).json({ status: true, user : _.pick(users,['fullName','email', 'username', 'address', 'mobile']) });
        }
    });
}

