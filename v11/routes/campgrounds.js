let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require('../middleware');

//INDEX - show all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user,
                page: "campgrounds"
            });
        }
    })
})


//CREATE - add new campground to the DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        image: image,
        description: description,
        author: author,
        price: price
    };

    //Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
})

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
router.get("/:slug", function (req, res) {
    //find the campground with the provided ID
    Campground.findOne({slug: req.params.slug}).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    })
});

//EDIT CAMPGROUND ROUTE
router.get("/:slug/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findOne({
        slug: req.params.slug
    }, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:slug", middleware.checkCampgroundOwnership, function (req, res) {
    //find and update the correct campground
    Campground.findOne({
        slug: req.params.slug
    }, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //redirect to the show page of the id campground
            campground.name = req.body.campground.name;
            campground.description = req.body.campground.description;
            campground.image = req.body.campground.image;
            campground.save(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    res.redirect("/campgrounds/" + campground.slug);
                }
            })
        }
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:slug", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findOneAndRemove({slug: req.params.slug}, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;