let express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose");

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//SCHEMA SETUP

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

let Campground = mongoose.model("Campground",campgroundSchema);

app.get("/",function(req,res){
    res.render("landing");
})

//INDEX - show all campgrounds
app.get("/campgrounds",function(req,res){
   Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campgrounds:allCampgrounds});
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
    res.render("new");
})

//SHOW - shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    //find the campground with the provided ID
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render show template with that campground
            res.render("show",{campground: foundCampground});
        }
    })
})

app.listen(3000,function(){
    console.log("YelpCamp Sever has started");
})