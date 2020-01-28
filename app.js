const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      flash                 = require('connect-flash'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      methodOverride        = require('method-override'),
      User                  = require('./models/user'),
    //   seedDB                = require('./seeds'),
    //   PORT                  = process.env.PORT || 3000,
    //   IP                    = process.env.IP || '127.0.0.1',
      DBURL                 = process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp_camp';

const commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes      = require('./routes/index');

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose setup
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(DBURL, {useNewUrlParser: true});
// seedDB(); // seed database

// routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Server is running: ${process.env.IP}:${process.env.PORT}`);
});