const Campground = require('../models/campground'),
      Comment    = require('../models/comment'),
      express    = require('express'),
      router     = express.Router({mergeParams: true});

//CREATE - add comment to campground
router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
            res.redirect("/campgrounds");
        } else {
            req.body.comment.author = {
                id: req.user._id,
                username: req.user.username
            };
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
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("comments/new", {campground});
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