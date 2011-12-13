class BufferList
    constructor: () ->
        @buffers = []
        
        @availableBytes = 0
        @availableBuffers = 0
        
        @bufferHighWaterMark = null; @bufferLowWaterMark = null
        @bytesHighWaterMark = null; @bytesLowWaterMark = null
        
        @onLowWaterMarkReached = null; @onHighWaterMarkReached = null
        
        @onLevelChange = null
        
        @endOfList = false
        
        @first = null
    
    copy: () ->
        result = new BufferList()
        
        result.buffers = @buffers.slice(0)
        
        result.availableBytes = @availableBytes
        result.availableBuffers = @availableBuffers
        
        result.endOfList = @endOfList
    
    shift: () ->
        result = @buffers.shift()
        
        @availableBytes -= result.length
        @availableBuffers -= 1
        
        @first = @buffers[0]
        
        return result
    
    push: (buffer) ->
        @buffers.push(buffer)
        
        @availableBytes += buffer.length
        @availableBuffers += 1
        
        @first = buffer unless @first
        
        return this
    
    unshift: (buffer) ->
        @buffers.unshift(buffer)
        
        @availableBytes += buffer.length
        @availableBuffers += 1
        
        @first = buffer
        
        return this
    

this.Aurora = {} unless this.Aurora

this.Aurora.BufferList = BufferList
