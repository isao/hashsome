YUI.add('demo-templates-index', function (Y, NAME){
   var fn = Y.Template.Handlebars.revive(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"utf-8\" />\n\n    <title>locator usage of `express-yui`</title>\n\n</head>\n<body>\n\n    <h1>header goes here for!</h1>\n\n    <p>Tagline: ";
  if (stack1 = helpers.tagline) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tagline; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "<p>\n\n    <div id=\"child\">";
  if (stack1 = helpers.outlet) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.outlet; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n\n    <div id=\"content\">\n        Loading...\n    </div>\n\n    <script>";
  if (stack1 = helpers.state) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.state; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</script>\n    <script>\n    app.yui.use('alerts-model', 'binder-index', function (Y) {\n        // creating a model based on `alerts-model` module\n        var model = new Y.Model.Alerts({\n            tagline: 'testing some data thru alerts-model',\n            tellme: 'NY is nice too, during summer!'\n        });\n        // using a binder to render a template and with the data from model\n        Y.Binders.index.update(Y.one('#content'), model.toJSON());\n    });\n    </script>\n</body>\n</html>\n";
  return buffer;
  }),
       cache = Y.Template._cache = Y.Template._cache || {},
       partials = {};

   Y.Array.each([], function (name) {
       if (cache["demo/" + name]) {
           partials[name] = cache["demo/" + name];
       }
   });

   cache["demo/index"] = function (data) {
       return fn(data, {
           partials: partials
       });
   };
}, '@VERSION@', {"requires": ["handlebars-base"]});
