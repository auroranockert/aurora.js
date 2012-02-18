ChannelTest = AsyncTestCase("Channel Test");

ChannelTest.prototype.testCreate = function () {
	var channel = Aurora.channel.create()
	
	assertEquals(Aurora.channel, channel.prototype)
	assertEquals(Aurora.object, channel.prototype.prototype)
}

ChannelTest.prototype.testMessaging = function () {
	var channel = Aurora.channel.create()
	
	var msg = 'A small message'
	
	channel.postMessage(msg)
	
	assertEquals([msg], channel.queue)
	assertEquals(msg, channel.peekMessage())
	assertEquals(msg, channel.readMessage())
}

ChannelTest.prototype.testHandler = function () {
	var channel = Aurora.channel.create()
	
	channel.handler = function (message) {
		return Aurora.channel.operation.drop
	}
	
	var msg = 'A small message'
	
	channel.postMessage(msg)
	
	assertEquals([], channel.queue)
	assertEquals(null, channel.peekMessage())
	assertEquals(null, channel.readMessage())
}

