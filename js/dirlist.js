var walk    = require('walk');
var files   = [];

// Walker options
var walker  = walk.walk('./movie', { followLinks: false });

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    files.push(root + '/' + stat.name);
    next();
});

walker.on('end', function() {
	var jsonString = JSON.stringify(files);
	var parsed = JSON.parse(jsonString);
    console.log(parsed);
});