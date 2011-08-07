class FLVProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 4
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('FLV'), 0, 3)
			array = new Uint8Array(buffer)
			
			if array[3] < 0x05 and array[5] == 0x00
				if array[6] > 0x00 or array[7] > 0x00 or array[8] > 0x00 or array[9] > 0x08
					return 1.0
				
			
		
		return 0.0
	
Aurora.Probes.push(FLVProbe)
