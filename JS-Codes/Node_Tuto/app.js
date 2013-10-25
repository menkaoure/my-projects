var express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.end('Vous etes a l\'acceuil ');
})
.get('/todo', function(req, res) {
	var tasksList = ['task0', 'task1', 'task2'];

	res.render('todolist.ejs', {title: 'Todo List', tasks: tasksList});
})
.use(function(req, res, next) {
	res.setHeader('Content-Type', 'text/plain');
	res.send(404, 'Page introuvable');
});

app.listen(4000);