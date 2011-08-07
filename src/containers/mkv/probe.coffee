Matroska = {}
Matroska.Doctypes = [CSStringToBuffer('matroska'), CSStringToBuffer('webm')]

class MatroskaProbe extends Probe
	constructor: () ->
		super()
		
		@minimumLength = 128
	
	probe: (buffer) ->
		[total, size, n, mask] = [0, 1, 1, 0x80]
		
		if (new Int32Array(buffer)[0] != CSBig32ToNative(0x1A45DFA3))          # TODO: Unmagic
			return 0.0
		
		array = new Uint8Array(buffer)
		
		total = array[4]
		
		while (size <= 8 && !(total & mask))
			size += 1; mask >>= 1;
		
		if size > 8
			return 0.0
		
		total &= (mask - 1)
		
		for i in [0 ... size] by 1
			total = (total << 8) | array[4 + i]
		
		if buffer.byteLength < 4 + size + total
			throw 'Too small buffer'                                            # TODO: Support extension in Aurora
		
		for doctype in Matroska.Doctypes
			for n in [doctype.byteLength .. 4 + size + total - doctype.byteLength] by 1
				if CSCompare(buffer, n, doctype, 0, doctype.byteLength)
					return 1.0
				
			
		return 0.5
	
Aurora.Probes.push(MatroskaProbe)
