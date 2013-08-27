# readme

Get a hash (md5, sha, etc.) for files matching a pattern in a directory, or for each of a group of directories.

## hashsome(dirs, [options], callback)

Given an array of directory pathnames, get the hash of all files matching a set of patterns in each directory. Each directory can then be renamed with that hash.

Arguments and options are:

- `dirs` array of string pathnames of directories to hash and possibly rename.
- `options` optional object with the following properties
    - `algo` string - default is `"md5"`. For other valid values see `crypto.getHashes()`.
    - `select` array of string or regex patterns of file/pathnames to hash with `algo` - default is `[/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/]`
    - `ignore` - array of string or regex patterns of pathnames to ignore - default is `[]`
    - `namer` - function for determining a new module directory pathname. Return value is the renamed directory path. Parameters are the original directory path and hash string - default is `function namer(pathname, hash) { return pathname + '@' + hash.slice(0, 6); }`
    - `exec` - function for renaming the module directory, function signature is same as `fs.rename` - default is an internal function that deletes the destination directory if it exists before calling `fs.rename`.
- `callback` - function that is called with two arguments, `err`, `results`.

Example:

    var hashdirs = require('hashsome'),
        dirs = [
            'tests/fixtures/demo/smorgasbord',
            'tests/fixtures/demo/binder-index',
            'tests/fixtures/demo/demo-templates-index'
        ];

    hashdirs(dirs, function(err, results) {
        console.log(err || results);
    });

Results look like:

    {
        'binder-index': 'tests/fixtures/demo/binder-index@eba6ac',
        'demo-templates-index': 'tests/fixtures/demo/demo-templates-index@145385',
        'smorgasbord': 'tests/fixtures/demo/smorgasbord@85be6a'
    }

If the supplied pathnames in `dirs` are relative to `process.cwd()`, the output paths are relative too. The order of the results are not the necessarily the same as the input array order.

By default, the directories in `dirs` are renamed with their hash, as described by the callback results. This can be disabled by setting options.exec to `false`.

## hashsome.buildDir(dir, [options], callback)

Same as `hashsome` except first argument is a single (build) directory pathname. Each subdirectory within this build directory (matching `/^[\w\-]+$/`, i.e. a YUI module name) will become an argument to `hashsome` above, and get files within them hashed in the same manner. Each subdirectory can then be renamed with that hash.

Arguments and options are identical to `hashsome` above.

Example:

    var hashBuildDir = require('hashsome').buildDir;

    hashBuildDir('tests/fixtures/demo', function(err, results) {
        console.log(err || results);
    });

Results look like:

    {
        'alerts-model': 'tests/fixtures/demo/alerts-model@569028',
        'binder-index': 'tests/fixtures/demo/binder-index@eba6ac',
        'demo-templates-bar': 'tests/fixtures/demo/demo-templates-bar@e7ce4a',
        'demo-templates-index': 'tests/fixtures/demo/demo-templates-index@145385',
        'demo-templates-foo': 'tests/fixtures/demo/demo-templates-foo@539f25',
        'loader-demo': 'tests/fixtures/demo/loader-demo@c3c4ff',
        'smorgasbord': 'tests/fixtures/demo/smorgasbord@85be6a'
    }

## hashdir(dir, options, callback)

Get the hash of some files in `dir`. Invoking this function does not rename anything.

Arguments are:

- `dir` string pathname to the build directory, i.e. tests/fixtures/demo
- `options` optional object with the following properties
    - `algo` string - default is `"md5"`. For other valid values see `crypto.getHashes()`.
    - `select` array of string or regex patterns of file/pathnames to hash with `algo` - default is `[/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/]`
    - `ignore` - array of string or regex patterns of pathnames to ignore - default is `[]`
- `callback` - function - callback gets two arguments, `err`, `results`.

Example:

    var hashdir = require('hashsome/hashdir');

    hashdir('tests/fixtures/smorgasbord', function(err, results) {
        console.log(err || results);
    });

Results look like:

    {
        dir: 'tests/fixtures/smorgasbord',
        hash: '85be6ad3c99a69ba4d3494015f0cb1ad',
        hashes: {
            'tests/fixtures/smorgasbord/csswithassets-min.css': '03f717b9dc98396f34957a60ce5780c1',
            'tests/fixtures/smorgasbord/yql2-min.js': 'f998e5b0f0b898fce665f5b914c41b76',
            'tests/fixtures/smorgasbord/assets/foo.png': '4e310d255ad7e43553366c280e97917d',
            'tests/fixtures/smorgasbord/assets/img.png': '1909c4d75ebc09dbdeafc5ce238aefc9',
            'tests/fixtures/smorgasbord/lang/calendar-base.js': '5d9769e39fca1c9b5c26e6693171924b',
            'tests/fixtures/smorgasbord/lang/calendar-base_de.js': '6ab41800c890b098d702ffc1bb57ae77',
            'tests/fixtures/smorgasbord/lang/calendar-base_en.js': 'a200bedb2e9b487fb5223eff7a730efd',
            'tests/fixtures/smorgasbord/lang/calendar-base_fr.js': '061634dcaba4c5e76cab7ceb78e94557',
            'tests/fixtures/smorgasbord/lang/calendar-base_ja.js': 'f02c364d57d6b476a212e7225f5b5ca5',
            'tests/fixtures/smorgasbord/lang/calendar-base_nb-NO.js': '6eb6944b47775ad5f7d22c420ba516c5',
            'tests/fixtures/smorgasbord/lang/calendar-base_pt-BR.js': '881020dae7db9875d2db5cc5b1324e55',
            'tests/fixtures/smorgasbord/lang/calendar-base_ru.js': '8667f8bc9bf0e1fdccf7d8b350b4b758',
            'tests/fixtures/smorgasbord/lang/calendar-base_zh-HANT-TW.js': 'b68311a9f6e554ce8c77531f5a5f2e84'
        },
        invalid: {
            'tests/fixtures/smorgasbord/symlink': 'ENOENT'
        }
    }

See `./tests`.
