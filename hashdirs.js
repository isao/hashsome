var fs = require('fs'),
    path = require('path'),
    hashdir = require('./hashdir');


function namer(modulePath, hash) {
    return modulePath + '@' + hash.slice(0, 6);
}

function namefilter(item) {
    return /^[\w\-]+$/.test(item);
}

function prefix(left) {
    return function(right) { return left + right; };
}

function hashdirs(dirs, opts, cb) {
    var count = dirs.length,
        results = {};

    function isDone(err) {
        if (!--count) {
            cb(err, err ? null : results);
        }
    }

    function afterHash(err, result) {
        var moddir = result.dir,
            modname = path.basename(moddir),
            newdir = namer(result.dir, result.hash);

        // save
        results[modname] = newdir;

        if (opts.exec) {
            console.log('module path old %s, new %s', moddir, newdir);
            opts.exec(moddir, newdir, isDone);
        } else {
            isDone(err);
        }
    }

    dirs.forEach(function (dir) {
        hashdir(dir, options, afterHash);
    });
}

function shifter(buildDir, options, callback) {
    if (!callback) {
        callback = options;
        options = {};
    }

    if (!options.namer) {
        options.namer = namer;
    }

    if (!options.hasOwnProperty('exec')) {
        options.exec = fs.rename;
    }

    fs.readdir(buildDir, function (err, items) {
        var dirs;
        if (err) {
            callback(err);
        } else {
            dirs = items.filter(namefilter).map(prefix(buildDir + path.sep));
            hashdirs(dirs, options, callback);
        }
    });
}

module.exports = hashdirs;
module.exports.shifter = shifter;

//shifter(__dirname + '/tests/fixtures/demo', console.log);
