class Aurora
	probe: (io, errback, callback) ->
		unless @probes
			@probes = (new probe() for probe in Aurora.Probes)
		
		[match, value, failedProbes] = [null, 0.0, []]
		
		io.peek @probes[0].preferredLength, errback, (buffer) =>
			for probe in @probes
				unless probe.minimumLength > buffer.length
					v = probe.probe(buffer)
					
					[match, value] = [probe, v] if v > value
				else
					failedProbes.push(probe)
				
			
			if match
				callback(match, value)
			else
				errback("No matching probes (but #{failedProbes.length} probes failed)")
			
		
	

class Probe
	constructor: () ->
		@minimumLength = 0
		@maximumLength = 128 * 1024
		@preferredLength = 8 * 1024
	

window.Aurora = Aurora

[Aurora.Probe, Aurora.Probes] = [Probe, []]
