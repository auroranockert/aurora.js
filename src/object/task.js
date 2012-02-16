void function () {
	Aurora.task = Object.create(Aurora.object)
	
	Aurora.task.states = {
		started: 'started',
		stopped: 'stopped'
	}
	
	Aurora.task.create = function (callback) {
		var result = Object.getPrototypeOf(this).create.call(this)
		
		Object.defineProperties(result, {
			state: { value: this.states.stopped, writable: true, enumerable: true },
			callback: { value: callback, writable: true, enumerable: true }
		})
		
		return result
	}
		
	Aurora.task.start = function () {
		if (this.hidden.state !== this.states.started) {
			var self = this
			
			this.hidden.f = function () {
				self.callback()
				
				if (self.hidden.state === self.states.started) {
					self.hidden.timeout = global.setTimeout(self.hidden.f, 0)
				}
			}
			
			this.hidden.state = this.states.started
				
			this.hidden.f()
		}
	}
		
	Aurora.task.stop = function () {
		if (this.hidden.state !== this.states.stopped) {
			global.clearTimeout(this.hidden.timeout)
		}
	}
}()
