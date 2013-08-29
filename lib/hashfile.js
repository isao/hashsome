/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var fs = require('fs'),
    crypto = require('crypto');

/**
 * get a checksum/hash of the contents of a file
 * @param {string} file Full path to a readable file
 * @param {string} algo A hashing algorithms, must match one of the array
 * elements as returned by crypto.getHashes();
 * @param {function} callback
 * @example
 *      hashfile(__filename, 'md5', console.log);
 *      // null '/path/to/hashfile.js' '02934b97a9ed5639f5f6d733e698065e'
 */
function hashfile(pathname, algo, callback) {
    var hash = crypto.createHash(algo),
        stream = fs.createReadStream(pathname);

    stream.on('error', callback);

    stream.on('data', function ondata(buf) {
        hash.update(buf);
    });

    stream.on('end', function onend() {
        callback(null, pathname, hash.digest('hex'));
    });
}

module.exports = hashfile;
