# readme

Get a hash (md5, sha, etc.) for files matching a pattern in a directory, or for each of a group of directories.

## hashsome.buildDir(dir, [options], callback)

For a Shifter build directory path, calculate the hash of each YUI module, and rename the module directory accoringly.

Example:

    var hashdirs = require('hashsome')
    hashdirs.buildDir('tests/fixtures/demo', function(err, results) {
        console.log(results);
    });

Build sub-directories (module directories) are renamed on the filesystem (by default, as in this example). Results look like:

    {
        'alerts-model': 'tests/fixtures/demo/alerts-model@569028',
        'binder-index': 'tests/fixtures/demo/binder-index@eba6ac',
        'demo-templates-bar': 'tests/fixtures/demo/demo-templates-bar@e7ce4a',
        'demo-templates-index': 'tests/fixtures/demo/demo-templates-index@145385',
        'demo-templates-foo': 'tests/fixtures/demo/demo-templates-foo@539f25',
        'loader-demo': 'tests/fixtures/demo/loader-demo@c3c4ff',
        'smorgasbord' : 'tests/fixtures/demo/smorgasbord@85be6a'
    }

If the supplied pathnames are relative, the output paths are relative (vis a vis process.cwd()).

Arguments are:

- `dir` string pathname to the build directory, i.e. tests/fixtures/demo
- `options` optional
    - `algo` string - default is 'md5'
    - `select` array of string or regex patterns of module pathnames to hash with `algo` - default is `[/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/]`
    - `ignore` - array of string or regex patterns of module pathnames to ignore - default is `[]`
    - `namer` - function for determining a new module directory pathname. Passed module pathname and hash string - default is `function namer(modulePath, hash) { return modulePath + '@' + hash.slice(0, 6); }`
    - `exec` - function for renaming the module directory - default is `fs.rename`.
- `callback` - function - callback gets two arguments, `err`, `results`.

## hashsome(dirs, [options], callback)

Same as `hashdirs.buildDir` except first argument is an array of module directories. Each array item will get renamed with a hash.

Example:

    var hashsome = require('hashsome');
    hashsome(['tests/fixtures/demo/smorgasbord', 'tests/fixtures/demo/binder-index'], function(err, results) {
        console.log(results);
    });

## hashdir(dir, options, callback)

Get the hash of some files in `dir`. No side-effects, used by `hashdirs`.

Arguments are:

- `dir` string pathname to the build directory, i.e. tests/fixtures/demo
- `options` optional
    - `algo` string - default is 'md5'
    - `select` array of string or regex patterns of module pathnames to hash with `algo` - default is `[/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/]`
    - `ignore` - array of string or regex patterns of module pathnames to ignore - default is `[]`
- `callback` - function - callback gets two arguments, `err`, `results`.

Example:

    var hashdir = require('hashsome/hashdir');
    hashdir('tests/fixtures/smorgasbord', function(err, results) {
        console.log(results);
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
