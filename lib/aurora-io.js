(function() {
  var Bitstream, Buffer, BufferList, Float32, Float64, FromFloat32, FromFloat64, Stream, ToFloat32, ToFloat64;

  Bitstream = (function() {

    function Bitstream(stream) {
      this.stream = stream;
      this.bitPosition = 0;
    }

    Bitstream.prototype.copy = function() {
      var result;
      result = new Bitstream(this.stream.copy());
      result.bitPosition = this.bitPosition;
      return result;
    };

    Bitstream.prototype.offset = function() {
      return 8 * this.stream.offset + this.bitPosition;
    };

    Bitstream.prototype.available = function(bits) {
      return this.stream.available((bits + 8 - this.bitPosition) / 8);
    };

    Bitstream.prototype.advance = function(bits) {
      this.bitPosition += bits;
      this.stream.advance(this.bitPosition >> 3);
      this.bitPosition = this.bitPosition & 7;
      return this;
    };

    Bitstream.prototype.align = function() {
      if (this.bitPosition !== 0) {
        this.bitPosition = 0;
        this.stream.advance(1);
      }
      return this;
    };

    Bitstream.prototype.readBig = function(bits) {
      var a, a0, a1, a2, a3, a4;
      a0 = this.stream.peekUInt8(0) * 0x0100000000;
      a1 = this.stream.peekUInt8(1) * 0x0001000000;
      a2 = this.stream.peekUInt8(2) * 0x0000010000;
      a3 = this.stream.peekUInt8(3) * 0x0000000100;
      a4 = this.stream.peekUInt8(4) * 0x0000000001;
      a = a0 + a1 + a2 + a3 + a4;
      a = a % Math.pow(2, 40 - this.bitPosition);
      a = a / Math.pow(2, 40 - this.bitPosition - bits);
      this.advance(bits);
      return a << 0;
    };

    Bitstream.prototype.peekBig = function(bits) {
      var a, a0, a1, a2, a3, a4;
      a0 = this.stream.peekUInt8(0) * 0x0100000000;
      a1 = this.stream.peekUInt8(1) * 0x0001000000;
      a2 = this.stream.peekUInt8(2) * 0x0000010000;
      a3 = this.stream.peekUInt8(3) * 0x0000000100;
      a4 = this.stream.peekUInt8(4) * 0x0000000001;
      a = a0 + a1 + a2 + a3 + a4;
      a = a % Math.pow(2, 40 - this.bitPosition);
      a = a / Math.pow(2, 40 - this.bitPosition - bits);
      return a << 0;
    };

    Bitstream.prototype.peekSafeBig = function(bits) {
      var a, a0, a1, a2, a3, a4;
      a0 = this.stream.peekSafeUInt8(0) * 0x0100000000;
      a1 = this.stream.peekSafeUInt8(1) * 0x0001000000;
      a2 = this.stream.peekSafeUInt8(2) * 0x0000010000;
      a3 = this.stream.peekSafeUInt8(3) * 0x0000000100;
      a4 = this.stream.peekSafeUInt8(4) * 0x0000000001;
      a = a0 + a1 + a2 + a3 + a4;
      a = a % Math.pow(2, 40 - this.bitPosition);
      a = a / Math.pow(2, 40 - this.bitPosition - bits);
      return a << 0;
    };

    Bitstream.prototype.read = function(bits) {
      var a;
      a = this.stream.peekUInt32(0);
      a = (a << this.bitPosition) >>> (32 - bits);
      this.advance(bits);
      return a;
    };

    Bitstream.prototype.peek = function(bits) {
      var a;
      a = this.stream.peekUInt32(0);
      a = (a << this.bitPosition) >>> (32 - bits);
      return a;
    };

    Bitstream.prototype.peekSafe = function(bits) {
      var a, a0, a1, a2, a3;
      a0 = this.stream.peekSafeUInt8(0) * 0x01000000;
      a1 = this.stream.peekSafeUInt8(1) * 0x00010000;
      a2 = this.stream.peekSafeUInt8(2) * 0x00000100;
      a3 = this.stream.peekSafeUInt8(3) * 0x00000001;
      a = a0 + a1 + a2 + a3;
      a = (a << this.bitPosition) >>> (32 - bits);
      return a;
    };

    Bitstream.prototype.readSmall = function(bits) {
      var a;
      a = this.stream.peekUInt16(0);
      a = ((a << this.bitPosition) & 0xFFFF) >>> (16 - bits);
      this.advance(bits);
      return a;
    };

    Bitstream.prototype.peekSmall = function(bits) {
      var a;
      a = this.stream.peekUInt16(0);
      a = ((a << this.bitPosition) & 0xFFFF) >>> (16 - bits);
      return a;
    };

    Bitstream.prototype.peekSafe = function(bits) {
      var a, a0, a1;
      a0 = this.stream.peekSafeUInt8(0) * 0x0100;
      a1 = this.stream.peekSafeUInt8(1) * 0x0001;
      a = a0 + a1;
      a = ((a << this.bitPosition) & 0xFFFF) >>> (16 - bits);
      return a;
    };

    return Bitstream;

  })();

  if (!window.Aurora) window.Aurora = {};

  window.Aurora.Bitstream = Bitstream;

  BufferList = (function() {

    function BufferList() {
      this.buffers = [];
      this.availableBytes = 0;
      this.availableBuffers = 0;
      this.bufferHighWaterMark = null;
      this.bufferLowWaterMark = null;
      this.bytesHighWaterMark = null;
      this.bytesLowWaterMark = null;
      this.onLowWaterMarkReached = null;
      this.onHighWaterMarkReached = null;
      this.onLevelChange = null;
      this.endOfList = false;
      this.first = null;
    }

    BufferList.prototype.copy = function() {
      var result;
      result = new BufferList();
      result.buffers = this.buffers.slice(0);
      result.availableBytes = this.availableBytes;
      result.availableBuffers = this.availableBuffers;
      return result.endOfList = this.endOfList;
    };

    BufferList.prototype.shift = function() {
      var result;
      result = this.buffers.shift();
      this.availableBytes -= result.length;
      this.availableBuffers -= 1;
      this.first = this.buffers[0];
      return result;
    };

    BufferList.prototype.push = function(buffer) {
      this.buffers.push(buffer);
      this.availableBytes += buffer.length;
      this.availableBuffers += 1;
      if (!this.first) this.first = buffer;
      return this;
    };

    BufferList.prototype.unshift = function(buffer) {
      this.buffers.unshift(buffer);
      this.availableBytes += buffer.length;
      this.availableBuffers += 1;
      this.first = buffer;
      return this;
    };

    return BufferList;

  })();

  if (!window.Aurora) window.Aurora = {};

  window.Aurora.BufferList = BufferList;

  Buffer = (function() {

    function Buffer(data) {
      this.data = data;
      this.position = null;
      this.length = this.data.length;
      this.timestamp = null;
      this.duration = null;
      this.metadata = null;
      this.final = false;
      this.discontinuity = false;
    }

    Buffer.allocate = function(size) {
      return new Buffer(new Uint8Array(size));
    };

    Buffer.prototype.copy = function() {
      var buffer;
      buffer = new Buffer(new Uint8Array(this.data));
      buffer.position = this.position;
      buffer.timestamp = this.timestamp;
      buffer.duration = this.duration;
      buffer.metadata = this.metadata;
      buffer.final = this.final;
      return buffer.discontinuity = this.discontinuity;
    };

    Buffer.prototype.slice = function(position, length) {
      var result;
      if (position === 0 && length >= this.length) {
        return this;
      } else {
        result = new Buffer(this.data.subarray(position, length));
        result.position = this.position + position;
        return result;
      }
    };

    return Buffer;

  })();

  if (!window.Aurora) window.Aurora = {};

  window.Aurora.Buffer = Buffer;

  Float64 = new ArrayBuffer(8);

  Float32 = new ArrayBuffer(4);

  FromFloat64 = new Float64Array(Float64);

  FromFloat32 = new Float32Array(Float32);

  ToFloat64 = new Uint32Array(Float64);

  ToFloat32 = new Uint32Array(Float32);

  Stream = (function() {

    function Stream(list) {
      this.list = list;
      this.localOffset = 0;
      this.offset = 0;
    }

    Stream.prototype.copy = function() {
      var result;
      result = new Stream(this.list.copy);
      result.localOffset = this.localOffset;
      result.offset = this.offset;
      return result;
    };

    Stream.prototype.available = function(bytes) {
      return this.list.availableBytes - this.localOffset >= bytes;
    };

    Stream.prototype.advance = function(bytes) {
      this.localOffset += bytes;
      this.offset += bytes;
      while (this.list.first && (this.localOffset >= this.list.first.length)) {
        this.localOffset -= this.list.shift().length;
      }
      return this;
    };

    Stream.prototype.readUInt32 = function() {
      var a0, a1, a2, a3, buffer;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + 3) {
        a0 = buffer[this.localOffset + 0];
        a1 = buffer[this.localOffset + 1];
        a2 = buffer[this.localOffset + 2];
        a3 = buffer[this.localOffset + 3];
        this.advance(4);
      } else {
        a0 = this.readUInt8();
        a1 = this.readUInt8();
        a2 = this.readUInt8();
        a3 = this.readUInt8();
      }
      return ((a0 << 24) >>> 0) + (a1 << 16) + (a2 << 8) + a3;
    };

    Stream.prototype.peekUInt32 = function(offset) {
      var a0, a1, a2, a3, buffer;
      if (offset == null) offset = 0;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + offset + 3) {
        a0 = buffer[this.localOffset + offset + 0];
        a1 = buffer[this.localOffset + offset + 1];
        a2 = buffer[this.localOffset + offset + 2];
        a3 = buffer[this.localOffset + offset + 3];
      } else {
        a0 = this.peekUInt8(offset + 0);
        a1 = this.peekUInt8(offset + 1);
        a2 = this.peekUInt8(offset + 2);
        a3 = this.peekUInt8(offset + 3);
      }
      return ((a0 << 24) >>> 0) + (a1 << 16) + (a2 << 8) + a3;
    };

    Stream.prototype.readInt32 = function() {
      var a0, a1, a2, a3, buffer;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + offset + 3) {
        a0 = buffer[this.localOffset + 0];
        a1 = buffer[this.localOffset + 1];
        a2 = buffer[this.localOffset + 2];
        a3 = buffer[this.localOffset + 3];
        this.advance(4);
      } else {
        a0 = this.readUInt8();
        a1 = this.readUInt8();
        a2 = this.readUInt8();
        a3 = this.readUInt8();
      }
      return (a0 << 24) + (a1 << 16) + (a2 << 8) + a3;
    };

    Stream.prototype.peekInt32 = function(offset) {
      var a0, a1, a2, a3, buffer;
      if (offset == null) offset = 0;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + offset + 3) {
        a0 = buffer[this.localOffset + offset + 0];
        a1 = buffer[this.localOffset + offset + 1];
        a2 = buffer[this.localOffset + offset + 2];
        a3 = buffer[this.localOffset + offset + 3];
      } else {
        a0 = this.peekUInt8(offset + 0);
        a1 = this.peekUInt8(offset + 1);
        a2 = this.peekUInt8(offset + 2);
        a3 = this.peekUInt8(offset + 3);
      }
      return (a0 << 24) + (a1 << 16) + (a2 << 8) + a3;
    };

    Stream.prototype.readUInt16 = function() {
      var a0, a1, buffer;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + 1) {
        a0 = buffer[this.localOffset + 0];
        a1 = buffer[this.localOffset + 1];
        this.advance(2);
      } else {
        a0 = this.readUInt8();
        a1 = this.readUInt8();
      }
      return (a0 << 8) + a1;
    };

    Stream.prototype.peekUInt16 = function(offset) {
      var a0, a1, buffer;
      if (offset == null) offset = 0;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + offset + 1) {
        a0 = buffer[this.localOffset + offset + 0];
        a1 = buffer[this.localOffset + offset + 1];
      } else {
        a0 = this.peekUInt8(offset + 0);
        a1 = this.peekUInt8(offset + 1);
      }
      return (a0 << 8) + a1;
    };

    Stream.prototype.readInt16 = function() {
      var a0, a1, buffer;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + 1) {
        a0 = buffer[this.localOffset + 0];
        a1 = buffer[this.localOffset + 1];
      } else {
        a0 = this.readInt8();
        a1 = this.readUInt8();
      }
      return (a0 << 8) + a1;
    };

    Stream.prototype.peekInt16 = function(offset) {
      var a0, a1, buffer;
      if (offset == null) offset = 0;
      buffer = this.list.first.data;
      if (buffer.length > this.localOffset + offset + 1) {
        a0 = buffer[this.localOffset + offset + 0];
        a1 = buffer[this.localOffset + offset + 1];
      } else {
        a0 = this.peekInt8(offset + 0);
        a1 = this.peekUInt8(offset + 1);
      }
      return (a0 << 8) + a1;
    };

    Stream.prototype.readUInt8 = function() {
      var a0;
      a0 = this.list.first.data[this.localOffset];
      this.localOffset += 1;
      this.offset += 1;
      if (this.localOffset === this.list.first.length) {
        this.localOffset = 0;
        this.buffers.shift();
      }
      return a0;
    };

    Stream.prototype.peekUInt8 = function(offset) {
      var buffer, i;
      if (offset == null) offset = 0;
      offset = this.localOffset + offset;
      i = 0;
      buffer = this.list.buffers[i].data;
      while (!(buffer.length > offset)) {
        offset -= buffer.length;
        buffer = this.list.buffers[++i].data;
      }
      return buffer[offset];
    };

    Stream.prototype.peekSafeUInt8 = function(offset) {
      var buffer, i, list, _ref;
      if (offset == null) offset = 0;
      offset = this.localOffset + offset;
      list = this.list.buffers;
      for (i = 0, _ref = list.length; i < _ref; i += 1) {
        buffer = list[i];
        if (buffer.length > offset) {
          return buffer.data[offset];
        } else {
          offset -= buffer.length;
        }
      }
      return 0;
    };

    Stream.prototype.readInt8 = function() {
      var a0;
      a0 = (this.list.first.data[this.localOffset] << 24) >> 24;
      this.advance(1);
      return a0;
    };

    Stream.prototype.peekInt8 = function(offset) {
      var buffer, i;
      if (offset == null) offset = 0;
      offset = this.localOffset + offset;
      i = 0;
      buffer = this.list.buffers[i].data;
      while (!(buffer.length > offset)) {
        offset -= buffer.length;
        buffer = this.list.buffers[++i].data;
      }
      return (buffer[offset] << 24) >> 24;
    };

    Stream.prototype.readFloat64 = function() {
      ToFloat64[1] = this.readUInt32();
      ToFloat64[0] = this.readUInt32();
      return FromFloat64[0];
    };

    Stream.prototype.readFloat32 = function() {
      ToFloat32[0] = this.readUInt32();
      return FromFloat32[0];
    };

    Stream.prototype.readString = function(length) {
      var i, result;
      result = [];
      for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
        result.push(String.fromCharCode(this.readUInt8()));
      }
      return result.join('');
    };

    Stream.prototype.peekString = function(length, offset) {
      var i, result;
      result = [];
      for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
        result.push(String.fromCharCode(this.peekUInt8(offset + i)));
      }
      return result.join('');
    };

    Stream.prototype.readBuffer = function(length) {
      var i, result, to;
      result = Buffer.allocate(length);
      to = result.data;
      for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
        to[i] = this.readUInt8();
      }
      return result;
    };

    Stream.prototype.readSingleBuffer = function(length) {
      var result;
      result = this.list.first.slice(this.localOffset, length);
      this.advance(result.length);
      return result;
    };

    return Stream;

  })();

  if (!window.Aurora) window.Aurora = {};

  window.Aurora.Stream = Stream;

}).call(this);
