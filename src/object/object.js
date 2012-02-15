void function () {
	var object = {
		alloc: function () {
			return Object.create(this, {
				_parent: {
					value: null, writable: true
				},
				parent: {
					get: function () {
						return this._parent
					}, set: function (parent) {
						var old = this._parent
						
						this._parent = parent
						
						if (parent) {
							this.dispatchEvent({ sender: this, type: 'parent-set', newParent: parent, oldParent: old })
						} else {
							this.dispatchEvent({ sender: this, type: 'parent-unset', oldParent: old })
						}
						
						return parent
					}, enumerable: true
				},
				listeners: {
					value: {}
				}
			})
		},
		
		init: function (parent) {
			this._parent = parent
			
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
