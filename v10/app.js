let express         =   require("express"),
    app             =   express(),
    bodyParser      =   require("body-parser"),
    mongoose        =   require("mongoose"),
    passport        =   require("passport"),
    LocalStrategy   =   require("passport-local"),
    methodOverride  =   require("method-override"),
    Campground      =   require("./models/campground"),
    Comment         =   require("./models/comment"),
    User            =   require("./models/user"),
    seedDB          =   require("./seeds");

let campgroundRoutes    =   require("./routes/campgrounds"),
    commentRoutes       =   require("./routes/comments"),
    indexRoutes          =   require("./routes/index");         

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }); 


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
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

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000,function(){
    console.log("YelpCamp Sever has started");
})