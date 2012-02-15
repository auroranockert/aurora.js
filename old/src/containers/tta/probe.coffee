class TTAProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 4
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('TTA1'), 0, 4)
			return 0.5
		
		return 0.0
	
Aurora.Probes.push(TTAProbe)
