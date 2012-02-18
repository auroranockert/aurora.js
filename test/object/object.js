ObjectTest = TestCase("Object Test");

ObjectTest.prototype.testCreate = function () {
  var obj = Aurora.object.create()
  
  assertEquals({ parent: null, name: null }, obj)
  assertEquals(Aurora.object, Object.getPrototypeOf(obj))
}

ObjectTest.prototype.testEvents = function () {
    var o = Aurora.object.create(), r = false
	
	var f = function () {
      r = true
    }
	
    o.addEventListener('test', f)
    assertEquals(false, r)
      
    o.dispatchEvent({ type: 'test' })
    assertEquals(true, r)
	
	r = false
	o.removeEventListener('test', f)
    o.dispatchEvent({ type: 'test' })
    assertEquals(false, r)
}

ObjectTest.prototype.testParent = function () {
    var p = Aurora.object.create(), o = Aurora.object.create(), r = false
	
    o.addEventListener('parent-set', function () {
      r = true
    })
	
    o.addEventListener('parent-unset', function () {
      r = false
    })
	
      
    o.parent = p
    assertEquals(true, r)
	assertEquals(p, o.parent)
	
    o.parent = null
    assertEquals(false, r)
	assertEquals(null, o.parent)
}
