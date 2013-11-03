var http = require('http');
var url = require('url');
var querystring = require('querystring');
var mod0 = require('./mod0');

var server = http.createServer(function(req, res) {
	var page = url.parse(req.url).pathname,
		query = url.parse(req.url).query,
		params = querystring.parse(query);

	console.log(mod0.direBonjour());	
	console.log('Page demandée ' + page + '\n');
	console.log('Parametres : ' + params['prenom'] + ' ' + params['nom']);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<!doctype html>' +
		'<html>' +
		'	<head>' +
		'		<meta charset="utf-8" />' +
		'		<title> Ma page Node.js </title>' +
		'	</head>'+
		'	<body>' +
		'		<p> Voici un paragraphe <strong>HTML</strong> !</p>' +
		'	</body>' +
		'</html>'
	);
	res.end();
});
server.listen(8080);
