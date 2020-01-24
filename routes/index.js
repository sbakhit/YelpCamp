const passport = require('passport'),
      User     = require('../models/user'),
      express  = require('express'),
      router   = express.Router();

// root route
router.get("/", (req, res) => {
    res.render("landing");
});

//NEW - show form to register new user
router.get("/register", (req, res) => {
    res.render("register");
});

//CREATE - add new user
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err || !user) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", `${user.username} registered`);
                res.redirect("/campgrounds");
            });
        }
    });
});

//NEW - show form to login as user
router.get("/login", (req, res) => {
    res.render("login");
});

//CREATE - login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

// logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;