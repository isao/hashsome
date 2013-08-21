// given a directory path, and some pathname matching patterns, calculate a
// checksum for all matched files (actually, a checksum of the checksums of
// every matched file).

var fs = require('fs'),
    crypto = require('crypto'),
    Scanfs = require('scanfs'),
    hashfile = require('./hashfile');


function match(str) {
    return function(re) { return str.match(re); };
}

function metahash(algo, checksums) {
    var hash = crypto.createHash(algo),
        files = Object.keys(checksums);
    
    // hash all the hashes
    files.forEach(function (file) {
        hash.update(checksums[file]);
    });

    // if there were no checksums, return 0 instead of the hash of nothing. For
    // example, the md5 of nothing hashes to 'd41d8cd98f00b204e9800998ecf8427e'.
    return files.length && hash.digest('hex');
}

function hashdir(dir, opts, cb) {
    var scan = new Scanfs(opts.ignore),
        results = {
            dir: dir,
            checksum: null, // the hash of hashes of matched files
            checksums: {},  // file pathname => it's hash
            invalid: {}     // pathname associated with an error => error code
        },
        count = 1; // track pending async operations; is 0 when scan (after the
                   // 'done' event) and any hashfile operations are done.

    function isDone() {
        if (!--count) {
            results.checksum = metahash(opts.algo, results.checksums);
            cb(null, results);
        }
    }

    function afterHash(err, pathname, hash) {
        if (err) {
            onErr(err);
        } else {
            results.checksums[pathname] = hash;
        }
        isDone();
    }

    function onErr(err) {
        results.invalid[err.path] = err.code;
    }

    function onFile(err, pathname) {
        if (opts.select.some(match(pathname))) {
            count++;
            hashfile(pathname, opts.algo, afterHash);
        }
    }

    scan.on('file', onFile);
    scan.on('error', onErr);
    scan.on('done', isDone);
    scan.relatively(dir);
}

/**
 * Handle optional options and their defaults before calling hashdir()
 * @param {string} dir Full path of directory to checksum
 * @param {object} [options]
 * @param {function} callback(err, results)
 */
function main(dir, options, callback) {
    var defaults = {
            algo: 'md5',
            select: [/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/],
            ignore: []
        };

    if (!callback) {
        callback = options;
        options = {};
    }

    Object.keys(defaults).forEach(function (key) {
        if (!options.hasOwnProperty(key)) {
            options[key] = defaults[key];
        }
    });

    hashdir(dir, options, callback);
}

module.exports = main;
