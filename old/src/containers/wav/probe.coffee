class WAV32Probe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 12
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('RIFF'), 0, 4)
			if CSCompare(buffer, 8, CSStringToBuffer('WAVE'), 0, 4)
				return 0.9
			
		return 0.0
	

class WAV64Probe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 16
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('RF64'), 0, 4)
			if CSCompare(buffer, 12, CSStringToBuffer('ds64'), 0, 4)
				return 1.0
			
		return 0.0
	
Aurora.Probes.push(WAV32Probe)
Aurora.Probes.push(WAV64Probe)
