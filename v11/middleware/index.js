let middlewareObj   = {};
let Campground      =   require("../models/campground");
let Comment         =   require("../models/comment");

middlewareObj.checkCommentOwnership = function (req, res, next) {
    //check if user is log in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back")
            } else {
                //check if user is the owner of the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }

            }
        });
    } else {
        req.flash("error", "Please logg in");
        res.redirect("back");
    }
}


middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //check if user is log in
    if (req.isAuthenticated()) {
        Campground.findOne({slug: req.params.slug}, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("back")
            } else {
                //check if user is the owner of the post
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please logg in");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please logg in");
    res.redirect("/login");
}


module.exports = middlewareObj;