class Buffer
    constructor: (@data) ->
        @position = null
        @length = @data.length
        
        @timestamp = null
        @duration  = null
        
        @metadata = null
        
        @final = false
        @discontinuity = false
    
    @allocate: (size) ->
        return new Buffer(new Uint8Array(size))
    
    copy: () ->
        buffer = new Buffer(new Uint8Array(@data))
        
        buffer.position = @position
        
        buffer.timestamp = @timestamp
        buffer.duration = @duration
        
        buffer.metadata = @metadata
        
        buffer.final = @final
        buffer.discontinuity = @discontinuity
    
    slice: (position, length) ->
        if position == 0 && length >= @length
            return this
        else
            result = new Buffer(@data.subarray(position, length))
            
            result.position = @position + position
            
            return result
        
    

window.Aurora = {} unless window.Aurora

window.Aurora.Buffer = Buffer