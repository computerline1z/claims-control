
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
# App.claimsStart=()->
	# oDATA.execWhenLoaded(["tblClaims"], ()->
		# App.claimsController.set("content",oDATA.GET("tblClaims").emData)	
	# )
App.TabClaimsRegulationView = Ember.View.extend(App.HidePreviousWindow,
	previuosWindow: '#divClaimsList'
	thisWindow: '#divClaimRegulation'
	init: -> 
		@_super()
		#$('#tabClaims').removeClass("colmask")
	templateName: 'tmpClaimRegulation'
	didInsertElement: ()->
		@_super(); 	
	contentBinding: 'App.claimsRegulationController.content'
)
App.claimsRegulationController = Em.ArrayController.create(
	content:[]
	goBack:->
		$('#divClaimRegulation').empty().hide().parent().spinner({ position: 'center', img: 'spinnerBig.gif' });
		$('#divClaimsList').show();
		$("body").find("img.spinner").remove();
)