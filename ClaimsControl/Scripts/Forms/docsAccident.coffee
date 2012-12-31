
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;`
App.docsAccident=(p)-> #({accidentForm, docsForm, uploadForm})
	frmObj=p.accidentForm.data("ctrl"); isNew=if frmObj.NewRec==1 then true else false	
	accidentID=(if isNew then null else frmObj.id)
	driver=$("#lstDrivers"); driverID=(if isNew then null else driver.data("ctrl").Value); driverTitle="Vairuotojo '"+driver.val()+"' dokumentai";
	vehicles = if isNew then null else frmObj.vehicles
	settings=categoryOpts:
		accident:{iD:accidentID,title:"Įvykio dokumentai"} #accident:{iD:24,title:"Įvykio dokumentai"}
		driver:{iD:driverID,title:driverTitle},#driver:{iD:87,title:"Vairuotojo Albinas Palubinskas dokumentai"},
		vehicles:vehicles #vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]
	
	# oDATA.execWhenLoaded(["tmpDocsTree"], ()-> 
		# p.uploadForm.UploadFiles(#tmpUploadForm - iš Main controllerio paskutinis
		# categoryOpts:settings
	# ); 
	# App.startTree(settings)
	# )	
	oDATA.execWhenLoaded(["tmpUploadForm","tmpDocsTree"], ()-> 
		$('#uploadDocsToAccident').UploadFiles(settings)
		$('#uploadDocsToAccident').next().Tree(categoryOpts:settings.categoryOpts)
	)