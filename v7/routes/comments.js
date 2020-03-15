let express     =   require("express");
let router      =   express.Router({mergeParams:true});
let Campground  =   require("../models/campground");
let Comment     =   require("../models/comment");


//COMMENTS NEW
router.get("/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
    
});

//COMMENT CREATE
router.post("/", isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
             //create new comment
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    console.log(err);
                }else{
                     //add username and id to comment
                     //save comment
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;