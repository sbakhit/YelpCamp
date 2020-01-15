const express    = require('express'),
      app        = express();
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
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

// schema setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
const Campground = mongoose.model("Campground", campgroundSchema);

// var campgrounds_date = require('./data/campgrounds');
// Campground.create(campgrounds_date[0], (err, campground) => {
//     if(err) {
//         console.log(`Error:\n${err}`);
//     } else {
//         console.log(`Success:\n${campground}`);
//     }
// });

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
    const id = req.params.id;
    Campground.findById(id, (err, campground) => {
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