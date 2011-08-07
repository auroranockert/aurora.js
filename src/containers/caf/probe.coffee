class CAFProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 6
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('caff\0\1'), 0, 6)
			return 1.0
		
		return 0.0
	
Aurora.Probes.push(CAFProbe)
