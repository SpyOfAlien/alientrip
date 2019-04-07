const   express         = require("express"),
        passport        = require("passport"),
        mongoose        = require("mongoose"),
        methodOverride  = require("method-override"),
        bodyParser      = require("body-parser"),
        path            = require('path'),
        flash           = require('connect-flash'),
        LocalStrategy   = require('passport-local').Strategy;

const   app = express();
const   routes = require('./routes/trip');
const   comment = require('./routes/comment');
const   index = require('./routes/index');
const   User = require('./models/User');

mongoose.connect("mongodb+srv://alienboy:thanhquang71@cluster0-lflft.mongodb.net/alien_trip?retryWrites=true", { useNewUrlParser: true })

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Connect flash Config
app.use(flash());


//Passport config
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MomentJs require
app.locals.moment = require('moment');

//Local variable
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Route
app.use(routes);
app.use(comment);
app.use(index);

app.listen(8000, function() {
    console.log("Server Started");
});
