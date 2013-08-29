var test = require('tap').test,
    hashsome = require('../hashsome');


test('hashsome.hashbuild demo (shifter created build dir)', function(t) {
    var name = 'hash/rename-all: demo test',
        blddir = 'tests/fixtures/demo',
        options = {exec: false}, // skip the renaming
        expected = {
            'alerts-model': 'tests/fixtures/demo/alerts-model@569028',
            'binder-index': 'tests/fixtures/demo/binder-index@eba6ac',
            'demo-templates-bar': 'tests/fixtures/demo/demo-templates-bar@e7ce4a',
            'demo-templates-index': 'tests/fixtures/demo/demo-templates-index@145385',
            'demo-templates-foo': 'tests/fixtures/demo/demo-templates-foo@539f25',
            'loader-demo': 'tests/fixtures/demo/loader-demo@c3c4ff',
            'smorgasbord' : 'tests/fixtures/demo/smorgasbord@85be6a'
        };

    t.plan(2);
    console.time(name);

    hashsome.hashbuild(blddir, options, function(err, results) {
        console.timeEnd(name);
        t.true(!err);
        t.same(results, expected);
    });
});


test('hashsome.hashdirs smorgasbord (SIDE EFFECTS)', function(t) {
    var name = 'hash/rename-dir-array: [smorgasbord]',
        //options = {exec: false}, // skip the renaming
        expected = {'smorgasbord': 'tests/fixtures/smorgasbord@85be6a'};

    t.plan(2);
    console.time(name);

    hashsome.hashdirs(['tests/fixtures/smorgasbord'], /*options,*/ function(err, results) {
        console.timeEnd(name);
        t.true(!err, 'no errors');
        t.same(results, expected, 'fixtures/smorgasbord -> fixtures/smorgasbord@85be6a (use `npm run clean` to cleanup)');
    });
});


test('readfile error', function(t) {
    t.plan(2);
    hashsome.hashfile('nonesuch', 'sha256', function (err, results) {
    	t.true(err instanceof Error);
    	t.same(err.code, 'ENOENT');
    });
});
