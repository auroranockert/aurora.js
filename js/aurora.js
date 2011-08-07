(function() {
  var AIFFProbe, AVI, AVIProbe, Aurora, CAFProbe, FLACProbe, Matroska, MatroskaProbe, OggProbe, Probe, TTAProbe, WAV32Probe, WAV64Probe, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Aurora = (function() {
    function Aurora() {}
    Aurora.prototype.probe = function(io, errback, callback) {
      var failedProbes, match, probe, value, _ref;
      if (!this.probes) {
        this.probes = (function() {
          var _i, _len, _ref, _results;
          _ref = Aurora.Probes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            probe = _ref[_i];
            _results.push(new probe());
          }
          return _results;
        })();
      }
      _ref = [null, 0.0, []], match = _ref[0], value = _ref[1], failedProbes = _ref[2];
      return io.peek(this.probes[0].preferredLength, errback, __bind(function(buffer) {
        var probe, v, _i, _len, _ref2, _ref3;
        _ref2 = this.probes;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          probe = _ref2[_i];
          if (!(probe.minimumLength > buffer.length)) {
            v = probe.probe(buffer);
            if (v > value) {
              _ref3 = [probe, v], match = _ref3[0], value = _ref3[1];
            }
          } else {
            failedProbes.push(probe);
          }
        }
        if (match) {
          return callback(match, value);
        } else {
          return errback("No matching probes (but " + failedProbes.length + " probes failed)");
        }
      }, this));
    };
    return Aurora;
  })();
  Probe = (function() {
    function Probe() {
      this.minimumLength = 0;
      this.maximumLength = 128 * 1024;
      this.preferredLength = 8 * 1024;
    }
    return Probe;
  })();
  window.Aurora = Aurora;
  _ref = [Probe, []], Aurora.Probe = _ref[0], Aurora.Probes = _ref[1];
  AIFFProbe = (function() {
    __extends(AIFFProbe, Probe);
    function AIFFProbe() {
      AIFFProbe.__super__.constructor.call(this);
      this.minimumLength = 12;
    }
    AIFFProbe.prototype.probe = function(buffer) {
      if (CSCompare(buffer, 0, CSStringToBuffer('FORM'), 0, 4)) {
        if (CSCompare(buffer, 8, CSStringToBuffer('AIFF'), 0, 4)) {
          return 1.0;
        } else if (CSCompare(buffer, 8, CSStringToBuffer('AIFC'), 0, 4)) {
          return 1.0;
        }
      }
      return 0.0;
    };
    return AIFFProbe;
  })();
  Aurora.Probes.push(AIFFProbe);
  AVI = {};
  AVI.Headers = [CSStringToBuffer('RIFFAVI '), CSStringToBuffer('RIFFAVIX'), CSStringToBuffer('RIFFAVI'), CSStringToBuffer('ON2 ON2f'), CSStringToBuffer('RIFFAMV ')];
  AVIProbe = (function() {
    __extends(AVIProbe, Probe);
    function AVIProbe() {
      AVIProbe.__super__.constructor.call(this);
      this.minimumLength = 12;
    }
    AVIProbe.prototype.probe = function(buffer) {
      var header, _i, _len, _ref2;
      _ref2 = AVI.Headers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        header = _ref2[_i];
        if (CSCompare(buffer, 0, header, 0, 4)) {
          if (CSCompare(buffer, 8, header, 4, 4)) {
            return 1.0;
          }
        }
      }
      return 0.0;
    };
    return AVIProbe;
  })();
  Aurora.Probes.push(AVIProbe);
  CAFProbe = (function() {
    __extends(CAFProbe, Probe);
    function CAFProbe() {
      CAFProbe.__super__.constructor.call(this);
      this.minimumLength = 6;
    }
    CAFProbe.prototype.probe = function(buffer) {
      if (CSCompare(buffer, 0, CSStringToBuffer('caff\0\1'), 0, 6)) {
        return 1.0;
      }
      return 0.0;
    };
    return CAFProbe;
  })();
  Aurora.Probes.push(CAFProbe);
  FLACProbe = (function() {
    __extends(FLACProbe, Probe);
    function FLACProbe() {
      FLACProbe.__super__.constructor.call(this);
      this.minimumLength = 4;
    }
    FLACProbe.prototype.probe = function(buffer) {
      if (CSCompare(buffer, 0, CSStringToBuffer('fLaC'), 0, 4)) {
        return 0.5;
      }
      return 0.0;
    };
    return FLACProbe;
  })();
  Aurora.Probes.push(FLACProbe);
  Matroska = {};
  Matroska.Doctypes = [CSStringToBuffer('matroska'), CSStringToBuffer('webm')];
  MatroskaProbe = (function() {
    __extends(MatroskaProbe, Probe);
    function MatroskaProbe() {
      MatroskaProbe.__super__.constructor.call(this);
      this.minimumLength = 128;
    }
    MatroskaProbe.prototype.probe = function(buffer) {
      var array, doctype, i, mask, n, size, total, _i, _len, _ref2, _ref3, _ref4, _ref5;
      _ref2 = [0, 1, 1, 0x80], total = _ref2[0], size = _ref2[1], n = _ref2[2], mask = _ref2[3];
      if (new Int32Array(buffer)[0] !== CSBig32ToNative(0x1A45DFA3)) {
        return 0.0;
      }
      array = new Uint8Array(buffer);
      total = array[4];
      while (size <= 8 && !(total & mask)) {
        size += 1;
        mask >>= 1;
      }
      if (size > 8) {
        return 0.0;
      }
      total &= mask - 1;
      for (i = 0; i < size; i += 1) {
        total = (total << 8) | array[4 + i];
      }
      if (buffer.byteLength < 4 + size + total) {
        throw 'Too small buffer';
      }
      _ref3 = Matroska.Doctypes;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        doctype = _ref3[_i];
        for (n = _ref4 = doctype.byteLength, _ref5 = 4 + size + total - doctype.byteLength; n <= _ref5; n += 1) {
          if (CSCompare(buffer, n, doctype, 0, doctype.byteLength)) {
            return 1.0;
          }
        }
      }
      return 0.5;
    };
    return MatroskaProbe;
  })();
  Aurora.Probes.push(MatroskaProbe);
  OggProbe = (function() {
    __extends(OggProbe, Probe);
    function OggProbe() {
      OggProbe.__super__.constructor.call(this);
      this.minimumLength = 6;
    }
    OggProbe.prototype.probe = function(buffer) {
      var array;
      if (CSCompare(buffer, 0, CSStringToBuffer('OggS'), 0, 4)) {
        array = new Uint8Array(buffer);
        if (array[4] === 0 && array[5] <= 0x07) {
          return 1.0;
        }
      }
      return 0.0;
    };
    return OggProbe;
  })();
  Aurora.Probes.push(OggProbe);
  TTAProbe = (function() {
    __extends(TTAProbe, Probe);
    function TTAProbe() {
      TTAProbe.__super__.constructor.call(this);
      this.minimumLength = 4;
    }
    TTAProbe.prototype.probe = function(buffer) {
      if (CSCompare(buffer, 0, CSStringToBuffer('TTA1'), 0, 4)) {
        return 0.5;
      }
      return 0.0;
    };
    return TTAProbe;
  })();
  Aurora.Probes.push(TTAProbe);
  WAV32Probe = (function() {
    __extends(WAV32Probe, Probe);
    function WAV32Probe() {
      WAV32Probe.__super__.constructor.call(this);
      this.minimumLength = 12;
    }
    WAV32Probe.prototype.probe = function(buffer) {
      if (CSCompare(buffer, 0, CSStringToBuffer('RIFF'), 0, 4)) {
        if (CSCompare(buffer, 8, CSStringToBuffer('WAVE'), 0, 4)) {
          return 0.9;
        }
      }
      return 0.0;
    };
    return WAV32Probe;
  })();
  WAV64Probe = (function() {
    __extends(WAV64Probe, Probe);
    function WAV64Probe() {
      WAV64Probe.__super__.constructor.call(this);
      this.minimumLength = 16;
    }
    WAV64Probe.prototype.probe = function(buffer) {
      if (CSCompare(buffer, 0, CSStringToBuffer('RF64'), 0, 4)) {
        if (CSCompare(buffer, 12, CSStringToBuffer('ds64'), 0, 4)) {
          return 1.0;
        }
      }
      return 0.0;
    };
    return WAV64Probe;
  })();
  Aurora.Probes.push(WAV32Probe);
  Aurora.Probes.push(WAV64Probe);
}).call(this);
