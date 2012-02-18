TaskTest = AsyncTestCase("Task Test");

TaskTest.prototype.testCreate = function () {
	var task = Aurora.task.create()
	
	assertEquals(Aurora.task, task.prototype)
	assertEquals(Aurora.object, task.prototype.prototype)
}

TaskTest.prototype.testOperation = function (queue) {
	var t = 0
	  
	queue.call('Make sure that it does not accidentally trigger in current scope', function (callbacks) {
		var cb = callbacks.add(function () {
			t += 1
		})
		
		var o = Aurora.task.create(cb)
		
		assertEquals(0, t)
		
		o.start()
		o.stop()
		
		assertEquals(0, t)
		
		o.start()
	})
	  
      
	queue.call('Make sure it triggers once the interpreter is available', function () {
		assertEquals(1, t)
	})
}

TaskTest.prototype.testAsyncOperation = function (queue) {
	var t = 0, cb
	  
	queue.call('Make sure that it does not accidentally trigger in current scope', function (callbacks) {
		var o = Aurora.task.create(function () {
			t += 1
			
			cb()
			
			this.continue()
		}, true)
		
		
		cb = callbacks.add(function () { })
		
		assertEquals(0, t)
		
		o.start()
	})
	  
      
	queue.call('Make sure it triggers once the interpreter is available', function (callbacks) {
		assertEquals(1, t)
		
		cb = callbacks.add(function () { })
	})
	
	queue.call('Make sure async triggering works', function () {
		assertEquals(2, t)
	})
}
