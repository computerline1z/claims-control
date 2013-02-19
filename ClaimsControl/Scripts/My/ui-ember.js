// Put jQuery UI inside its own namespace
//JQ = {};
// Namespaces in Ember should be created with Ember.Namespace.create()
JQ = Ember.Namespace.create();

// Create a new mixin for jQuery UI widgets using the Ember
// mixin syntax.
JQ.Widget = Ember.Mixin.create({
	// When Ember creates the view's DOM element, it will call this
	// method.
	didInsertElement: function () {
		// Make jQuery UI options available as Ember properties
		var options = this._gatherOptions();

		// Make sure that jQuery UI events trigger methods on this view.
		this._gatherEvents(options);

		// Create a new instance of the jQuery UI widget based on its `uiType`
		// and the current element.
		var ui = jQuery.ui[this.get('uiType')](options, this.get('element'));

		// Save off the instance of the jQuery UI widget as the `ui` property
		// on this Ember view.
		this.set('ui', ui);
	},

	// When Ember tears down the view's DOM element, it will call
	// this method.
	willDestroyElement: function () {
		var ui = this.get('ui');

		if (ui) {
			// Tear down any observers that were created to make jQuery UI
			// options available as Ember properties.
			var observers = this._observers;
			for (var prop in observers) {
				if (observers.hasOwnProperty(prop)) {
					this.removeObserver(prop, observers[prop]);
				}
			}
			ui._destroy();
		}
	},

	// Each jQuery UI widget has a series of options that can be configured.
	// For instance, to disable a button, you call
	// `button.options('disabled', true)` in jQuery UI. To make this compatible
	// with Ember bindings, any time the Ember property for a
	// given jQuery UI option changes, we update the jQuery UI widget.
	_gatherOptions: function () {
		var uiOptions = this.get('uiOptions'),
				options = {};

		// The view can specify a list of jQuery UI options that should be treated
		// as Ember properties.
		uiOptions.forEach(function (key) {
			options[key] = this.get(key);

			// Set up an observer on the Ember property. When it changes,
			// call jQuery UI's `setOption` method to reflect the property onto
			// the jQuery UI widget.
			var observer = function () {
				var value = this.get(key);
				this.get('ui')._setOption(key, value);
			};

			this.addObserver(key, observer);

			// Insert the observer in a Hash so we can remove it later.
			this._observers = this._observers || {};
			this._observers[key] = observer;
		}, this);

		return options;
	},

	// Each jQuery UI widget has a number of custom events that they can
	// trigger. For instance, the progressbar widget triggers a `complete`
	// event when the progress bar finishes. Make these events behave like
	// normal Ember events. For instance, a subclass of JQ.ProgressBar
	// could implement the `complete` method to be notified when the jQuery
	// UI widget triggered the event.
	_gatherEvents: function (options) {
		var uiEvents = this.get('uiEvents') || [],
				self = this;

		uiEvents.forEach(function (event) {
			var callback = self[event];

			if (callback) {
				// You can register a handler for a jQuery UI event by passing
				// it in along with the creation options. Update the options hash
				// to include any event callbacks.
				options[event] = function (event, ui) {
					callback.call(self, event, ui);
				};
			}
		});
	}
});
JQ.Dialog = Ember.View.extend(JQ.Widget, {
	//dialogo originalumui palaikyti sukuriam id kuris naudojamas ir kaip id ir MY[id]:
	//dialogID="dialog"+(+new Date)#kad nesipjautų dialogai
	//MY[dialogID]=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js	
		//dialogID: dialogID
	init: function() {
		this._super(); if (this.dialogID) {this.elementId=this.dialogID}//dialogID reikalingas kad nesipjautų ir naudojamas tiek su MY tiek elementId
	},
	elementId: 'openItemDialog',
	uiType: 'dialog',
	didInsertElement: function() {
		this._super(); 
		if (this.pars){
			if (this.pars.input){
				//console.log($(this.input).offset().top);
				t=this.pars.input.offset().top-200+"px"
				this.$().parent().css("top",t);
			}
		}// else{this.$().parent().css("top","10%");}	
	},
	//uiOptions: 'autoOpen height width close title buttons'.w(), //attributes have to be declared there
	uiOptions: 'autoOpen width close title resizable modal position buttons'.w(), //attributes have to be declared there
	autoOpen: true, width: 400, resizable: false, modal:true, position: 'top',
	close: function () {
		//this.get('ui').dialog('destroy'); // has no method getS
		$(this).dialog('destroy');
		$(this).remove(); var id=$(this).attr("id")
		var removeDialog =(id!== 'openItemDialog') ?MY[id]:MY.dialog;
		if (removeDialog){
			if(removeDialog.removeOnCloseView){removeDialog.removeOnCloseView.remove();}
			removeDialog.remove();
		}
	},			
	open: function () {
		//this.get('ui').dialog('open'); //Object [object Object] has no method 'dialog' 
		$(this).dialog('open'); // the same //this.get('ui').open();	
	}
});