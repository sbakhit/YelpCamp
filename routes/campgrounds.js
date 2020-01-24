const Campground = require('../models/campground'),
      express    = require('express'),
      router     = express.Router(),
      middleware = require('../middleware');

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err || !campgrounds) {
            console.log(err);
            req.flash("error", "Error retrieving campgrounds");
            res.redirect("/");
        } else {
            res.render("campgrounds/index", {campgrounds});
        }
    });
});

//CREATE - add campgrounds to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.campground, (err, campground) => {
        if(err || !campground) {
            console.log(err);
            req.flash("error", "Error creating campground");
        } else {
            req.flash("success", `${campground.name} is created`);
        }
        res.redirect("/campgrounds");
    });
});

//NEW - show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - show more info about campground with id
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err || !campground) {
            console.log(err);
            req.flash("error", "Error retrieving campground");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground});
        }
    });
});

//EDIT - show form to update campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("campgrounds/edit", {campground});
    });
});

//UPDATE - edit campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, () => {
        req.flash("success", `${req.body.campground.name} is updated`);
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

//DELETE - delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        campground.remove();
        req.flash("success", `${campground.name} is deleted`);
        res.redirect("/campgrounds");
    });
});

module.exports = router;