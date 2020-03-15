let express         =   require("express"),
    app             =   express(),
    bodyParser      =   require("body-parser"),
    mongoose        =   require("mongoose"),
    passport        =   require("passport"),
    LocalStrategy   =   require("passport-local"),
    Campground      =   require("./models/campground"),
    Comment         =   require("./models/comment"),
    User            =   require("./models/user"),
    seedDB          =   require("./seeds");



mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true }); 


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I need a job",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.get("/",function(req,res){
    res.render("landing");
})

//INDEX - show all campgrounds
app.get("/campgrounds",function(req,res){
   Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
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
            // console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
});

//=================
//COMMENTS ROUTES
//=================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
    
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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
                     //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

//AUTH ROUTES

//show register form
app.get("/register",function(req,res){
    res.render("register");
})

//handle sign up logic
app.post("/register",function(req,res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login",function(req,res){
    res.render("login");
})

//log out route
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/campgrounds");
})


app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
}),function(req, res){

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("YelpCamp Sever has started");
})