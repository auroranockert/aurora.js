"use strict";

<%= file 'failbacks/jDataView/src/jdataview.js' %>

<%= file 'LICENSE' %>

void function (global) {
	var Aurora = {}
	
	Aurora.flow = {
		ok: 'ok',
		error: 'error'
	}
	
	Aurora.errors = {
		success: 'success'
	}
	
	Aurora.utilitites = { }
	
	global.Aurora = Aurora
	
	if (!global.DataView) {
		global.DataView = global.jDataView
	}
	
	<%= file 'object/object.js' %>
}(this)