var express = require('express');
var path = require('path');
var app = express();

/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/
//app.use(express.static(__dirname + '/public'));
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);

var data={count:0};
app.get('/', function(req, res) {
  data.count++;
  console.log("data.count : " + data.count);
  //console.log(req);
  //console.log(res);
  res.render('my_first_ejs', data);
});

app.get('/reset', function(req, res) {
  data.count=0;
  console.log("data.count : " + data.count);
  res.render('my_first_ejs', data);
});

app.get('/set/count', function(req, res){
  if(req.query.count) data.count=req.query.count;
  console.log("data.count : " + data.count);
  res.render('my_first_ejs', data);
});

app.get('/set/:num', function(req, res) {
  data.count=req.params.num;
  console.log("data.count : " + data.count);
  res.render('my_first_ejs', data);
});

app.listen(3000, function(){
  console.log('Server On!');
});
