class Bitstream
    constructor: (@stream) ->
        @bitPosition = 0
    
    copy: () ->
        result = new Bitstream(@stream.copy())
        
        result.bitPosition = @bitPosition
        
        return result
    
    offset: () -> # Should be a property
        return 8 * @stream.offset + @bitPosition
    
    available: (bits) ->
        return @stream.available((bits + 8 - @bitPosition) / 8)
    
    advance: (bits) ->
        @bitPosition += bits
        
        @stream.advance(@bitPosition >> 3)
        
        @bitPosition = @bitPosition & 7
        
        return this
    
    align: ->
        unless @bitPosition == 0
            @bitPosition = 0
            
            @stream.advance(1)
        
        return this
    
    readBig: (bits) ->
        a0 = @stream.peekUInt8(0) * 0x0100000000
        a1 = @stream.peekUInt8(1) * 0x0001000000
        a2 = @stream.peekUInt8(2) * 0x0000010000
        a3 = @stream.peekUInt8(3) * 0x0000000100
        a4 = @stream.peekUInt8(4) * 0x0000000001
        
        a = a0 + a1 + a2 + a3 + a4
        
        a = (a % Math.pow(2, 40 - @bitPosition))
        a = (a / Math.pow(2, 40 - @bitPosition - bits))
        
        this.advance(bits)
        
        return a << 0
    
    peekBig: (bits) ->
        a0 = @stream.peekUInt8(0) * 0x0100000000
        a1 = @stream.peekUInt8(1) * 0x0001000000
        a2 = @stream.peekUInt8(2) * 0x0000010000
        a3 = @stream.peekUInt8(3) * 0x0000000100
        a4 = @stream.peekUInt8(4) * 0x0000000001
        
        a = a0 + a1 + a2 + a3 + a4
        
        a = (a % Math.pow(2, 40 - @bitPosition))
        a = (a / Math.pow(2, 40 - @bitPosition - bits))
        
        return a << 0
    
    peekSafeBig: (bits) ->
        a0 = @stream.peekSafeUInt8(0) * 0x0100000000
        a1 = @stream.peekSafeUInt8(1) * 0x0001000000
        a2 = @stream.peekSafeUInt8(2) * 0x0000010000
        a3 = @stream.peekSafeUInt8(3) * 0x0000000100
        a4 = @stream.peekSafeUInt8(4) * 0x0000000001
        
        a = a0 + a1 + a2 + a3 + a4
        
        a = (a % Math.pow(2, 40 - @bitPosition))
        a = (a / Math.pow(2, 40 - @bitPosition - bits))
        
        return a << 0
    
    read: (bits) ->
        a = @stream.peekUInt32(0)
        
        a = ((a << @bitPosition) >>> (32 - bits))
        
        this.advance(bits)
        
        return a
    
    peek: (bits) ->
        a = @stream.peekUInt32(0)
        
        a = ((a << @bitPosition) >>> (32 - bits))
        
        return a
    
    peekSafe: (bits) ->
        a0 = @stream.peekSafeUInt8(0) * 0x01000000
        a1 = @stream.peekSafeUInt8(1) * 0x00010000
        a2 = @stream.peekSafeUInt8(2) * 0x00000100
        a3 = @stream.peekSafeUInt8(3) * 0x00000001
        
        a = a0 + a1 + a2 + a3
        
        a = ((a << @bitPosition) >>> (32 - bits))
        
        return a
    
    readSmall: (bits) ->
        a = @stream.peekUInt16(0)
        
        a = (((a << @bitPosition) & 0xFFFF) >>> (16 - bits))
        
        this.advance(bits)
        
        return a
    
    peekSmall: (bits) ->
        a = @stream.peekUInt16(0)
        
        a = (((a << @bitPosition) & 0xFFFF) >>> (16 - bits))
        
        return a
    
    peekSafe: (bits) ->
        a0 = @stream.peekSafeUInt8(0) * 0x0100
        a1 = @stream.peekSafeUInt8(1) * 0x0001
        
        a = a0 + a1
        
        a = (((a << @bitPosition) & 0xFFFF) >>> (16 - bits))
        
        return a
        
    

this.Aurora = {} unless this.Aurora

this.Aurora.Bitstream = Bitstream
