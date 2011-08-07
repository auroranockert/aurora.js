class AIFFProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 12
	
	probe: (buffer) ->
		if CSCompare(buffer, 0, CSStringToBuffer('FORM'), 0, 4)
			if CSCompare(buffer, 8, CSStringToBuffer('AIFF'), 0, 4)
				return 1.0
			else if CSCompare(buffer, 8, CSStringToBuffer('AIFC'), 0, 4)
				return 1.0
			
		return 0.0
	
Aurora.Probes.push(AIFFProbe)
