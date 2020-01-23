const Campground = require('../models/campground'),
      express    = require('express'),
      router     = express.Router();

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("campgrounds/index", {campgrounds});
        }
    });
});

//CREATE - add campgrounds to DB
router.post("/", isLoggedIn, (req, res) => {
    req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.campground, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campgrounds
router.get("/new", isLoggedIn, (req, res) => {
    res.status(200).render("campgrounds/new");
});

//SHOW - show more info about campground with id
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("campgrounds/show", {campground});
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;