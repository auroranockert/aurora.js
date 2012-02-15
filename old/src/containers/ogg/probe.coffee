class OggProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 6
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('OggS'), 0, 4)
			array = new Uint8Array(buffer)
			
			if array[4] == 0 and array[5] <= 0x07
				return 1.0
			
		return 0.0
	
Aurora.Probes.push(OggProbe)
