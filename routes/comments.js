const Campground = require('../models/campground'),
      Comment    = require('../models/comment'),
      express    = require('express'),
      router     = express.Router({mergeParams: true}),
      middleware = require('../middleware');

//CREATE - add comment to campground
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err || !campground) {
            console.log(err);
            req.flash("error", "Error retrieving campground");
            res.redirect("/campgrounds");
        } else {
            req.body.comment.author = {
                id: req.user._id,
                username: req.user.username
            };
            Comment.create(req.body.comment, (err, comment) => {
                if(err || !comment) {
                    console.log(err);
                    req.flash("error", "Error creating comment");
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "comment is created");
                }
                res.redirect(`/campgrounds/${campground._id}`);
            });
        }
    });
});

//NEW - show form to create new comment to campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err || !campground) {
            console.log(err);
            req.flash("error", "Error retrieving campground");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground});
        }
    });
});

//EDIT - show form to update comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        res.render("comments/edit", {comment, campground_id: req.params.id});
    });
});

//UPDATE - edit comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, () => {
        req.flash("success", "comment is updated");
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

//DELETE - delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        comment.remove();
        req.flash("success", "comment is deleted");
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

module.exports = router;