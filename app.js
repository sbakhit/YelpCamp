const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var campgrounds = require('./data/campgrounds');

// routes
app.get("/", (req, res) => {
    res.status(200).render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.status(200).render("campgrounds", {campgrounds});
});

app.post("/campgrounds", (req, res) => {
    newCampground = {
        name: req.body.name,
        image: req.body.image
    };
    campgrounds.push(newCampground);
    res.status(200).redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.status(200).render("new");
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}.`);
});