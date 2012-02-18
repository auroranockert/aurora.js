TaskTest = TestCase("Task Test");

TaskTest.prototype.testCreate = function () {
	assertEquals(Aurora.task, Object.getPrototypeOf(Aurora.task.create()))
	assertEquals(Aurora.object, Object.getPrototypeOf(Object.getPrototypeOf(Aurora.task.create())))
}

TaskTest.prototype.testEvents = function () {
      var t = 0
      var o = Aurora.task.create(function () {
        t += 1
      })
      
      o.start()
      o.stop()
      
	  assertEquals(1, t)
}
