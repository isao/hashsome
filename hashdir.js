/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

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

    // if there were no checksums, return '' instead of the hash of nothing. For
    // example, the md5 of nothing hashes to 'd41d8cd98f00b204e9800998ecf8427e'.
    return files.length ? hash.digest('hex') : '';
}

function hashdir(dir, opts, cb) {
    var scan = new Scanfs(opts.ignore),
        result = {
            dir: dir,
            hash: null, // the hash of hashes of matched files
            hashes: {}, // file pathname => it's hash
            invalid: {} // pathname associated with an error => error code
        },
        count = 1; // track pending async operations; is 0 when scan (after the
                   // 'done' event) and any hashfile operations are done.

    function isDone() {
        if (!--count) {
            result.hash = metahash(opts.algo, result.hashes);
            cb(null, result);
        }
    }

    function afterHash(err, pathname, hash) {
        if (err) {
            onErr(err);
        } else {
            result.hashes[pathname] = hash;
        }
        isDone();
    }

    function onErr(err) {
        result.invalid[err.path] = err.code;
    }

    function onFile(err, pathname, stat) {
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
 * Call hashdir() after normalizing the defaults. There are no side-effects.
 * Calculates the hash for each file in a directory that matches some patterns,
 * and also determines the hash of these hashes.
 * @param {string} dir Full path of directory to hash
 * @param {object} [options]
 *   @param {string} [options.algo = 'md5']
 *   @param {array} [options.select = [/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/]]
 *   @param {string} [options.ignore = []]
 * @param {function} callback(err, result)
 *   @param {error} err
 *   @param {object} result
 *     @param {string} result.dir
 *     @param {string} result.hash hash or '' if nothing was hashed
 *     @param {object} result.hashes pathname => hash
 *     @param {object} result.invalid pathname => error code
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
