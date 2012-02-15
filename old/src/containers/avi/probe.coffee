AVI = {}
AVI.Headers = [
	CSStringToBuffer('RIFFAVI '),
	CSStringToBuffer('RIFFAVIX'),
	CSStringToBuffer('RIFFAVI'), # The b0rken character is 0x19
	CSStringToBuffer('ON2 ON2f'),
	CSStringToBuffer('RIFFAMV ')
]

class AVIProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 12
	
	probe: (buffer) ->
		for header in AVI.Headers
			if CSCompare(buffer, 0, header, 0, 4)
				if CSCompare(buffer, 8, header, 4, 4)
					return 1.0
				
			
		return 0.0
	
Aurora.Probes.push(AVIProbe)
