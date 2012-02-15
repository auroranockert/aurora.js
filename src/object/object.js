void function () {
	var object = {
		alloc: function () {
			return Object.create(this, {
				listeners: { value: {} }
			})
		},
		
		init: function () {
			return this
		},
			
		addEventListener: function (type, listener) {
			var typeListeners = this.listeners[type]
				
			if (!typeListeners) {
				typeListeners = this.listeners[type] = {}
			}
				
			typeListeners[listener] = listener
				
			return this
		},
			
		removeEventListener: function (type, listener) {
			var typeListeners = this.listeners[type]
				
			if (typeListeners) {
				delete typeListeners[listener]
			}
				
			return this
		},
			
		dispatchEvent: function (event) {
			var type = event.type
			
			var typeListeners = this.listeners[type]
			
			for (var key in typeListeners) {
				typeListeners[key](event)
			}
			
			return this
		}
	}
	
	Object.seal(object)
	
	Aurora.object = object
}()
