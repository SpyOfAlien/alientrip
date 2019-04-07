const Trip = require("../models/Trip");
const Comment = require("../models/Comment");

module.exports = {
    checkLogin: function(req, res, next) {
        if(req.isAuthenticated()) {
            next();
        } else {
            req.flash("error", "Please Login First!")
            res.redirect('/login');
        }
    },
    
    checkTripOwnerShip: function(req, res, next) {
        if(req.isAuthenticated()) {
            Trip.findById(req.params._id, function(err, foundTrip) {
                if(err) {
                    return handleError(err); 
                } 
                else if(foundTrip._author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect('back');
                }
            })
        } else {
            res.redirect('back');
        }
    },
    
    
    checkCommentOwnerShip: function(req, res, next) {
        if(req.isAuthenticated()) {
            Comment.findById(req.params.commentId, function(err, foundComment) {
                if(err) {
                    return handleError(err); 
                } 
                else if(foundComment._author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect('back');
                }
            })
        } else {
            res.redirect('back');
        }
    }
}

