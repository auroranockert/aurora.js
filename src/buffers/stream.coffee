Float64 = new ArrayBuffer(8)
Float32 = new ArrayBuffer(4)

FromFloat64 = new Float64Array(Float64)
FromFloat32 = new Float32Array(Float32)

ToFloat64 = new Uint32Array(Float64)
ToFloat32 = new Uint32Array(Float32)

class Stream
    constructor: (@list) ->
        @localOffset = 0; @offset = 0
    
    copy: () ->
        result = new Stream(@list.copy)
        
        result.localOffset = @localOffset
        result.offset = @offset
        
        return result
    
    available: (bytes) ->
        if bytes
            return @list.availableBytes - @localOffset >= bytes
        else
            return @list.availableBytes
        
    
    advance: (bytes) ->
        @localOffset += bytes; @offset += bytes
        
        while @list.first && (@localOffset >= @list.first.length)
            @localOffset -= @list.shift().length
        
        return this
    
    readUInt32BE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + 3
            a0 = buffer[@localOffset + 0]
            a1 = buffer[@localOffset + 1]
            a2 = buffer[@localOffset + 2]
            a3 = buffer[@localOffset + 3]
            
            this.advance(4)
        else
            a0 = this.readUInt8()
            a1 = this.readUInt8()
            a2 = this.readUInt8()
            a3 = this.readUInt8()
        
        return ((a0 << 24) >>> 0) + (a1 << 16) + (a2 << 8) + (a3)
    
    readUInt32LE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + 3
            a3 = buffer[@localOffset + 0]
            a2 = buffer[@localOffset + 1]
            a1 = buffer[@localOffset + 2]
            a0 = buffer[@localOffset + 3]
            
            this.advance(4)
        else
            a3 = this.readUInt8()
            a2 = this.readUInt8()
            a1 = this.readUInt8()
            a0 = this.readUInt8()
        
        return ((a0 << 24) >>> 0) + (a1 << 16) + (a2 << 8) + (a3)
    
    peekUInt32: (offset = 0) ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + offset + 3
            a0 = buffer[@localOffset + offset + 0]
            a1 = buffer[@localOffset + offset + 1]
            a2 = buffer[@localOffset + offset + 2]
            a3 = buffer[@localOffset + offset + 3]
        else
            a0 = this.peekUInt8(offset + 0)
            a1 = this.peekUInt8(offset + 1)
            a2 = this.peekUInt8(offset + 2)
            a3 = this.peekUInt8(offset + 3)
        
        return ((a0 << 24) >>> 0) + (a1 << 16) + (a2 << 8) + (a3)
    
    readInt32BE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + offset + 3
            a0 = buffer[@localOffset + 0]
            a1 = buffer[@localOffset + 1]
            a2 = buffer[@localOffset + 2]
            a3 = buffer[@localOffset + 3]
            
            this.advance(4)
        else
            a0 = this.readUInt8()
            a1 = this.readUInt8()
            a2 = this.readUInt8()
            a3 = this.readUInt8()
        
        return (a0 << 24) + (a1 << 16) + (a2 << 8) + (a3)
    
    readInt32LE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + offset + 3
            a3 = buffer[@localOffset + 0]
            a2 = buffer[@localOffset + 1]
            a1 = buffer[@localOffset + 2]
            a0 = buffer[@localOffset + 3]
            
            this.advance(4)
        else
            a3 = this.readUInt8()
            a2 = this.readUInt8()
            a1 = this.readUInt8()
            a0 = this.readUInt8()
        
        return (a0 << 24) + (a1 << 16) + (a2 << 8) + (a3)
    
    peekInt32: (offset = 0) ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + offset + 3
            a0 = buffer[@localOffset + offset + 0]
            a1 = buffer[@localOffset + offset + 1]
            a2 = buffer[@localOffset + offset + 2]
            a3 = buffer[@localOffset + offset + 3]
        else
            a0 = this.peekUInt8(offset + 0)
            a1 = this.peekUInt8(offset + 1)
            a2 = this.peekUInt8(offset + 2)
            a3 = this.peekUInt8(offset + 3)
        
        return (a0 << 24) + (a1 << 16) + (a2 << 8) + (a3)
    
    readUInt16BE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + 1
            a0 = buffer[@localOffset + 0]
            a1 = buffer[@localOffset + 1]
            
            this.advance(2)
        else
            a0 = this.readUInt8()
            a1 = this.readUInt8()
        
        return (a0 << 8) + (a1)
    
    readUInt16LE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + 1
            a1 = buffer[@localOffset + 0]
            a0 = buffer[@localOffset + 1]
            
            this.advance(2)
        else
            a1 = this.readUInt8()
            a0 = this.readUInt8()
        
        return (a0 << 8) + (a1)
    
    peekUInt16: (offset = 0) ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + offset + 1
            a0 = buffer[@localOffset + offset + 0]
            a1 = buffer[@localOffset + offset + 1]
        else
            a0 = this.peekUInt8(offset + 0)
            a1 = this.peekUInt8(offset + 1)
        
        return (a0 << 8) + (a1)
    
    readInt16BE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + 1
            a0 = buffer[@localOffset + 0]
            a1 = buffer[@localOffset + 1]
        else
            a0 = this.readInt8()
            a1 = this.readUInt8()
        
        return (a0 << 8) + (a1)
    
    readInt16LE: () ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + 1
            a1 = buffer[@localOffset + 0]
            a0 = buffer[@localOffset + 1]
        else
            a1 = this.readInt8()
            a0 = this.readUInt8()
        
        return (a0 << 8) + (a1)
    
    peekInt16: (offset = 0) ->
        buffer = @list.first.data
        
        if buffer.length > @localOffset + offset + 1
            a0 = buffer[@localOffset + offset + 0]
            a1 = buffer[@localOffset + offset + 1]
        else
            a0 = this.peekInt8(offset + 0)
            a1 = this.peekUInt8(offset + 1)
        
        return (a0 << 8) + (a1)
    
    readUInt8: () ->
        a0 = @list.first.data[@localOffset]
        
        @localOffset += 1; @offset += 1
        
        if @localOffset == @list.first.length
            @localOffset = 0; @buffers.shift()
        
        return a0
    
    peekUInt8: (offset = 0) ->
        offset = @localOffset + offset
        
        i = 0; buffer = @list.buffers[i].data
        
        until buffer.length > offset
            offset -= buffer.length
            buffer = @list.buffers[++i].data
        
        return buffer[offset]
    
    peekSafeUInt8: (offset = 0) ->
        offset = @localOffset + offset; list = @list.buffers
        
        for i in [0 ... list.length] by 1
            buffer = list[i]
            
            if buffer.length > offset
                return buffer.data[offset]
            else
                offset -= buffer.length
            
        
        return 0
    
    readInt8: () ->
        a0 = ((@list.first.data[@localOffset] << 24) >> 24)
        
        this.advance(1)
        
        return a0
    
    peekInt8: (offset = 0) ->
        offset = @localOffset + offset
        
        i = 0; buffer = @list.buffers[i].data
        
        until buffer.length > offset
            offset -= buffer.length
            buffer = @list.buffers[++i].data
        
        return ((buffer[offset] << 24) >> 24)
    
    readFloat64BE: () -> # Native endian is assumed to be LE
        ToFloat64[1] = this.readUInt32BE()
        ToFloat64[0] = this.readUInt32BE()
        
        return FromFloat64[0]
    
    readFloat64LE: () -> # Native endian is assumed to be LE
        ToFloat64[1] = this.readUInt32LE()
        ToFloat64[0] = this.readUInt32LE()
        
        return FromFloat64[0]
    
    readFloat32BE: () ->
        ToFloat32[0] = this.readUInt32BE()
        
        return FromFloat32[0]
    
    readFloat32LE: () ->
        ToFloat32[0] = this.readUInt32LE()
        
        return FromFloat32[0]
    
    readString: (length) ->
        result = []
        
        for i in [0 ... length]
            result.push(String.fromCharCode(this.readUInt8()))
        
        return result.join('')
    
    peekString: (length, offset) ->
        result = []
        
        for i in [0 ... length]
            result.push(String.fromCharCode(this.peekUInt8(offset + i)))
        
        return result.join('')
    
    readBuffer: (length) ->
        result = Buffer.allocate(length)
        
        result.position = @offset
        
        to = result.data
        
        for i in [0 ... length]
            to[i] = this.readUInt8()
        
        return result
    
    readSingleBuffer: (length) ->
        result = @list.first.slice(@localOffset, length)
        
        result.position = @offset
        
        this.advance(result.length)
        
        return result
    

this.Aurora = {} unless this.Aurora

this.Aurora.Stream = Stream
