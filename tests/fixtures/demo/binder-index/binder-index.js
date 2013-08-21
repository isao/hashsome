YUI.add('binder-index', function (Y) {

    "use strict";

    Y.Binders = {
        index: {
            update: function (node, data) {
                var fooContent = Y.Template._cache['demo/foo'](data);
                node.setContent(fooContent);
            }
        }
    };

}, '@VERSION@', {"requires": ["node", "demo-templates-foo"], "affinity": "client"});
