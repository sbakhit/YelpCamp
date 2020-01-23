const Campground = require('../models/campground'),
      User       = require('../models/user'),
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