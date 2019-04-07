const express = require("express");
const passport = require('passport');
const User = require("../models/User");
const Trip = require("../models/Trip");
const router = express.Router({ mergeParams: true });

router.get('/register', function (req, res) {
    res.render('register');
})

router.post('/register', function (req, res) {
    const newUser = new User({ username: req.body.username });
    if (req.body.admin === 'alienboy') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, account) {
        if (err) {
            req.flash('error', err.message)
            res.render("register");
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Welcome ' + newUser.username)
            res.redirect('/trips');
        })
    })
})

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/trips",
    failureRedirect: "/login"
}), function (req, res) {
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash("error", "Logout!")
    res.redirect('/trips');
});

//user profile
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else {
            Trip.find().where('_author.id').equals(foundUser._id).exec(function(err, trip) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('users/show', {user: foundUser, trip: trip});
                }
            })      
        }
    })
});


module.exports = router;