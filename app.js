const express    = require('express'),
      app        = express();
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campground = require('./models/campground'),
      Comment    = require('./models/comment'),
      seedDB     = require('./models/seeds'),
      PORT       = 3000;

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

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
app.post("/campgrounds", (req, res) => {
    Campground.create(req.body.campground, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new", (req, res) => {
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
app.post("/campgrounds/:id/comments", (req, res) => {
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
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("comments/new", {campground});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}.`);
});