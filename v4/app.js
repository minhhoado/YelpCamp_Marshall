let express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose"),
    Campground  =   require("./models/campground"),
    Comment     =   require("./models/comment"),
    seedDB      =   require("./seeds");



mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true }); 
seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");



app.get("/",function(req,res){
    res.render("landing");
})

//INDEX - show all campgrounds
app.get("/campgrounds",function(req,res){
   Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })
})


//CREATE - add new campground to the DB
app.post("/campgrounds",function(req,res){
    //get data from form and add to campgrounds array
   let name = req.body.name;
   let image = req.body.image;
   let description = req.body.description;
   let newCampground = {name: name, image: image, description: description};
   
   //Create a new campground and save to DB
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
             //redirect back to campgrounds page
            res.redirect("/campgrounds");
       }
   });
})

//NEW - show form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render show template with that campground
            console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
});

//=================
//COMMENTS ROUTES
//=================
app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
    
});

app.post("/campgrounds/:id/comments",function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground show page
})

app.listen(3000,function(){
    console.log("YelpCamp Sever has started");
})