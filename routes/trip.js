const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/User");
const Trip = require("../models/Trip");
const Comment = require("../models/Comment");
const middleware = require("../middlewares");
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'de0xfawx3', 
  api_key: '185357266588899', 
  api_secret: '7MrI2zIBId_eg0AsMXvrRJ_RJC0'
});


//Root route
router.get('/', function(req, res) {
    res.redirect('/trips');
})

//Index route
router.get("/trips", function(req, res) {
    Trip.find(function(err, trip){
        if(err) {
            console.log(err);
        } else {
            res.render("trip/index", {trip: trip});
        }
    })  
});

//Add route
router.get("/trips/new", middleware.checkLogin, function(req, res) {
    res.render("trip/new");
});

//Create route
router.post("/trips/new", middleware.checkLogin, upload.single('image'),function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.trips.image = result.secure_url;
        req.body.trips._author = {
          id: req.user._id,
          username: req.user.username
        }
        Trip.create(req.body.trips, function(err, trip) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/trips/' + trip.id);
        });
      });  
});

//Show route
router.get("/trips/:_id", function(req, res) {
    Trip.
        findById(req.params._id).
        populate('_comment').
        exec(function(err, foundTrip) {
            if(err) {
                console.log(err);
            } else {               
                res.render("trip/show", { trip: foundTrip });
            }
        })
});

//Edit route
router.get('/trips/:_id/edit', middleware.checkTripOwnerShip ,function(req, res) {
    Trip.findById(req.params._id, function(err, foundTrip) {
        if(err) return handleError(err);
        res.render('trip/edit', { trip: foundTrip });
    })
});

//Update route
router.put('/trips/:_id/edit', middleware.checkTripOwnerShip,function(req, res) {
    Trip.findByIdAndUpdate(req.params._id, req.body.trips,function(err, foundTrip) {
        if(err) return handleError(err);
        res.redirect('/trips/' + req.params._id);
    })
});

//Delete route
router.delete('/trips/:_id', middleware.checkTripOwnerShip,function(req, res) {
    Trip.findByIdAndDelete(req.params._id, function(err, foundTrip) {
        if(err) return handleError(err);
        res.redirect('/trips');
    })
});

// Show gallery
router.get('/trips/:id/gallery', (req, res) => {
    Trip.findById(req.params.id, function(err, foundTrip) {
        if(err) {
            req.flash('error', 'No image founded');
            res.redirect('/trips/' + req.params.id);
        } else {
            res.render('gallery/gallery', {trip: foundTrip});
        }
    })
})

router.post('/trips/:_id/gallery', middleware.checkTripOwnerShip, upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, {
        eager: {
            width: 800,
            height: 533,
            crop: 'pad'
        }
    }, function(result) {
        Trip.findById(req.params._id, function(err, foundTrip) {
            if(err) {
                req.flash('error', err.message);
                res.redirect('/trips/' + req.params._id);
            }
            foundTrip.image.push(result.secure_url);
            foundTrip.save();
            res.redirect('/trips/' + req.params._id + '/gallery');
        })
      }); 
});

module.exports = router;