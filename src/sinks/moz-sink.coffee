class MozillaSink
    constructor: (@name) ->
        @buffers = []
        
        @inputs = {
            audio: null
        }
        
        @audio = null
        
        @samplingFrequency = 48000
        @channels = 2
        
        @currentWritePosition = 0
        @prebufferSize = null
        
        @tail = null; @tailPosition = 0
        
        @interval = null
        
        @callback = () =>
            if @tail
                written = @audio.mozWriteAudio(@tail.subarray(@tailPosition))
                
                @currentWritePosition += written
                @tailPosition += written
                
                return if @tailPosition < @tail.length
                
                @tail = null
            
            if @audio.mozCurrentSampleOffset() + @prebufferSize > @currentWritePosition
                buffer = new Float32Array(@inputs.audio.receive().data.buffer)
                
                written = @audio.mozWriteAudio(buffer)
                
                if written < buffer.length
                    @tail = buffer
                    @tailPosition = written
                
                @currentWritePosition += written;
            
        
    
    start: () ->
        @status = "Started"
        
        @prebufferSize = @samplingFrequency / 2 unless @prebufferSize
        
        @audio = new Audio()
        
        @audio.mozSetup(@channels, @samplingFrequency)
        
        @interval = setInterval(@callback, 50);
        
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
    

this.Aurora = {} unless this.Aurora

this.Aurora.MozillaSink = MozillaSink
