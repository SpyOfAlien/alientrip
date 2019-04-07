const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/User");
const Trip = require("../models/Trip");
const Comment = require("../models/Comment");
const middleware = require("../middlewares");

//Create Comment route
router.post('/trips/:id/comments', middleware.checkLogin, function(req, res) {
    Trip.findById(req.params.id, function(err, foundTrip) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
                if(err) {
                    console.log(err);
                } else {
                    newComment._author.id = req.user._id;
                    newComment._author.username = req.user.username;
                    newComment.save();
                    foundTrip._comment.push(newComment);
                    foundTrip.save();
                    res.redirect('/trips/' + req.params.id)
                }  
            })
        }
        
    })

})

router.put('/trips/:_id/comments/:commentId', middleware.checkCommentOwnerShip, function(req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comments, function(err, foundComment) {
        if(err) return handleError(err);
        res.redirect('/trips/' + req.params._id);
    })
})

router.delete('/trips/:id/comments/:commentId', middleware.checkCommentOwnerShip, function(req, res) {
    Comment.findByIdAndDelete(req.params.commentId, function(err) {
        if(err) return handleError(err);
        res.redirect('/trips/' + req.params.id);
    })
})


module.exports = router;