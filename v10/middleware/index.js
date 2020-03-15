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
                    res.redirect("back");
                }

            }
        });
    } else {
        res.redirect("back");
    }
}


middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //check if user is log in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back")
            } else {
                //check if user is the owner of the post
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;