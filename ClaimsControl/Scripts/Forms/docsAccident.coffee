
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.docsAccident=(p)-> #({accidentForm, docsForm, uploadForm})
	#outerHeight() innerHeight()
	#$(window).height();	 // returns height of browser viewport
	#$(document).height(); // returns height of HTML document
	#LeftHeight=$(window).height()-$("#divlogindisplay").outerHeight()-$("#ulMainMenu").outerHeight()-$("#tabLists h3:first").outerHeight()
	#LeftHeight-=($("#tabLists h3:first").outerHeight()+$("#topNewDrivers").outerHeight())*3
	#totalRows=Math.floor(LeftHeight/31)
	frmObj=p.accidentForm.data("ctrl"); isNew=if frmObj.NewRec==1 then true else false	
	accidentID=(if isNew then null else frmObj.id)
	driver=$("#lstDrivers"); driverID=(if isNew then null else driver.data("ctrl").Value); driverTitle="Vairuotojo '"+driver.val()+"' dokumentai";
	vehicles = if isNew then null else frmObj.vehicles
	settings=
		accident:{iD:accidentID,title:"Įvykio dokumentai"} #accident:{iD:24,title:"Įvykio dokumentai"}
		driver:{iD:driverID,title:driverTitle},#driver:{iD:87,title:"Vairuotojo Albinas Palubinskas dokumentai"},
		vehicles:vehicles #vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]
	
	oDATA.execWhenLoaded(["tmpDocsTree"], ()-> p.uploadForm.UploadFiles(#tmpUploadForm - iš Main controllerio paskutinis
		categoryOpts:settings
	); 
	App.startTree(settings)
	)	


# MY.tabLists={}
#`//@ sourceURL= /Forms/tabLists.js`