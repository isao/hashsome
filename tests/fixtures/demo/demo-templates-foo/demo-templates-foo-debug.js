YUI.add('demo-templates-foo', function (Y, NAME){
   var fn = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='<p>Micro template body content: '+
$e($v( data.tellme ))+
'<p>';
return $t;
}),
       cache = Y.Template._cache = Y.Template._cache || {};
   cache["demo/foo"] = function (data) {
       return fn(data);
   };
}, '@VERSION@', {"requires": ["template-micro"]});
