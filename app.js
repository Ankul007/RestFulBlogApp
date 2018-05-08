var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    app        = express();
//appconfig
mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//mongoose/model
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{ type: Date, default: Date.now }    
});

var Blog = mongoose.model("Blog", blogSchema);

//routes

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.pexels.com/photos/459688/pexels-photo-459688.jpeg?auto=compress&cs=tinysrgb&h=350",
//     body: "Hello"
// });

app.get("/",function(req, res) {
    res.redirect("/blogs");
    
});
//======================
//      get render new
//======================
app.get("/blogs/new", function (req, res) {
    console.log("new");
    res.render("new");
});

//======================
//      get render show findyID
//======================

app.get("/blogs/:id", function(req, res){
    console.log("id wala");
    Blog.findById(req.params.id, function(err, foundBlog)
{
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundBlog });
        }
});
});

//======================
//      post create render new
//======================


app.post("/blogs", function (req, res) {
   Blog.create(req.body.blog, function (err, newBlog ) {
    if(err)
        res.render("new");    
    else
           res.redirect("/blogs");
   }) 
});


app.get("/blogs", function(req, res)
    {
  
    // res.render("index.ejs");
    console.log("index post");
    Blog.find({}, function(err, blogs)
    {

        
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs});
        }

    });

});

app.get("/blogs/:id/edit", function (req, res) {
    console.log("edit wala");
    Blog.findById(req.params.id, function (err, editing) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", { blog: editing });
        }
    });
});
app.put("/blogs/:id",function(req,res){
    
// Blog.findByIdAndUpdate(id, newData, callback); 
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updated){
        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        } 
    });
});
//DElete route

app.delete("/blogs/:id",function(req, res){
    Blog.findByIdAndRemove(req.params.id, req.body.blog, function (err, updated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs");
        }
        });
});



app.listen(3000, function () {
    console.log("server started");
});
