<%= file 'failbacks/jDataView/src/jdataview.js' %>

<%= file 'LICENSE' %>

void function (global) {
	"use strict";
	
	var Aurora = {}
	
	Aurora.flow = {
		ok: 'ok',
		error: 'error'
	}
	
	Aurora.status = {
		success: 'success'
	}
	
	Aurora.utilitites = { }
	
	Aurora.sources = { }
	
	global.Aurora = Aurora
	
	if (!global.DataView) {
		global.DataView = global.jDataView
	}
	
	<%= file 'object/object.js' %>
	
	<%= file 'object/task.js' %>
	<%= file 'object/channel.js' %>
}(this || global)