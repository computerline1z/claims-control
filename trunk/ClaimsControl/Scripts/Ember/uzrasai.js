
//----------------
http://cloud.github.com/downloads/wycats/handlebars.js/handlebars-1.0.0.beta.6.js

http://cloud.github.com/downloads/emberjs/ember.js/ember-1.0.pre.js

http://cloud.github.com/downloads/emberjs/ember.js/ember-1.0.pre.min.js

//----------------
//Veikia vienas:
http://cloud.github.com/downloads/emberjs/ember.js/ember-0.9.8.1.js

http://cloud.github.com/downloads/emberjs/ember.js/ember-0.9.8.1.min.js

VIEW CONTEXT CHANGES

In apps built on earlier version of Ember, the {{#view}} helper created a new context
for the view. This meant that you had to explicitly set the context on them. In 1.0,    
we've  made this a bit simpler. The {{#view}} helper no longer changes the context, 
instead  maintaining the parent context by default. Alternatively, we will use the 
controller  property if provided. You may also choose to directly override the context 
property. The order is as follows:

Specified controller
Supplied context (usually by Handlebars)
parentView's context (for a child of a ContainerView)
In the event that you do need to directly refer to a property on the view, you can use 
the view keyword, i.e. {{view.myProp}}.


So, for your example, tou have to use {{view.name}}

<script type="text/x-handlebars">
  {{#view App.MyView}}
    <h1>Hello world {{view.name}}!</h1>
  {{/view}}
</script>

//-------------------------------------------------------------------------------------------
/index.html
<!doctype html>
<!--[if lt IE 7 ]> <html lang="en" class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en"> <!--<![endif]-->
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title></title>
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script type="text/x-handlebars">
  {{personName}}
</script>

<script src="js/libs/handlebars-1.0.0.beta.6.js"></script>
<script src="js/libs/ember-1.0.pre.min.js"></script>
<script src="js/app.js"></script>
</body>
</html>
//-------------------------------------------------------------------------------
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="http://cloud.github.com/downloads/wycats/handlebars.js/handlebars-1.0.0.beta.6.js" type="text/javascript" charset="utf-8"></script>
<script src="app.js" type="text/javascript" charset="utf-8"></script>
//-------------------------------------------------------------------------------
Instead of:
  {{action edit context="post"}}
Do:
  {{action edit post}}

If you were relying on the default context, change:
  {{action edit}}

to:
  {{action edit this}}
//-------------------------------------------------------------------------------
    {{#each p in "App.partsController"}}   
      {{p.name}} 
      {{p.foo}}     
      {{name}}
    {{/each}}

	 <br />Other Parts:
    {{#each p in "App.partsController.foo"}}   
      {{p[0]}}     
    {{/each}}

\\bsserver\c$\inetpub\wwwroot\ClaimsControl
C:\Users\Saulius\Documents\Visual Studio 2010\Projects\ClaimsControl\ClaimsControl