TaskTest = AsyncTestCase("Task Test");

TaskTest.prototype.testCreate = function () {
	assertEquals(Aurora.task, Object.getPrototypeOf(Aurora.task.create()))
	assertEquals(Aurora.object, Object.getPrototypeOf(Object.getPrototypeOf(Aurora.task.create())))
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
