const express = require('express');
const user = require('../database/databse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const route = express.Router();
//Rest API
route.get('/verfiyUser/:username', (req, res, next) => {
    let param = req.params;
    user.findUserByName(param.username.toUpperCase(), (err, result) => {
        if (err) console.log(err);
        if (!result) {
            console.log(result);
            res.json({ success: true });
        }
        else {
            res.json({ success: false });
        }
    })
});
route.post('/register', (req, res, next) => {
    let newUser = req.body;
    newUser.username = newUser.username.toUpperCase();
    user.findUserByName(newUser.username, (err, result) => {
        if (err) console.log(err);
        if (!result) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) console.log(err);
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log(err);
                    newUser.password = hash;
                    user.create(newUser)
                        .then((data) => {
                            console.log('user:' + data + " successfully added");
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
            })
        }
    })

});
route.post('/login', (req, res, next) => {
    console.log(123);
    let getUser = req.body;
    getUser.username = getUser.username.toUpperCase();
    user.findUserByName(getUser.username, (err, result) => {
        if (err) console.log(err);
        if (result) {
            bcrypt.compare(getUser.password, result.password, (err, success) => {
                if (err) console.log(err);
                if (success) {
                    let token = jwt.sign(result.toJSON(), 'Mysecret', {
                        expiresIn: 604800
                    })
                    res.json({ success: true, token: 'jwt ' + token });
                }
                else if (!success) {
                    res.json({ success: false });
                }
            })

        }
        else if (!result) {
            res.json({ success: false });
        }
    })
});

route.get('/authentication', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});



module.exports = route;