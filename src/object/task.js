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
			this.hidden.f = function () {
				this.callback()
				
				if (this.hidden.state === this.states.started) {
					this.hidden.timeout = global.setTimeout(this.hidden.f, 0)
				}
			}.bind(this)
			
			this.hidden.timeout = global.setTimeout(this.hidden.f, 0)
		}
		
		this.hidden.state = this.states.started
	}
		
	Aurora.task.stop = function () {
		if (this.hidden.state === this.states.started) {
			global.clearTimeout(this.hidden.timeout)
		}
		
		this.hidden.state = this.states.stopped
		
	}
}()
