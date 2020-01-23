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
                    res.redirect(`/campgrounds/${campground._id}`);
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
            res.render("comments/new", {campground});
        }
    });
});

//EDIT - show form to update comment
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        res.render("comments/edit", {comment, campground_id: req.params.id});
    });
});

//UPDATE - edit comment
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

//DELETE - delete comment
router.delete("/:comment_id", checkCommentOwnership, (req, res, next) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        comment.remove();
        // req.flash("success", `Campground ${campground.name} delete`);
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if(err) {
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;