var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// connect database
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});
db.on("error", function(err) {
  console.log("DB ERROR : ", err);
});

// model setting
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});
var Post = mongoose.model('post', postSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// set routes
app.get('/posts', function(req, res) {
  Post.find({}).sort('-createdAt').exec(function(err, posts) {
    if(err) return res.json({sucess:false, message:err});
    res.render("posts/index", {data:posts});
  });
});
app.get('/posts/new', function(req, res) {
  res.render("posts/new");
});
app.post('/posts', function(req, res) {
  console.log(req.body);
  Post.create(req.body.post, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
});
app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", {data:post});
  });
});
app.get('/posts/:id/edit', function(req, res){
  Post.findById(req.params.id, function(err, post) {
    if(err) return res.json({sucess:false, message:err});
    res.render("posts/edit", {data:post});
  });
}); // edit
app.put('/posts/:id', function(req, res) {
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post) {
    if(err) return req.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});
  });
});
app.delete('/posts/:id', function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
});

// start server
app.listen(3000, function(){
  console.log('Server On!');
});
