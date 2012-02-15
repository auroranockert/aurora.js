endian = {
    little: 4321
    big:    1234
    native: 0
}

buffer = new ArrayBuffer(4)

u8 = new Uint8Array(buffer)

u8[0] = 0x01
u8[1] = 0x02
u8[2] = 0x03
u8[3] = 0x04

u32 = new Uint32Array(buffer)

switch u32[0]
    when 0x01020304
        endian.native = endian.big
    when 0x04030201
        endian.native = endian.little
    else
        throw "Oh shit, this computer has an unknown endianness (Probably an aurora.js bug, unless you're running on an extremely exotic machine)"
    

this.Aurora = {} unless this.Aurora

this.Aurora.endian = endian
