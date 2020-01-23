const passport = require('passport'),
      User     = require('../models/user'),
      express  = require('express'),
      router   = express.Router();

// root route
router.get("/", (req, res) => {
    res.status(200).render("landing");
});

//NEW - show form to register new user
router.get("/register", (req, res) => {
    res.status(200).render("register");
});

//CREATE - add new user
router.post("/register", (req, res) => {
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

//NEW - show form to login as user
router.get("/login", (req, res) => {
    res.status(200).render("login");
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
    res.status(200).redirect("/campgrounds");
});

module.exports = router;