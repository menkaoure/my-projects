var express = require('express');
var port = 4000;
var app = express();

app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.render('index.ejs');
})
.get('/todo', function(req, res) {
	var tasksList = ['task0', 'task1', 'task2'];

	res.render('todolist.ejs', {title: 'Todo List', tasks: tasksList});
})
.use(function(req, res, next) {
	res.setHeader('Content-Type', 'text/plain');
	res.send(404, 'Page introuvable');
});

app.listen(port, function() {
	console.log('Server start and listening on port ' + port + ' ...');
});