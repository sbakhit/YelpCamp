const express               = require('express'),
      app                   = express();
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      User                  = require('./models/user'),
      Campground            = require('./models/campground'),
      Comment               = require('./models/comment'),
      seedDB                = require('./models/seeds'),
      PORT                  = 3000;

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// passport setup
app.use(require('express-session')({
    secret: "secret word",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose setup
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});

seedDB();

// routes
app.get("/", (req, res) => {
    res.status(200).render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("campgrounds/index", {campgrounds});
        }
    });
});

//CREATE - add campgrounds to DB
app.post("/campgrounds", isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if(err) {
            console.log(`Error:\n${err}`);
            res.redirect("/campgrounds");
        } else {
            Campground.create(req.body.campground, (err, campground) => {
                if(err) {
                    console.log(`Error:\n${err}`);
                } else {
                    user.campgrounds.push(campground);
                    user.save();
                    res.status(200).redirect("/campgrounds");
                    // res.status(200).redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new", isLoggedIn, (req, res) => {
    res.status(200).render("campgrounds/new");
});

//SHOW - show more info about campground with id
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("campgrounds/show", {campground});
        }
    });
});

//CREATE - add comment to campground
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(`Error:\n${err}`);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.status(200).redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//NEW - show form to create new comment to campground
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("comments/new", {campground});
        }
    });
});

// auth routs
app.get("/register", (req, res) => {
    res.status(200).render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(`Error:\n${err}`);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/login", (req, res) => {
    res.status(200).render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});


app.get("/logout", (req, res) => {
    req.logout();
    res.status(200).redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}.`);
});