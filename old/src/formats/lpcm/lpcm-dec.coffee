class LPCMDecoder
    constructor: (@name) ->
        @inputs = {
            data:
                send:   (buffer) => this.enqueueBuffer(buffer)
                mode:   "Passive"
        }
        
        @outputs = {
            audio:      null
        }
        
        @packetsDecoded = 0
        
        this.reset()
    
    enqueueBuffer: (buffer) ->
        format = buffer.metadata.format; array = buffer.data.buffer
        
        unless format.name == "Linear PCM"
            console.log("Not decoding Linear PCM"); debugger
        
        
        samples = (buffer.length / (format.bitsPerChannel / 8) >> 0)
        bytes = samples * (format.bitsPerChannel / 8)
        
        output = new Float32Array(samples) # TODO: Sample-align output from decoders
        
        if format.float
            switch format.bitsPerChannel
                when 64
                    input = new Float64Array(array, 0, samples)
                when 32
                    input = new Float32Array(array, 0, samples)
                else
                    console.log("Unsupported Float length #{format.bitsPerChannel} bits"); debugger
                
            
            (output[i] = input[i]) for i in [0 ... input.length] by 1
        else # TODO: Fix big unsigned formats, and 8-bit signed formats
            if format.littleEndian
                console.log("LE is unsupported right now, on TODO list"); debugger
            
            switch format.bitsPerChannel
                when 32
                    input = new Int32Array(array, 0, samples)
                    
                    (output[i] = input[i] / 0x7FFFFFFF) for i in [0 ... input.length] by 1
                when 24
                    console.log("24 bit output is unsupported right now, on TODO list"); debugger
                when 16
                    input = new Int16Array(array, 0, samples)
                    
                    (output[i] = input[i] / 0x7FFF) for i in [0 ... input.length] by 1
                when 8
                    input = new Uint8Array(array, 0, samples)
                    
                    (output[i] = input[i] / 0xFF) for i in [0 ... input.length] by 1
                else
                    console.log("Unsupported Float length #{format.bitsPerChannel} bits"); debugger
                
            
        
        output = new Uint8Array(output.buffer, 0, bytes)
        
        result = new Aurora.Buffer(output)
        
        result.duration  = samples / format.samplingFrequency
        result.timestamp = @packetsDecoded++ * result.duration
        
        result.metadata = {
            format: {
                name:               "Linear PCM"
                float:              true
                samplingFrequency:  format.samplingFrequency
                channels:           format.channels
                bitsPerChannel:     32
                framesPerPacket:    format.framesPerPacket
                bytesPerPacket:     format.framesPerPacket * format.channels * 4
            }
        }
        
        result.final = buffer.final
        
        @outputs.audio.send(result)
    
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

window.Aurora.LPCMDecoder = LPCMDecoder
