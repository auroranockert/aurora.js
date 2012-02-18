void function () {
	var channel = Object.create(Aurora.object)
	
	channel.operation = {
		pass: 'pass',
		drop: 'drop'
	}
	
	channel.create = function () {
		var result = this.prototype.create.call(this)
		
		Object.defineProperties(result, {
			queue: { value: [], enumerable: true },
			handler: { value: null, writable: true, enumerable: true }
		})
		
		return result
	}
	
	channel.postMessage = function (message) {
		var op = this.operation.pass
		
		if (this.handler) {
			op = this.handler(message)
		}
		
		switch (op) {
		case this.operation.pass:
			this.queue.push(message)
			break
		case this.operation.drop:
			break
		}
		
	}
	
	channel.peekMessage = function () {
		return this.queue[0]
	}
	
	channel.readMessage = function () {
		return this.queue.shift()
	}
	
	Object.seal(channel)
	
	Aurora.channel = channel
}()
