var exec = require('child_process').exec;
var parseurl = require('url');

var pipe = false;
var map = false;
var DEFAULT_PATH = '/omx';

function omx(mapper) {
    map = mapper;
    return omx.express;
}

omx.express = function(req,res,next) {
    if (req.path.indexOf(DEFAULT_PATH) === 0) {
        //replace + and decode
        path = decodeURIComponent(req.path.replace(/\+/g, ' '));
        //remove leading and trailing /
        path = path.replace(/^\/|\/$/g,'');
        //split and remove leading path
        var parts = path.split('/');
        parts.shift();
        var command = parts.shift();
        console.log('executing',command,parts);
        if (omx[command]) {
            if (command === 'start') {
                omx.start(parts.join('/')+'?'+parseurl.parse(req.url).query);
            } else {
                omx[command].apply(this,parts);
            }
            //prevent anything else from being served from this subpath
            res.end('executed '+command);
            return;
        }
    }
    next();
};

omx.start = function(fn) {
    if (!pipe) {
        pipe = 'omxcontrol';
        exec('mkfifo '+pipe);
    } else {
        console.log("Pipe already exists! Restarting...");
        omx.stop(function () {
            return omx.start(fn);
        });
    }
    if (map) {
        map(fn,cb);
    } else {
        cb(fn);
    }

    function cb(fn) {
        console.log(fn);
        exec('omxplayer.bin -ro hdmi "'+fn+'" < '+pipe, function(error, stdout, stderr) {
            console.log(stdout);
        });
        exec('echo . > '+pipe);
    }
};

omx.info = function(fn, callback) {
    console.log("info tab");
    exec('omxplayer.bin -i "'+fn+'"', function(error, stderr, stdout) {
        callback(null, stdout);
    });
}

omx.stop = function(cb) {
    if (!pipe) {
        cb();
        return;
    }
    console.log('killing omxplayer..');
    wasKilled = true;
    exec('rm '+pipe, function () {
        pipe = false;
        exec('killall omxplayer.bin', cb);
        exec('fbset -depth 8 && fbset -depth 16');      
    });
};


omx.sendKey = function(key) {
    if (!pipe) return;
    exec('echo -n '+key+' > '+pipe);
};

omx.mapKey = function(command,key,then) {
    omx[command] = function() {
        omx.sendKey(key);
        if (then) {
            then();
        }
    };
};

omx.mapKey('pause','p');
omx.mapKey('quit','q',function() {
    exec('rm '+pipe);
    pipe = false;
});
omx.mapKey('play','.');
omx.mapKey('forward',"\x5b\x43");
omx.mapKey('backward',"\x5b\x44");
omx.mapKey('volume_up', '+');
omx.mapKey('volume_down', '-');

module.exports = omx;
