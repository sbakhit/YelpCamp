const express    = require('express'),
      app        = express();
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      seedDB     = require('./models/seeds'),
      PORT       = 3000;

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

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
            res.status(200).render("index", {campgrounds});
        }
    });
});

//CREATE - add campgrounds to DB
app.post("/campgrounds", (req, res) => {
    newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    };
    Campground.create(newCampground, (err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new", (req, res) => {
    res.status(200).render("new");
});

//SHOW - show more info about campground with id
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err) {
            console.log(`Error:\n${err}`);
        } else {
            res.status(200).render("show", {campground});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}.`);
});