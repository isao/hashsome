var fs = require('fs'),
    path = require('path'),
    hashdir = require('./hashdir');


function namer(modulePath, hash) {
    return modulePath + '@' + hash.slice(0, 6); // new module directory name
}

function namefilter(item) {
    return (/^[\w\-]+$/).test(item); // match YUI module directory names
}

function prefix(left) {
    return function(right) { return left + right; };
}


/**
 * Call hashdir.js for each directory path in an array.
 * @param {array} dirs Array of pathnames to call hashdir on
 * @param {object} options Options for hashdir.js
 * @param {function} callback Callback
 * @see ./hashdir.js
 */
function hashdirs(dirs, options, callback) {
    var count = dirs.length,
        results = {};

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

    function isDone(err) {
        if (!--count) {
            callback(err, err ? null : results);
        }
    }

    function afterHash(err, result) {
        var moddir = result.dir,
            modname = path.basename(moddir),
            newdir = namer(result.dir, result.hash);

        // save
        results[modname] = newdir;

        // rename
        if (!err && options.exec) {
            options.exec(moddir, newdir, isDone);
        } else {
            isDone(err);
        }
    }

    dirs.forEach(function (dir) {
        hashdir(dir, options, afterHash);
    });
}

/**
 * Call hashdir.js for each item in a shifter build directory (filtering
 * out item names not matched by namefilter()).
 * @param {string} buildDir Pathname of Shifter build directory
 * @param {object} options Options for hashdir.js
 * @param {function} callback Callback
 * @see ./hashdir.js
 */
function buildDir(blddir, options, callback) {
    if (!callback) {
        callback = options;
        options = {};
    }

    fs.readdir(blddir, function (err, items) {
        var dirs;
        if (err) {
            callback(err);
        } else {
            dirs = items.filter(namefilter).map(prefix(blddir + path.sep));
            hashdirs(dirs, options, callback);
        }
    });
}

module.exports = hashdirs;
module.exports.buildDir = buildDir;

