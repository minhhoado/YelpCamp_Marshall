let express = require("express");
let app =express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

let campgrounds = [
    {name:"Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Mountain Goat's Rest ", image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Mountain Goat's Rest ", image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"},
    {name:"Mountain Goat's Rest ", image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c7d2c7ad7914dc65f_340.jpg"}
];

app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds",function(req,res){
   
    res.render("campgrounds",{campgrounds: campgrounds});
})

app.post("/campgrounds",function(req,res){
    //get data from form and add to campgrounds array
   let name = req.body.name;
   let image = req.body.image;
   let newCampground = {name: name, image: image};
   campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new",function(req,res){
    res.render("new");
})

app.listen(3000,function(){
    console.log("YelpCamp Sever has started");
})