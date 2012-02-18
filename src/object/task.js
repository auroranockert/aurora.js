void function () {
	var task = Object.create(Aurora.object)
	
	task.states = {
		started: 'started',
		stopped: 'stopped'
	}
	
	task.create = function (callback, async) {
		var result = this.prototype.create.call(this)
		
		Object.defineProperties(result, {
			state: { value: this.states.stopped, writable: true, enumerable: true },
			callback: { value: callback, writable: true, enumerable: true },
			async: { value: async, enumerable: true }
		})
		
		return result
	}
		
	task.start = function () {
		if (this.hidden.state !== this.states.started) {
			this.hidden.f = function () {
				this.callback()
				
				if (!this.async && this.hidden.state === this.states.started) {
					this.hidden.timeout = global.setTimeout(this.hidden.f, 0)
				}
			}.bind(this)
		}
		
		this.hidden.state = this.states.started
		
		this.continue()
	}
	
	task.continue = function () {
		if (this.hidden.state === this.states.started) {
			this.hidden.timeout = global.setTimeout(this.hidden.f, 0)
		}
	}
	
	task.stop = function () {
		if (this.hidden.state === this.states.started) {
			global.clearTimeout(this.hidden.timeout)
		}
		
		this.hidden.state = this.states.stopped
	}
	
	Object.seal(task)
	
	Aurora.task = task
}()
