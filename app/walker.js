fs = require('fs'),
path = require('path');

function readDir(start, callback) {
    // Use lstat to resolve symlink if we are passed a symlink
    fs.lstat(start, function(err, stat) {
        if(err) {
            return callback(err);
        }
        var found = {names: [], dirs: [], files: []},
            total = 0,
            processed = 0;
        function isDir(abspath) {
            fs.stat(abspath, function(err, stat) {
                if(stat.isDirectory()) {
                    // If we found a directory, recurse!
                    readDir(abspath, function(err, data) {
                        found.dirs[processed] = abspath;
                        found.files[processed] = data.files;
                        found.names[processed] = found.dirs[processed].replace(/^.*?\/(?:([^\/]+)(?:\/Season (\d+))?)$/, "$1");
                        
                        if(++processed == total) {
                            callback(null, found);
                        }
                    });
                } else {
                    found.files[processed] = abspath;
                    if(++processed == total) {
                        callback(null, found);
                    }
                }
            });
        }
        // Read through all the files in this directory
        if(stat.isDirectory()) {
            fs.readdir(start, function (err, files) {
                total = files.length;
                if(total == 0)
                {
                    callback(null, found);
                } else {
                    for(var x = 0, l = files.length; x < l; x++) {
                        isDir(path.join(start, files[x]));
                    }
                }
            });
        } else {
            return callback(new Error("path: " + start + " is not a directory"));
        }
    });
};

exports.readDir = readDir;
