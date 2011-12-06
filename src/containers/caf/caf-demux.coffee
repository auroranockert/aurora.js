FormatIDtoAuroraID = {
    'lpcm': 'Linear PCM'
    'alac': 'Apple Lossless Audio Codec (ALAC)'
}

class CAFDemuxer
    constructor: (@name) ->
        @inputs = {
            data:
                send:   (buffer) => this.enqueueBuffer(buffer)
                mode:   "Passive"
        }
        
        @outputs = {
            cookie:     null
            data:       null
        }
        
        @list = new BufferList()
        
        @stream = new Stream(@list)
        
        @metadata = null
        @bufferMetadata = null
        
        @headerCache = null
        @packetCache = null
        
        @magic = null
        
        this.reset()
    
    enqueueBuffer: (buffer) ->
        @list.push(buffer)
        
        if !@metadata && @stream.available(64) # Number out of my behind
            magicCookie = @stream.readString(4)
            
            if magicCookie != 'caff'
                console.log("Invalid CAF, does not begin with 'caff'"); debugger
            
            @metadata = {
                caff: {
                    version:        @stream.readUInt16()
                    flags:          @stream.readUInt16()
                }
            }
            
            descCookie = @stream.readString(4)
            
            if descCookie != 'desc'
                console.log("Invalid CAF, 'caff' is not followed by 'desc'"); debugger
            
            descSizeA = @stream.readUInt32()
            descSizeB = @stream.readUInt32()
            
            unless descSizeA == 0 && descSizeB == 32
                console.log("Invalid 'desc' size, should be 32"); debugger
            
            @metadata.desc = {
                samplingFrequency:  @stream.readFloat64()
                formatID:           @stream.readString(4)
                formatFlags:        @stream.readUInt32()
                bytesPerPacket:     @stream.readUInt32()
                framesPerPacket:    @stream.readUInt32()
                channelsPerFrame:   @stream.readUInt32()
                bitsPerChannel:     @stream.readUInt32()
            }
            
            if @metadata.desc.formatID == 'lpcm'
                format = {
                    name:               FormatIDtoAuroraID[@metadata.desc.formatID]
                    float:              (@metadata.desc.formatFlags & 0x01) == 0x01
                    littleEndian:       (@metadata.desc.formatFlags & 0x02) == 0x02
                }
            else
                format = {
                    name:               FormatIDtoAuroraID[@metadata.desc.formatID]
                }
            
            format.samplingFrequency  = @metadata.desc.samplingFrequency
            format.channels           = @metadata.desc.channelsPerFrame
            format.bitsPerChannel     = @metadata.desc.bitsPerChannel
            
            format.framesPerPacket    = @metadata.desc.framesPerPacket if @metadata.desc.framesPerPacket
            format.bytesPerPacket     = @metadata.desc.bytesPerPacket  if @metadata.desc.bytesPerPacket
            
            @bufferMetadata = {
                format:                 format
            }
        
        if !@metadata && buffer.final
            console.log("Not enough data in file for CAF header"); debugger
        
        while (@headerCache && @stream.available(1)) || @stream.available(13)
            unless @headerCache
                @headerCache = {
                    type:               @stream.readString(4)
                    oversize:           @stream.readUInt32() != 0
                    size:               @stream.readUInt32()
                }
                
                if @headerCache.type == 'data' # Silly-Hack
                    @stream.advance(4)
                    @headerCache.size -= 4
                
            
            if @headerCache.oversize
                console.log("Holy Shit, an oversized file, not supported in JS"); debugger
            
            size = @headerCache.size
            
            switch @headerCache.type
                when 'kuki'
                    if @stream.available(@headerCache.size)
                        buffer = @stream.readBuffer(@headerCache.size)
                        
                        buffer.final = true
                        
                        @outputs.cookie.send(buffer)
                        
                        @headerCache = null
                    else
                        return
                when 'data' # TODO: Handle size = 0 for data element
                    buffer = @stream.readSingleBuffer(@headerCache.size)
                    
                    buffer.metadata = @bufferMetadata
                    
                    @headerCache.size -= buffer.length
                    
                    if @headerCache.size <= 0
                        @headerCache = null
                        buffer.final = true
                    
                    @outputs.data.send(buffer)
                else
                    if @stream.available(@headerCache.size)
                        @stream.advance(@headerCache.size)
                        
                        @headerCache = null
                    else
                        return
                
            
        
        this.finished() if buffer.final
        
        return
    
    start: () ->
        @status = "Started"
        
        return this
    
    pause: () ->
        @status = "Paused"
        
        return this
    
    reset: () ->
        @status = "Paused"
        
        return this
    
    finished: () ->
        @status = "Finished"
        
        return this
    

window.Aurora = {} unless window.Aurora

window.Aurora.CAFDemuxer = CAFDemuxer
