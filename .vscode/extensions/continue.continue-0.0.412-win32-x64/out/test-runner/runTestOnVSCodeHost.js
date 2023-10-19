"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/listenercount/index.js
var require_listenercount = __commonJS({
  "node_modules/listenercount/index.js"(exports2, module2) {
    "use strict";
    var listenerCount = require("events").listenerCount;
    listenerCount = listenerCount || function(ee, event) {
      var listeners = ee && ee._events && ee._events[event];
      if (Array.isArray(listeners)) {
        return listeners.length;
      } else if (typeof listeners === "function") {
        return 1;
      } else {
        return 0;
      }
    };
    module2.exports = listenerCount;
  }
});

// node_modules/buffer-indexof-polyfill/init-buffer.js
var require_init_buffer = __commonJS({
  "node_modules/buffer-indexof-polyfill/init-buffer.js"(exports2, module2) {
    module2.exports = function initBuffer(val) {
      var nodeVersion = process && process.version ? process.version : "v5.0.0";
      var major = nodeVersion.split(".")[0].replace("v", "");
      return major < 6 ? new Buffer(val) : Buffer.from(val);
    };
  }
});

// node_modules/buffer-indexof-polyfill/index.js
var require_buffer_indexof_polyfill = __commonJS({
  "node_modules/buffer-indexof-polyfill/index.js"() {
    "use strict";
    var initBuffer = require_init_buffer();
    if (!Buffer.prototype.indexOf) {
      Buffer.prototype.indexOf = function(value, offset) {
        offset = offset || 0;
        if (typeof value === "string" || value instanceof String) {
          value = initBuffer(value);
        } else if (typeof value === "number" || value instanceof Number) {
          value = initBuffer([value]);
        }
        var len = value.length;
        for (var i = offset; i <= this.length - len; i++) {
          var mismatch = false;
          for (var j = 0; j < len; j++) {
            if (this[i + j] != value[j]) {
              mismatch = true;
              break;
            }
          }
          if (!mismatch) {
            return i;
          }
        }
        return -1;
      };
    }
    function bufferLastIndexOf(value, offset) {
      if (typeof value === "string" || value instanceof String) {
        value = initBuffer(value);
      } else if (typeof value === "number" || value instanceof Number) {
        value = initBuffer([value]);
      }
      var len = value.length;
      offset = offset || this.length - len;
      for (var i = offset; i >= 0; i--) {
        var mismatch = false;
        for (var j = 0; j < len; j++) {
          if (this[i + j] != value[j]) {
            mismatch = true;
            break;
          }
        }
        if (!mismatch) {
          return i;
        }
      }
      return -1;
    }
    if (Buffer.prototype.lastIndexOf) {
      if (initBuffer("ABC").lastIndexOf("ABC") === -1)
        Buffer.prototype.lastIndexOf = bufferLastIndexOf;
    } else {
      Buffer.prototype.lastIndexOf = bufferLastIndexOf;
    }
  }
});

// node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS({
  "node_modules/setimmediate/setImmediate.js"(exports2) {
    (function(global2, undefined2) {
      "use strict";
      if (global2.setImmediate) {
        return;
      }
      var nextHandle = 1;
      var tasksByHandle = {};
      var currentlyRunningATask = false;
      var doc = global2.document;
      var registerImmediate;
      function setImmediate2(callback) {
        if (typeof callback !== "function") {
          callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
        }
        var task = { callback, args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
      }
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
          case 0:
            callback();
            break;
          case 1:
            callback(args[0]);
            break;
          case 2:
            callback(args[0], args[1]);
            break;
          case 3:
            callback(args[0], args[1], args[2]);
            break;
          default:
            callback.apply(undefined2, args);
            break;
        }
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask) {
          setTimeout(runIfPresent, 0, handle);
        } else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = true;
            try {
              run(task);
            } finally {
              clearImmediate(handle);
              currentlyRunningATask = false;
            }
          }
        }
      }
      function installNextTickImplementation() {
        registerImmediate = function(handle) {
          process.nextTick(function() {
            runIfPresent(handle);
          });
        };
      }
      function canUsePostMessage() {
        if (global2.postMessage && !global2.importScripts) {
          var postMessageIsAsynchronous = true;
          var oldOnMessage = global2.onmessage;
          global2.onmessage = function() {
            postMessageIsAsynchronous = false;
          };
          global2.postMessage("", "*");
          global2.onmessage = oldOnMessage;
          return postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
          if (event.source === global2 && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        if (global2.addEventListener) {
          global2.addEventListener("message", onGlobalMessage, false);
        } else {
          global2.attachEvent("onmessage", onGlobalMessage);
        }
        registerImmediate = function(handle) {
          global2.postMessage(messagePrefix + handle, "*");
        };
      }
      function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        };
        registerImmediate = function(handle) {
          channel.port2.postMessage(handle);
        };
      }
      function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
          var script = doc.createElement("script");
          script.onreadystatechange = function() {
            runIfPresent(handle);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
          };
          html.appendChild(script);
        };
      }
      function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
          setTimeout(runIfPresent, 0, handle);
        };
      }
      var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
      attachTo = attachTo && attachTo.setTimeout ? attachTo : global2;
      if ({}.toString.call(global2.process) === "[object process]") {
        installNextTickImplementation();
      } else if (canUsePostMessage()) {
        installPostMessageImplementation();
      } else if (global2.MessageChannel) {
        installMessageChannelImplementation();
      } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
      } else {
        installSetTimeoutImplementation();
      }
      attachTo.setImmediate = setImmediate2;
      attachTo.clearImmediate = clearImmediate;
    })(typeof self === "undefined" ? typeof global === "undefined" ? exports2 : global : self);
  }
});

// node_modules/traverse/index.js
var require_traverse = __commonJS({
  "node_modules/traverse/index.js"(exports2, module2) {
    module2.exports = Traverse;
    function Traverse(obj2) {
      if (!(this instanceof Traverse))
        return new Traverse(obj2);
      this.value = obj2;
    }
    Traverse.prototype.get = function(ps) {
      var node = this.value;
      for (var i = 0; i < ps.length; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) {
          node = void 0;
          break;
        }
        node = node[key];
      }
      return node;
    };
    Traverse.prototype.set = function(ps, value) {
      var node = this.value;
      for (var i = 0; i < ps.length - 1; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key))
          node[key] = {};
        node = node[key];
      }
      node[ps[i]] = value;
      return value;
    };
    Traverse.prototype.map = function(cb) {
      return walk(this.value, cb, true);
    };
    Traverse.prototype.forEach = function(cb) {
      this.value = walk(this.value, cb, false);
      return this.value;
    };
    Traverse.prototype.reduce = function(cb, init) {
      var skip = arguments.length === 1;
      var acc = skip ? this.value : init;
      this.forEach(function(x) {
        if (!this.isRoot || !skip) {
          acc = cb.call(this, acc, x);
        }
      });
      return acc;
    };
    Traverse.prototype.deepEqual = function(obj2) {
      if (arguments.length !== 1) {
        throw new Error(
          "deepEqual requires exactly one object to compare against"
        );
      }
      var equal = true;
      var node = obj2;
      this.forEach(function(y) {
        var notEqual = function() {
          equal = false;
          return void 0;
        }.bind(this);
        if (!this.isRoot) {
          if (typeof node !== "object")
            return notEqual();
          node = node[this.key];
        }
        var x = node;
        this.post(function() {
          node = x;
        });
        var toS = function(o) {
          return Object.prototype.toString.call(o);
        };
        if (this.circular) {
          if (Traverse(obj2).get(this.circular.path) !== x)
            notEqual();
        } else if (typeof x !== typeof y) {
          notEqual();
        } else if (x === null || y === null || x === void 0 || y === void 0) {
          if (x !== y)
            notEqual();
        } else if (x.__proto__ !== y.__proto__) {
          notEqual();
        } else if (x === y) {
        } else if (typeof x === "function") {
          if (x instanceof RegExp) {
            if (x.toString() != y.toString())
              notEqual();
          } else if (x !== y)
            notEqual();
        } else if (typeof x === "object") {
          if (toS(y) === "[object Arguments]" || toS(x) === "[object Arguments]") {
            if (toS(x) !== toS(y)) {
              notEqual();
            }
          } else if (x instanceof Date || y instanceof Date) {
            if (!(x instanceof Date) || !(y instanceof Date) || x.getTime() !== y.getTime()) {
              notEqual();
            }
          } else {
            var kx = Object.keys(x);
            var ky = Object.keys(y);
            if (kx.length !== ky.length)
              return notEqual();
            for (var i = 0; i < kx.length; i++) {
              var k = kx[i];
              if (!Object.hasOwnProperty.call(y, k)) {
                notEqual();
              }
            }
          }
        }
      });
      return equal;
    };
    Traverse.prototype.paths = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.path);
      });
      return acc;
    };
    Traverse.prototype.nodes = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.node);
      });
      return acc;
    };
    Traverse.prototype.clone = function() {
      var parents = [], nodes = [];
      return function clone(src) {
        for (var i = 0; i < parents.length; i++) {
          if (parents[i] === src) {
            return nodes[i];
          }
        }
        if (typeof src === "object" && src !== null) {
          var dst = copy(src);
          parents.push(src);
          nodes.push(dst);
          Object.keys(src).forEach(function(key) {
            dst[key] = clone(src[key]);
          });
          parents.pop();
          nodes.pop();
          return dst;
        } else {
          return src;
        }
      }(this.value);
    };
    function walk(root, cb, immutable) {
      var path2 = [];
      var parents = [];
      var alive = true;
      return function walker(node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        var state = {
          node,
          node_,
          path: [].concat(path2),
          parent: parents.slice(-1)[0],
          key: path2.slice(-1)[0],
          isRoot: path2.length === 0,
          level: path2.length,
          circular: null,
          update: function(x) {
            if (!state.isRoot) {
              state.parent.node[state.key] = x;
            }
            state.node = x;
          },
          "delete": function() {
            delete state.parent.node[state.key];
          },
          remove: function() {
            if (Array.isArray(state.parent.node)) {
              state.parent.node.splice(state.key, 1);
            } else {
              delete state.parent.node[state.key];
            }
          },
          before: function(f) {
            modifiers.before = f;
          },
          after: function(f) {
            modifiers.after = f;
          },
          pre: function(f) {
            modifiers.pre = f;
          },
          post: function(f) {
            modifiers.post = f;
          },
          stop: function() {
            alive = false;
          }
        };
        if (!alive)
          return state;
        if (typeof node === "object" && node !== null) {
          state.isLeaf = Object.keys(node).length == 0;
          for (var i = 0; i < parents.length; i++) {
            if (parents[i].node_ === node_) {
              state.circular = parents[i];
              break;
            }
          }
        } else {
          state.isLeaf = true;
        }
        state.notLeaf = !state.isLeaf;
        state.notRoot = !state.isRoot;
        var ret2 = cb.call(state, state.node);
        if (ret2 !== void 0 && state.update)
          state.update(ret2);
        if (modifiers.before)
          modifiers.before.call(state, state.node);
        if (typeof state.node == "object" && state.node !== null && !state.circular) {
          parents.push(state);
          var keys = Object.keys(state.node);
          keys.forEach(function(key, i2) {
            path2.push(key);
            if (modifiers.pre)
              modifiers.pre.call(state, state.node[key], key);
            var child = walker(state.node[key]);
            if (immutable && Object.hasOwnProperty.call(state.node, key)) {
              state.node[key] = child.node;
            }
            child.isLast = i2 == keys.length - 1;
            child.isFirst = i2 == 0;
            if (modifiers.post)
              modifiers.post.call(state, child);
            path2.pop();
          });
          parents.pop();
        }
        if (modifiers.after)
          modifiers.after.call(state, state.node);
        return state;
      }(root).node;
    }
    Object.keys(Traverse.prototype).forEach(function(key) {
      Traverse[key] = function(obj2) {
        var args = [].slice.call(arguments, 1);
        var t = Traverse(obj2);
        return t[key].apply(t, args);
      };
    });
    function copy(src) {
      if (typeof src === "object" && src !== null) {
        var dst;
        if (Array.isArray(src)) {
          dst = [];
        } else if (src instanceof Date) {
          dst = new Date(src);
        } else if (src instanceof Boolean) {
          dst = new Boolean(src);
        } else if (src instanceof Number) {
          dst = new Number(src);
        } else if (src instanceof String) {
          dst = new String(src);
        } else {
          dst = Object.create(Object.getPrototypeOf(src));
        }
        Object.keys(src).forEach(function(key) {
          dst[key] = src[key];
        });
        return dst;
      } else
        return src;
    }
  }
});

// node_modules/chainsaw/index.js
var require_chainsaw = __commonJS({
  "node_modules/chainsaw/index.js"(exports2, module2) {
    var Traverse = require_traverse();
    var EventEmitter = require("events").EventEmitter;
    module2.exports = Chainsaw;
    function Chainsaw(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0)
        saw.handlers = r;
      saw.record();
      return saw.chain();
    }
    Chainsaw.light = function ChainsawLight(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0)
        saw.handlers = r;
      return saw.chain();
    };
    Chainsaw.saw = function(builder, handlers) {
      var saw = new EventEmitter();
      saw.handlers = handlers;
      saw.actions = [];
      saw.chain = function() {
        var ch = Traverse(saw.handlers).map(function(node) {
          if (this.isRoot)
            return node;
          var ps = this.path;
          if (typeof node === "function") {
            this.update(function() {
              saw.actions.push({
                path: ps,
                args: [].slice.call(arguments)
              });
              return ch;
            });
          }
        });
        process.nextTick(function() {
          saw.emit("begin");
          saw.next();
        });
        return ch;
      };
      saw.pop = function() {
        return saw.actions.shift();
      };
      saw.next = function() {
        var action = saw.pop();
        if (!action) {
          saw.emit("end");
        } else if (!action.trap) {
          var node = saw.handlers;
          action.path.forEach(function(key) {
            node = node[key];
          });
          node.apply(saw.handlers, action.args);
        }
      };
      saw.nest = function(cb) {
        var args = [].slice.call(arguments, 1);
        var autonext = true;
        if (typeof cb === "boolean") {
          var autonext = cb;
          cb = args.shift();
        }
        var s = Chainsaw.saw(builder, {});
        var r = builder.call(s.handlers, s);
        if (r !== void 0)
          s.handlers = r;
        if ("undefined" !== typeof saw.step) {
          s.record();
        }
        cb.apply(s.chain(), args);
        if (autonext !== false)
          s.on("end", saw.next);
      };
      saw.record = function() {
        upgradeChainsaw(saw);
      };
      ["trap", "down", "jump"].forEach(function(method) {
        saw[method] = function() {
          throw new Error("To use the trap, down and jump features, please call record() first to start recording actions.");
        };
      });
      return saw;
    };
    function upgradeChainsaw(saw) {
      saw.step = 0;
      saw.pop = function() {
        return saw.actions[saw.step++];
      };
      saw.trap = function(name, cb) {
        var ps = Array.isArray(name) ? name : [name];
        saw.actions.push({
          path: ps,
          step: saw.step,
          cb,
          trap: true
        });
      };
      saw.down = function(name) {
        var ps = (Array.isArray(name) ? name : [name]).join("/");
        var i = saw.actions.slice(saw.step).map(function(x) {
          if (x.trap && x.step <= saw.step)
            return false;
          return x.path.join("/") == ps;
        }).indexOf(true);
        if (i >= 0)
          saw.step += i;
        else
          saw.step = saw.actions.length;
        var act = saw.actions[saw.step - 1];
        if (act && act.trap) {
          saw.step = act.step;
          act.cb();
        } else
          saw.next();
      };
      saw.jump = function(step) {
        saw.step = step;
        saw.next();
      };
    }
  }
});

// node_modules/buffers/index.js
var require_buffers = __commonJS({
  "node_modules/buffers/index.js"(exports2, module2) {
    module2.exports = Buffers;
    function Buffers(bufs) {
      if (!(this instanceof Buffers))
        return new Buffers(bufs);
      this.buffers = bufs || [];
      this.length = this.buffers.reduce(function(size, buf) {
        return size + buf.length;
      }, 0);
    }
    Buffers.prototype.push = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to push a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.push(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.unshift = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to unshift a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.unshift(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.copy = function(dst, dStart, start, end) {
      return this.slice(start, end).copy(dst, dStart, 0, end - start);
    };
    Buffers.prototype.splice = function(i, howMany) {
      var buffers = this.buffers;
      var index = i >= 0 ? i : this.length - i;
      var reps = [].slice.call(arguments, 2);
      if (howMany === void 0) {
        howMany = this.length - index;
      } else if (howMany > this.length - index) {
        howMany = this.length - index;
      }
      for (var i = 0; i < reps.length; i++) {
        this.length += reps[i].length;
      }
      var removed = new Buffers();
      var bytes = 0;
      var startBytes = 0;
      for (var ii = 0; ii < buffers.length && startBytes + buffers[ii].length < index; ii++) {
        startBytes += buffers[ii].length;
      }
      if (index - startBytes > 0) {
        var start = index - startBytes;
        if (start + howMany < buffers[ii].length) {
          removed.push(buffers[ii].slice(start, start + howMany));
          var orig = buffers[ii];
          var buf0 = new Buffer(start);
          for (var i = 0; i < start; i++) {
            buf0[i] = orig[i];
          }
          var buf1 = new Buffer(orig.length - start - howMany);
          for (var i = start + howMany; i < orig.length; i++) {
            buf1[i - howMany - start] = orig[i];
          }
          if (reps.length > 0) {
            var reps_ = reps.slice();
            reps_.unshift(buf0);
            reps_.push(buf1);
            buffers.splice.apply(buffers, [ii, 1].concat(reps_));
            ii += reps_.length;
            reps = [];
          } else {
            buffers.splice(ii, 1, buf0, buf1);
            ii += 2;
          }
        } else {
          removed.push(buffers[ii].slice(start));
          buffers[ii] = buffers[ii].slice(0, start);
          ii++;
        }
      }
      if (reps.length > 0) {
        buffers.splice.apply(buffers, [ii, 0].concat(reps));
        ii += reps.length;
      }
      while (removed.length < howMany) {
        var buf = buffers[ii];
        var len = buf.length;
        var take = Math.min(len, howMany - removed.length);
        if (take === len) {
          removed.push(buf);
          buffers.splice(ii, 1);
        } else {
          removed.push(buf.slice(0, take));
          buffers[ii] = buffers[ii].slice(take);
        }
      }
      this.length -= removed.length;
      return removed;
    };
    Buffers.prototype.slice = function(i, j) {
      var buffers = this.buffers;
      if (j === void 0)
        j = this.length;
      if (i === void 0)
        i = 0;
      if (j > this.length)
        j = this.length;
      var startBytes = 0;
      for (var si = 0; si < buffers.length && startBytes + buffers[si].length <= i; si++) {
        startBytes += buffers[si].length;
      }
      var target = new Buffer(j - i);
      var ti = 0;
      for (var ii = si; ti < j - i && ii < buffers.length; ii++) {
        var len = buffers[ii].length;
        var start = ti === 0 ? i - startBytes : 0;
        var end = ti + len >= j - i ? Math.min(start + (j - i) - ti, len) : len;
        buffers[ii].copy(target, ti, start, end);
        ti += end - start;
      }
      return target;
    };
    Buffers.prototype.pos = function(i) {
      if (i < 0 || i >= this.length)
        throw new Error("oob");
      var l2 = i, bi = 0, bu = null;
      for (; ; ) {
        bu = this.buffers[bi];
        if (l2 < bu.length) {
          return { buf: bi, offset: l2 };
        } else {
          l2 -= bu.length;
        }
        bi++;
      }
    };
    Buffers.prototype.get = function get(i) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].get(pos.offset);
    };
    Buffers.prototype.set = function set(i, b) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].set(pos.offset, b);
    };
    Buffers.prototype.indexOf = function(needle, offset) {
      if ("string" === typeof needle) {
        needle = new Buffer(needle);
      } else if (needle instanceof Buffer) {
      } else {
        throw new Error("Invalid type for a search string");
      }
      if (!needle.length) {
        return 0;
      }
      if (!this.length) {
        return -1;
      }
      var i = 0, j = 0, match = 0, mstart, pos = 0;
      if (offset) {
        var p = this.pos(offset);
        i = p.buf;
        j = p.offset;
        pos = offset;
      }
      for (; ; ) {
        while (j >= this.buffers[i].length) {
          j = 0;
          i++;
          if (i >= this.buffers.length) {
            return -1;
          }
        }
        var char = this.buffers[i][j];
        if (char == needle[match]) {
          if (match == 0) {
            mstart = {
              i,
              j,
              pos
            };
          }
          match++;
          if (match == needle.length) {
            return mstart.pos;
          }
        } else if (match != 0) {
          i = mstart.i;
          j = mstart.j;
          pos = mstart.pos;
          match = 0;
        }
        j++;
        pos++;
      }
    };
    Buffers.prototype.toBuffer = function() {
      return this.slice();
    };
    Buffers.prototype.toString = function(encoding, start, end) {
      return this.slice(start, end).toString(encoding);
    };
  }
});

// node_modules/binary/lib/vars.js
var require_vars = __commonJS({
  "node_modules/binary/lib/vars.js"(exports2, module2) {
    module2.exports = function(store) {
      function getset(name, value) {
        var node = vars.store;
        var keys = name.split(".");
        keys.slice(0, -1).forEach(function(k) {
          if (node[k] === void 0)
            node[k] = {};
          node = node[k];
        });
        var key = keys[keys.length - 1];
        if (arguments.length == 1) {
          return node[key];
        } else {
          return node[key] = value;
        }
      }
      var vars = {
        get: function(name) {
          return getset(name);
        },
        set: function(name, value) {
          return getset(name, value);
        },
        store: store || {}
      };
      return vars;
    };
  }
});

// node_modules/binary/index.js
var require_binary = __commonJS({
  "node_modules/binary/index.js"(exports2, module2) {
    var Chainsaw = require_chainsaw();
    var EventEmitter = require("events").EventEmitter;
    var Buffers = require_buffers();
    var Vars = require_vars();
    var Stream = require("stream").Stream;
    exports2 = module2.exports = function(bufOrEm, eventName) {
      if (Buffer.isBuffer(bufOrEm)) {
        return exports2.parse(bufOrEm);
      }
      var s = exports2.stream();
      if (bufOrEm && bufOrEm.pipe) {
        bufOrEm.pipe(s);
      } else if (bufOrEm) {
        bufOrEm.on(eventName || "data", function(buf) {
          s.write(buf);
        });
        bufOrEm.on("end", function() {
          s.end();
        });
      }
      return s;
    };
    exports2.stream = function(input) {
      if (input)
        return exports2.apply(null, arguments);
      var pending = null;
      function getBytes(bytes, cb, skip) {
        pending = {
          bytes,
          skip,
          cb: function(buf) {
            pending = null;
            cb(buf);
          }
        };
        dispatch();
      }
      var offset = null;
      function dispatch() {
        if (!pending) {
          if (caughtEnd)
            done = true;
          return;
        }
        if (typeof pending === "function") {
          pending();
        } else {
          var bytes = offset + pending.bytes;
          if (buffers.length >= bytes) {
            var buf;
            if (offset == null) {
              buf = buffers.splice(0, bytes);
              if (!pending.skip) {
                buf = buf.slice();
              }
            } else {
              if (!pending.skip) {
                buf = buffers.slice(offset, bytes);
              }
              offset = bytes;
            }
            if (pending.skip) {
              pending.cb();
            } else {
              pending.cb(buf);
            }
          }
        }
      }
      function builder(saw) {
        function next() {
          if (!done)
            saw.next();
        }
        var self2 = words(function(bytes, cb) {
          return function(name) {
            getBytes(bytes, function(buf) {
              vars.set(name, cb(buf));
              next();
            });
          };
        });
        self2.tap = function(cb) {
          saw.nest(cb, vars.store);
        };
        self2.into = function(key, cb) {
          if (!vars.get(key))
            vars.set(key, {});
          var parent = vars;
          vars = Vars(parent.get(key));
          saw.nest(function() {
            cb.apply(this, arguments);
            this.tap(function() {
              vars = parent;
            });
          }, vars.store);
        };
        self2.flush = function() {
          vars.store = {};
          next();
        };
        self2.loop = function(cb) {
          var end = false;
          saw.nest(false, function loop() {
            this.vars = vars.store;
            cb.call(this, function() {
              end = true;
              next();
            }, vars.store);
            this.tap(function() {
              if (end)
                saw.next();
              else
                loop.call(this);
            }.bind(this));
          }, vars.store);
        };
        self2.buffer = function(name, bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function(buf) {
            vars.set(name, buf);
            next();
          });
        };
        self2.skip = function(bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function() {
            next();
          });
        };
        self2.scan = function find(name, search) {
          if (typeof search === "string") {
            search = new Buffer(search);
          } else if (!Buffer.isBuffer(search)) {
            throw new Error("search must be a Buffer or a string");
          }
          var taken = 0;
          pending = function() {
            var pos = buffers.indexOf(search, offset + taken);
            var i = pos - offset - taken;
            if (pos !== -1) {
              pending = null;
              if (offset != null) {
                vars.set(
                  name,
                  buffers.slice(offset, offset + taken + i)
                );
                offset += taken + i + search.length;
              } else {
                vars.set(
                  name,
                  buffers.slice(0, taken + i)
                );
                buffers.splice(0, taken + i + search.length);
              }
              next();
              dispatch();
            } else {
              i = Math.max(buffers.length - search.length - offset - taken, 0);
            }
            taken += i;
          };
          dispatch();
        };
        self2.peek = function(cb) {
          offset = 0;
          saw.nest(function() {
            cb.call(this, vars.store);
            this.tap(function() {
              offset = null;
            });
          });
        };
        return self2;
      }
      ;
      var stream = Chainsaw.light(builder);
      stream.writable = true;
      var buffers = Buffers();
      stream.write = function(buf) {
        buffers.push(buf);
        dispatch();
      };
      var vars = Vars();
      var done = false, caughtEnd = false;
      stream.end = function() {
        caughtEnd = true;
      };
      stream.pipe = Stream.prototype.pipe;
      Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function(name) {
        stream[name] = EventEmitter.prototype[name];
      });
      return stream;
    };
    exports2.parse = function parse(buffer) {
      var self2 = words(function(bytes, cb) {
        return function(name) {
          if (offset + bytes <= buffer.length) {
            var buf = buffer.slice(offset, offset + bytes);
            offset += bytes;
            vars.set(name, cb(buf));
          } else {
            vars.set(name, null);
          }
          return self2;
        };
      });
      var offset = 0;
      var vars = Vars();
      self2.vars = vars.store;
      self2.tap = function(cb) {
        cb.call(self2, vars.store);
        return self2;
      };
      self2.into = function(key, cb) {
        if (!vars.get(key)) {
          vars.set(key, {});
        }
        var parent = vars;
        vars = Vars(parent.get(key));
        cb.call(self2, vars.store);
        vars = parent;
        return self2;
      };
      self2.loop = function(cb) {
        var end = false;
        var ender = function() {
          end = true;
        };
        while (end === false) {
          cb.call(self2, ender, vars.store);
        }
        return self2;
      };
      self2.buffer = function(name, size) {
        if (typeof size === "string") {
          size = vars.get(size);
        }
        var buf = buffer.slice(offset, Math.min(buffer.length, offset + size));
        offset += size;
        vars.set(name, buf);
        return self2;
      };
      self2.skip = function(bytes) {
        if (typeof bytes === "string") {
          bytes = vars.get(bytes);
        }
        offset += bytes;
        return self2;
      };
      self2.scan = function(name, search) {
        if (typeof search === "string") {
          search = new Buffer(search);
        } else if (!Buffer.isBuffer(search)) {
          throw new Error("search must be a Buffer or a string");
        }
        vars.set(name, null);
        for (var i = 0; i + offset <= buffer.length - search.length + 1; i++) {
          for (var j = 0; j < search.length && buffer[offset + i + j] === search[j]; j++)
            ;
          if (j === search.length)
            break;
        }
        vars.set(name, buffer.slice(offset, offset + i));
        offset += i + search.length;
        return self2;
      };
      self2.peek = function(cb) {
        var was = offset;
        cb.call(self2, vars.store);
        offset = was;
        return self2;
      };
      self2.flush = function() {
        vars.store = {};
        return self2;
      };
      self2.eof = function() {
        return offset >= buffer.length;
      };
      return self2;
    };
    function decodeLEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, i) * bytes[i];
      }
      return acc;
    }
    function decodeBEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
      }
      return acc;
    }
    function decodeBEs(bytes) {
      var val = decodeBEu(bytes);
      if ((bytes[0] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function decodeLEs(bytes) {
      var val = decodeLEu(bytes);
      if ((bytes[bytes.length - 1] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function words(decode) {
      var self2 = {};
      [1, 2, 4, 8].forEach(function(bytes) {
        var bits = bytes * 8;
        self2["word" + bits + "le"] = self2["word" + bits + "lu"] = decode(bytes, decodeLEu);
        self2["word" + bits + "ls"] = decode(bytes, decodeLEs);
        self2["word" + bits + "be"] = self2["word" + bits + "bu"] = decode(bytes, decodeBEu);
        self2["word" + bits + "bs"] = decode(bytes, decodeBEs);
      });
      self2.word8 = self2.word8u = self2.word8be;
      self2.word8s = self2.word8bs;
      return self2;
    }
  }
});

// node_modules/bluebird/js/release/es5.js
var require_es5 = __commonJS({
  "node_modules/bluebird/js/release/es5.js"(exports2, module2) {
    var isES5 = function() {
      "use strict";
      return this === void 0;
    }();
    if (isES5) {
      module2.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5,
        propertyIsWritable: function(obj2, prop) {
          var descriptor = Object.getOwnPropertyDescriptor(obj2, prop);
          return !!(!descriptor || descriptor.writable || descriptor.set);
        }
      };
    } else {
      has = {}.hasOwnProperty;
      str = {}.toString;
      proto = {}.constructor.prototype;
      ObjectKeys = function(o) {
        var ret2 = [];
        for (var key in o) {
          if (has.call(o, key)) {
            ret2.push(key);
          }
        }
        return ret2;
      };
      ObjectGetDescriptor = function(o, key) {
        return { value: o[key] };
      };
      ObjectDefineProperty = function(o, key, desc) {
        o[key] = desc.value;
        return o;
      };
      ObjectFreeze = function(obj2) {
        return obj2;
      };
      ObjectGetPrototypeOf = function(obj2) {
        try {
          return Object(obj2).constructor.prototype;
        } catch (e) {
          return proto;
        }
      };
      ArrayIsArray = function(obj2) {
        try {
          return str.call(obj2) === "[object Array]";
        } catch (e) {
          return false;
        }
      };
      module2.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5,
        propertyIsWritable: function() {
          return true;
        }
      };
    }
    var has;
    var str;
    var proto;
    var ObjectKeys;
    var ObjectGetDescriptor;
    var ObjectDefineProperty;
    var ObjectFreeze;
    var ObjectGetPrototypeOf;
    var ArrayIsArray;
  }
});

// node_modules/bluebird/js/release/util.js
var require_util = __commonJS({
  "node_modules/bluebird/js/release/util.js"(exports, module) {
    "use strict";
    var es5 = require_es5();
    var canEvaluate = typeof navigator == "undefined";
    var errorObj = { e: {} };
    var tryCatchTarget;
    var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports !== void 0 ? exports : null;
    function tryCatcher() {
      try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    }
    function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
    }
    var inherits = function(Child, Parent) {
      var hasProp = {}.hasOwnProperty;
      function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
          if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
            this[propertyName + "$"] = Parent.prototype[propertyName];
          }
        }
      }
      T.prototype = Parent.prototype;
      Child.prototype = new T();
      return Child.prototype;
    };
    function isPrimitive(val) {
      return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
    }
    function isObject(value) {
      return typeof value === "function" || typeof value === "object" && value !== null;
    }
    function maybeWrapAsError(maybeError) {
      if (!isPrimitive(maybeError))
        return maybeError;
      return new Error(safeToString(maybeError));
    }
    function withAppended(target, appendee) {
      var len = target.length;
      var ret2 = new Array(len + 1);
      var i;
      for (i = 0; i < len; ++i) {
        ret2[i] = target[i];
      }
      ret2[i] = appendee;
      return ret2;
    }
    function getDataPropertyOrDefault(obj2, key, defaultValue) {
      if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj2, key);
        if (desc != null) {
          return desc.get == null && desc.set == null ? desc.value : defaultValue;
        }
      } else {
        return {}.hasOwnProperty.call(obj2, key) ? obj2[key] : void 0;
      }
    }
    function notEnumerableProp(obj2, name, value) {
      if (isPrimitive(obj2))
        return obj2;
      var descriptor = {
        value,
        configurable: true,
        enumerable: false,
        writable: true
      };
      es5.defineProperty(obj2, name, descriptor);
      return obj2;
    }
    function thrower(r) {
      throw r;
    }
    var inheritedDataKeys = function() {
      var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
      ];
      var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
          if (excludedPrototypes[i] === val) {
            return true;
          }
        }
        return false;
      };
      if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj2) {
          var ret2 = [];
          var visitedKeys = /* @__PURE__ */ Object.create(null);
          while (obj2 != null && !isExcludedProto(obj2)) {
            var keys;
            try {
              keys = getKeys(obj2);
            } catch (e) {
              return ret2;
            }
            for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              if (visitedKeys[key])
                continue;
              visitedKeys[key] = true;
              var desc = Object.getOwnPropertyDescriptor(obj2, key);
              if (desc != null && desc.get == null && desc.set == null) {
                ret2.push(key);
              }
            }
            obj2 = es5.getPrototypeOf(obj2);
          }
          return ret2;
        };
      } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj2) {
          if (isExcludedProto(obj2))
            return [];
          var ret2 = [];
          enumeration:
            for (var key in obj2) {
              if (hasProp.call(obj2, key)) {
                ret2.push(key);
              } else {
                for (var i = 0; i < excludedPrototypes.length; ++i) {
                  if (hasProp.call(excludedPrototypes[i], key)) {
                    continue enumeration;
                  }
                }
                ret2.push(key);
              }
            }
          return ret2;
        };
      }
    }();
    var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
    function isClass(fn) {
      try {
        if (typeof fn === "function") {
          var keys = es5.names(fn.prototype);
          var hasMethods = es5.isES5 && keys.length > 1;
          var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
          var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;
          if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    function toFastProperties(obj) {
      function FakeConstructor() {
      }
      FakeConstructor.prototype = obj;
      var l = 8;
      while (l--)
        new FakeConstructor();
      return obj;
      eval(obj);
    }
    var rident = /^[a-z$_][a-z$_0-9]*$/i;
    function isIdentifier(str) {
      return rident.test(str);
    }
    function filledRange(count, prefix, suffix) {
      var ret2 = new Array(count);
      for (var i = 0; i < count; ++i) {
        ret2[i] = prefix + i + suffix;
      }
      return ret2;
    }
    function safeToString(obj2) {
      try {
        return obj2 + "";
      } catch (e) {
        return "[no string representation]";
      }
    }
    function isError(obj2) {
      return obj2 !== null && typeof obj2 === "object" && typeof obj2.message === "string" && typeof obj2.name === "string";
    }
    function markAsOriginatingFromRejection(e) {
      try {
        notEnumerableProp(e, "isOperational", true);
      } catch (ignore) {
      }
    }
    function originatesFromRejection(e) {
      if (e == null)
        return false;
      return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
    }
    function canAttachTrace(obj2) {
      return isError(obj2) && es5.propertyIsWritable(obj2, "stack");
    }
    var ensureErrorObject = function() {
      if (!("stack" in new Error())) {
        return function(value) {
          if (canAttachTrace(value))
            return value;
          try {
            throw new Error(safeToString(value));
          } catch (err) {
            return err;
          }
        };
      } else {
        return function(value) {
          if (canAttachTrace(value))
            return value;
          return new Error(safeToString(value));
        };
      }
    }();
    function classString(obj2) {
      return {}.toString.call(obj2);
    }
    function copyDescriptors(from, to, filter) {
      var keys = es5.names(from);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
          try {
            es5.defineProperty(to, key, es5.getDescriptor(from, key));
          } catch (ignore) {
          }
        }
      }
    }
    var asArray = function(v) {
      if (es5.isArray(v)) {
        return v;
      }
      return null;
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
      } : function(v) {
        var ret2 = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!(itResult = it.next()).done) {
          ret2.push(itResult.value);
        }
        return ret2;
      };
      asArray = function(v) {
        if (es5.isArray(v)) {
          return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
          return ArrayFrom(v);
        }
        return null;
      };
    }
    var ArrayFrom;
    var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";
    var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";
    function env(key) {
      return hasEnvVariables ? process.env[key] : void 0;
    }
    function getNativePromise() {
      if (typeof Promise === "function") {
        try {
          var promise = new Promise(function() {
          });
          if ({}.toString.call(promise) === "[object Promise]") {
            return Promise;
          }
        } catch (e) {
        }
      }
    }
    function domainBind(self2, cb) {
      return self2.bind(cb);
    }
    var ret = {
      isClass,
      isIdentifier,
      inheritedDataKeys,
      getDataPropertyOrDefault,
      thrower,
      isArray: es5.isArray,
      asArray,
      notEnumerableProp,
      isPrimitive,
      isObject,
      isError,
      canEvaluate,
      errorObj,
      tryCatch,
      inherits,
      withAppended,
      maybeWrapAsError,
      toFastProperties,
      filledRange,
      toString: safeToString,
      canAttachTrace,
      ensureErrorObject,
      originatesFromRejection,
      markAsOriginatingFromRejection,
      classString,
      copyDescriptors,
      hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
      isNode,
      hasEnvVariables,
      env,
      global: globalObject,
      getNativePromise,
      domainBind
    };
    ret.isRecentNode = ret.isNode && function() {
      var version = process.versions.node.split(".").map(Number);
      return version[0] === 0 && version[1] > 10 || version[0] > 0;
    }();
    if (ret.isNode)
      ret.toFastProperties(process);
    try {
      throw new Error();
    } catch (e) {
      ret.lastLineError = e;
    }
    module.exports = ret;
  }
});

// node_modules/bluebird/js/release/schedule.js
var require_schedule = __commonJS({
  "node_modules/bluebird/js/release/schedule.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var schedule;
    var noAsyncScheduler = function() {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
    };
    var NativePromise = util.getNativePromise();
    if (util.isNode && typeof MutationObserver === "undefined") {
      GlobalSetImmediate = global.setImmediate;
      ProcessNextTick = process.nextTick;
      schedule = util.isRecentNode ? function(fn) {
        GlobalSetImmediate.call(global, fn);
      } : function(fn) {
        ProcessNextTick.call(process, fn);
      };
    } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
      nativePromise = NativePromise.resolve();
      schedule = function(fn) {
        nativePromise.then(fn);
      };
    } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova))) {
      schedule = function() {
        var div = document.createElement("div");
        var opts = { attributes: true };
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
          div.classList.toggle("foo");
          toggleScheduled = false;
        });
        o2.observe(div2, opts);
        var scheduleToggle = function() {
          if (toggleScheduled)
            return;
          toggleScheduled = true;
          div2.classList.toggle("foo");
        };
        return function schedule2(fn) {
          var o = new MutationObserver(function() {
            o.disconnect();
            fn();
          });
          o.observe(div, opts);
          scheduleToggle();
        };
      }();
    } else if (typeof setImmediate !== "undefined") {
      schedule = function(fn) {
        setImmediate(fn);
      };
    } else if (typeof setTimeout !== "undefined") {
      schedule = function(fn) {
        setTimeout(fn, 0);
      };
    } else {
      schedule = noAsyncScheduler;
    }
    var GlobalSetImmediate;
    var ProcessNextTick;
    var nativePromise;
    module2.exports = schedule;
  }
});

// node_modules/bluebird/js/release/queue.js
var require_queue = __commonJS({
  "node_modules/bluebird/js/release/queue.js"(exports2, module2) {
    "use strict";
    function arrayMove(src, srcIndex, dst, dstIndex, len) {
      for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
      }
    }
    function Queue(capacity) {
      this._capacity = capacity;
      this._length = 0;
      this._front = 0;
    }
    Queue.prototype._willBeOverCapacity = function(size) {
      return this._capacity < size;
    };
    Queue.prototype._pushOne = function(arg) {
      var length = this.length();
      this._checkCapacity(length + 1);
      var i = this._front + length & this._capacity - 1;
      this[i] = arg;
      this._length = length + 1;
    };
    Queue.prototype.push = function(fn, receiver, arg) {
      var length = this.length() + 3;
      if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
      }
      var j = this._front + length - 3;
      this._checkCapacity(length);
      var wrapMask = this._capacity - 1;
      this[j + 0 & wrapMask] = fn;
      this[j + 1 & wrapMask] = receiver;
      this[j + 2 & wrapMask] = arg;
      this._length = length;
    };
    Queue.prototype.shift = function() {
      var front = this._front, ret2 = this[front];
      this[front] = void 0;
      this._front = front + 1 & this._capacity - 1;
      this._length--;
      return ret2;
    };
    Queue.prototype.length = function() {
      return this._length;
    };
    Queue.prototype._checkCapacity = function(size) {
      if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
      }
    };
    Queue.prototype._resizeTo = function(capacity) {
      var oldCapacity = this._capacity;
      this._capacity = capacity;
      var front = this._front;
      var length = this._length;
      var moveItemsCount = front + length & oldCapacity - 1;
      arrayMove(this, 0, this, oldCapacity, moveItemsCount);
    };
    module2.exports = Queue;
  }
});

// node_modules/bluebird/js/release/async.js
var require_async = __commonJS({
  "node_modules/bluebird/js/release/async.js"(exports2, module2) {
    "use strict";
    var firstLineError;
    try {
      throw new Error();
    } catch (e) {
      firstLineError = e;
    }
    var schedule = require_schedule();
    var Queue = require_queue();
    var util = require_util();
    function Async() {
      this._customScheduler = false;
      this._isTickUsed = false;
      this._lateQueue = new Queue(16);
      this._normalQueue = new Queue(16);
      this._haveDrainedQueues = false;
      this._trampolineEnabled = true;
      var self2 = this;
      this.drainQueues = function() {
        self2._drainQueues();
      };
      this._schedule = schedule;
    }
    Async.prototype.setScheduler = function(fn) {
      var prev = this._schedule;
      this._schedule = fn;
      this._customScheduler = true;
      return prev;
    };
    Async.prototype.hasCustomScheduler = function() {
      return this._customScheduler;
    };
    Async.prototype.enableTrampoline = function() {
      this._trampolineEnabled = true;
    };
    Async.prototype.disableTrampolineIfNecessary = function() {
      if (util.hasDevTools) {
        this._trampolineEnabled = false;
      }
    };
    Async.prototype.haveItemsQueued = function() {
      return this._isTickUsed || this._haveDrainedQueues;
    };
    Async.prototype.fatalError = function(e, isNode2) {
      if (isNode2) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
        process.exit(2);
      } else {
        this.throwLater(e);
      }
    };
    Async.prototype.throwLater = function(fn, arg) {
      if (arguments.length === 1) {
        arg = fn;
        fn = function() {
          throw arg;
        };
      }
      if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
          fn(arg);
        }, 0);
      } else
        try {
          this._schedule(function() {
            fn(arg);
          });
        } catch (e) {
          throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
        }
    };
    function AsyncInvokeLater(fn, receiver, arg) {
      this._lateQueue.push(fn, receiver, arg);
      this._queueTick();
    }
    function AsyncInvoke(fn, receiver, arg) {
      this._normalQueue.push(fn, receiver, arg);
      this._queueTick();
    }
    function AsyncSettlePromises(promise) {
      this._normalQueue._pushOne(promise);
      this._queueTick();
    }
    if (!util.hasDevTools) {
      Async.prototype.invokeLater = AsyncInvokeLater;
      Async.prototype.invoke = AsyncInvoke;
      Async.prototype.settlePromises = AsyncSettlePromises;
    } else {
      Async.prototype.invokeLater = function(fn, receiver, arg) {
        if (this._trampolineEnabled) {
          AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
          this._schedule(function() {
            setTimeout(function() {
              fn.call(receiver, arg);
            }, 100);
          });
        }
      };
      Async.prototype.invoke = function(fn, receiver, arg) {
        if (this._trampolineEnabled) {
          AsyncInvoke.call(this, fn, receiver, arg);
        } else {
          this._schedule(function() {
            fn.call(receiver, arg);
          });
        }
      };
      Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
          AsyncSettlePromises.call(this, promise);
        } else {
          this._schedule(function() {
            promise._settlePromises();
          });
        }
      };
    }
    Async.prototype._drainQueue = function(queue) {
      while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
          fn._settlePromises();
          continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
      }
    };
    Async.prototype._drainQueues = function() {
      this._drainQueue(this._normalQueue);
      this._reset();
      this._haveDrainedQueues = true;
      this._drainQueue(this._lateQueue);
    };
    Async.prototype._queueTick = function() {
      if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
      }
    };
    Async.prototype._reset = function() {
      this._isTickUsed = false;
    };
    module2.exports = Async;
    module2.exports.firstLineError = firstLineError;
  }
});

// node_modules/bluebird/js/release/errors.js
var require_errors = __commonJS({
  "node_modules/bluebird/js/release/errors.js"(exports2, module2) {
    "use strict";
    var es52 = require_es5();
    var Objectfreeze = es52.freeze;
    var util = require_util();
    var inherits2 = util.inherits;
    var notEnumerableProp2 = util.notEnumerableProp;
    function subError(nameProperty, defaultMessage) {
      function SubError(message) {
        if (!(this instanceof SubError))
          return new SubError(message);
        notEnumerableProp2(
          this,
          "message",
          typeof message === "string" ? message : defaultMessage
        );
        notEnumerableProp2(this, "name", nameProperty);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        } else {
          Error.call(this);
        }
      }
      inherits2(SubError, Error);
      return SubError;
    }
    var _TypeError;
    var _RangeError;
    var Warning = subError("Warning", "warning");
    var CancellationError = subError("CancellationError", "cancellation error");
    var TimeoutError = subError("TimeoutError", "timeout error");
    var AggregateError = subError("AggregateError", "aggregate error");
    try {
      _TypeError = TypeError;
      _RangeError = RangeError;
    } catch (e) {
      _TypeError = subError("TypeError", "type error");
      _RangeError = subError("RangeError", "range error");
    }
    var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
    for (i = 0; i < methods.length; ++i) {
      if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
      }
    }
    var i;
    es52.defineProperty(AggregateError.prototype, "length", {
      value: 0,
      configurable: false,
      writable: true,
      enumerable: true
    });
    AggregateError.prototype["isOperational"] = true;
    var level = 0;
    AggregateError.prototype.toString = function() {
      var indent = Array(level * 4 + 1).join(" ");
      var ret2 = "\n" + indent + "AggregateError of:\n";
      level++;
      indent = Array(level * 4 + 1).join(" ");
      for (var i2 = 0; i2 < this.length; ++i2) {
        var str = this[i2] === this ? "[Circular AggregateError]" : this[i2] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
          lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret2 += str + "\n";
      }
      level--;
      return ret2;
    };
    function OperationalError(message) {
      if (!(this instanceof OperationalError))
        return new OperationalError(message);
      notEnumerableProp2(this, "name", "OperationalError");
      notEnumerableProp2(this, "message", message);
      this.cause = message;
      this["isOperational"] = true;
      if (message instanceof Error) {
        notEnumerableProp2(this, "message", message.message);
        notEnumerableProp2(this, "stack", message.stack);
      } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
    inherits2(OperationalError, Error);
    var errorTypes = Error["__BluebirdErrorTypes__"];
    if (!errorTypes) {
      errorTypes = Objectfreeze({
        CancellationError,
        TimeoutError,
        OperationalError,
        RejectionError: OperationalError,
        AggregateError
      });
      es52.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
    module2.exports = {
      Error,
      TypeError: _TypeError,
      RangeError: _RangeError,
      CancellationError: errorTypes.CancellationError,
      OperationalError: errorTypes.OperationalError,
      TimeoutError: errorTypes.TimeoutError,
      AggregateError: errorTypes.AggregateError,
      Warning
    };
  }
});

// node_modules/bluebird/js/release/thenables.js
var require_thenables = __commonJS({
  "node_modules/bluebird/js/release/thenables.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var util = require_util();
      var errorObj2 = util.errorObj;
      var isObject2 = util.isObject;
      function tryConvertToPromise(obj2, context) {
        if (isObject2(obj2)) {
          if (obj2 instanceof Promise2)
            return obj2;
          var then = getThen(obj2);
          if (then === errorObj2) {
            if (context)
              context._pushContext();
            var ret2 = Promise2.reject(then.e);
            if (context)
              context._popContext();
            return ret2;
          } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj2)) {
              var ret2 = new Promise2(INTERNAL);
              obj2._then(
                ret2._fulfill,
                ret2._reject,
                void 0,
                ret2,
                null
              );
              return ret2;
            }
            return doThenable(obj2, then, context);
          }
        }
        return obj2;
      }
      function doGetThen(obj2) {
        return obj2.then;
      }
      function getThen(obj2) {
        try {
          return doGetThen(obj2);
        } catch (e) {
          errorObj2.e = e;
          return errorObj2;
        }
      }
      var hasProp = {}.hasOwnProperty;
      function isAnyBluebirdPromise(obj2) {
        try {
          return hasProp.call(obj2, "_promise0");
        } catch (e) {
          return false;
        }
      }
      function doThenable(x, then, context) {
        var promise = new Promise2(INTERNAL);
        var ret2 = promise;
        if (context)
          context._pushContext();
        promise._captureStackTrace();
        if (context)
          context._popContext();
        var synchronous = true;
        var result = util.tryCatch(then).call(x, resolve2, reject);
        synchronous = false;
        if (promise && result === errorObj2) {
          promise._rejectCallback(result.e, true, true);
          promise = null;
        }
        function resolve2(value) {
          if (!promise)
            return;
          promise._resolveCallback(value);
          promise = null;
        }
        function reject(reason) {
          if (!promise)
            return;
          promise._rejectCallback(reason, synchronous, true);
          promise = null;
        }
        return ret2;
      }
      return tryConvertToPromise;
    };
  }
});

// node_modules/bluebird/js/release/promise_array.js
var require_promise_array = __commonJS({
  "node_modules/bluebird/js/release/promise_array.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
      var util = require_util();
      var isArray = util.isArray;
      function toResolutionValue(val) {
        switch (val) {
          case -2:
            return [];
          case -3:
            return {};
        }
      }
      function PromiseArray(values) {
        var promise = this._promise = new Promise2(INTERNAL);
        if (values instanceof Promise2) {
          promise._propagateFrom(values, 3);
        }
        promise._setOnCancel(this);
        this._values = values;
        this._length = 0;
        this._totalResolved = 0;
        this._init(void 0, -2);
      }
      util.inherits(PromiseArray, Proxyable);
      PromiseArray.prototype.length = function() {
        return this._length;
      };
      PromiseArray.prototype.promise = function() {
        return this._promise;
      };
      PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
        var values = tryConvertToPromise(this._values, this._promise);
        if (values instanceof Promise2) {
          values = values._target();
          var bitField = values._bitField;
          ;
          this._values = values;
          if ((bitField & 50397184) === 0) {
            this._promise._setAsyncGuaranteed();
            return values._then(
              init,
              this._reject,
              void 0,
              this,
              resolveValueIfEmpty
            );
          } else if ((bitField & 33554432) !== 0) {
            values = values._value();
          } else if ((bitField & 16777216) !== 0) {
            return this._reject(values._reason());
          } else {
            return this._cancel();
          }
        }
        values = util.asArray(values);
        if (values === null) {
          var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)
          ).reason();
          this._promise._rejectCallback(err, false);
          return;
        }
        if (values.length === 0) {
          if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
          } else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
          }
          return;
        }
        this._iterate(values);
      };
      PromiseArray.prototype._iterate = function(values) {
        var len = this.getActualLength(values.length);
        this._length = len;
        this._values = this.shouldCopyValues() ? new Array(len) : this._values;
        var result = this._promise;
        var isResolved = false;
        var bitField = null;
        for (var i = 0; i < len; ++i) {
          var maybePromise = tryConvertToPromise(values[i], result);
          if (maybePromise instanceof Promise2) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
          } else {
            bitField = null;
          }
          if (isResolved) {
            if (bitField !== null) {
              maybePromise.suppressUnhandledRejections();
            }
          } else if (bitField !== null) {
            if ((bitField & 50397184) === 0) {
              maybePromise._proxy(this, i);
              this._values[i] = maybePromise;
            } else if ((bitField & 33554432) !== 0) {
              isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if ((bitField & 16777216) !== 0) {
              isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
              isResolved = this._promiseCancelled(i);
            }
          } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
          }
        }
        if (!isResolved)
          result._setAsyncGuaranteed();
      };
      PromiseArray.prototype._isResolved = function() {
        return this._values === null;
      };
      PromiseArray.prototype._resolve = function(value) {
        this._values = null;
        this._promise._fulfill(value);
      };
      PromiseArray.prototype._cancel = function() {
        if (this._isResolved() || !this._promise._isCancellable())
          return;
        this._values = null;
        this._promise._cancel();
      };
      PromiseArray.prototype._reject = function(reason) {
        this._values = null;
        this._promise._rejectCallback(reason, false);
      };
      PromiseArray.prototype._promiseFulfilled = function(value, index) {
        this._values[index] = value;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          this._resolve(this._values);
          return true;
        }
        return false;
      };
      PromiseArray.prototype._promiseCancelled = function() {
        this._cancel();
        return true;
      };
      PromiseArray.prototype._promiseRejected = function(reason) {
        this._totalResolved++;
        this._reject(reason);
        return true;
      };
      PromiseArray.prototype._resultCancelled = function() {
        if (this._isResolved())
          return;
        var values = this._values;
        this._cancel();
        if (values instanceof Promise2) {
          values.cancel();
        } else {
          for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise2) {
              values[i].cancel();
            }
          }
        }
      };
      PromiseArray.prototype.shouldCopyValues = function() {
        return true;
      };
      PromiseArray.prototype.getActualLength = function(len) {
        return len;
      };
      return PromiseArray;
    };
  }
});

// node_modules/bluebird/js/release/context.js
var require_context = __commonJS({
  "node_modules/bluebird/js/release/context.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var longStackTraces = false;
      var contextStack = [];
      Promise2.prototype._promiseCreated = function() {
      };
      Promise2.prototype._pushContext = function() {
      };
      Promise2.prototype._popContext = function() {
        return null;
      };
      Promise2._peekContext = Promise2.prototype._peekContext = function() {
      };
      function Context() {
        this._trace = new Context.CapturedTrace(peekContext());
      }
      Context.prototype._pushContext = function() {
        if (this._trace !== void 0) {
          this._trace._promiseCreated = null;
          contextStack.push(this._trace);
        }
      };
      Context.prototype._popContext = function() {
        if (this._trace !== void 0) {
          var trace = contextStack.pop();
          var ret2 = trace._promiseCreated;
          trace._promiseCreated = null;
          return ret2;
        }
        return null;
      };
      function createContext() {
        if (longStackTraces)
          return new Context();
      }
      function peekContext() {
        var lastIndex = contextStack.length - 1;
        if (lastIndex >= 0) {
          return contextStack[lastIndex];
        }
        return void 0;
      }
      Context.CapturedTrace = null;
      Context.create = createContext;
      Context.deactivateLongStackTraces = function() {
      };
      Context.activateLongStackTraces = function() {
        var Promise_pushContext = Promise2.prototype._pushContext;
        var Promise_popContext = Promise2.prototype._popContext;
        var Promise_PeekContext = Promise2._peekContext;
        var Promise_peekContext = Promise2.prototype._peekContext;
        var Promise_promiseCreated = Promise2.prototype._promiseCreated;
        Context.deactivateLongStackTraces = function() {
          Promise2.prototype._pushContext = Promise_pushContext;
          Promise2.prototype._popContext = Promise_popContext;
          Promise2._peekContext = Promise_PeekContext;
          Promise2.prototype._peekContext = Promise_peekContext;
          Promise2.prototype._promiseCreated = Promise_promiseCreated;
          longStackTraces = false;
        };
        longStackTraces = true;
        Promise2.prototype._pushContext = Context.prototype._pushContext;
        Promise2.prototype._popContext = Context.prototype._popContext;
        Promise2._peekContext = Promise2.prototype._peekContext = peekContext;
        Promise2.prototype._promiseCreated = function() {
          var ctx = this._peekContext();
          if (ctx && ctx._promiseCreated == null)
            ctx._promiseCreated = this;
        };
      };
      return Context;
    };
  }
});

// node_modules/bluebird/js/release/debuggability.js
var require_debuggability = __commonJS({
  "node_modules/bluebird/js/release/debuggability.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, Context) {
      var getDomain = Promise2._getDomain;
      var async = Promise2._async;
      var Warning = require_errors().Warning;
      var util = require_util();
      var canAttachTrace2 = util.canAttachTrace;
      var unhandledRejectionHandled;
      var possiblyUnhandledRejection;
      var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
      var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
      var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
      var stackFramePattern = null;
      var formatStack = null;
      var indentStackFrames = false;
      var printWarning;
      var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));
      var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));
      var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));
      var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
      Promise2.prototype.suppressUnhandledRejections = function() {
        var target = this._target();
        target._bitField = target._bitField & ~1048576 | 524288;
      };
      Promise2.prototype._ensurePossibleRejectionHandled = function() {
        if ((this._bitField & 524288) !== 0)
          return;
        this._setRejectionIsUnhandled();
        async.invokeLater(this._notifyUnhandledRejection, this, void 0);
      };
      Promise2.prototype._notifyUnhandledRejectionIsHandled = function() {
        fireRejectionEvent(
          "rejectionHandled",
          unhandledRejectionHandled,
          void 0,
          this
        );
      };
      Promise2.prototype._setReturnedNonUndefined = function() {
        this._bitField = this._bitField | 268435456;
      };
      Promise2.prototype._returnedNonUndefined = function() {
        return (this._bitField & 268435456) !== 0;
      };
      Promise2.prototype._notifyUnhandledRejection = function() {
        if (this._isRejectionUnhandled()) {
          var reason = this._settledValue();
          this._setUnhandledRejectionIsNotified();
          fireRejectionEvent(
            "unhandledRejection",
            possiblyUnhandledRejection,
            reason,
            this
          );
        }
      };
      Promise2.prototype._setUnhandledRejectionIsNotified = function() {
        this._bitField = this._bitField | 262144;
      };
      Promise2.prototype._unsetUnhandledRejectionIsNotified = function() {
        this._bitField = this._bitField & ~262144;
      };
      Promise2.prototype._isUnhandledRejectionNotified = function() {
        return (this._bitField & 262144) > 0;
      };
      Promise2.prototype._setRejectionIsUnhandled = function() {
        this._bitField = this._bitField | 1048576;
      };
      Promise2.prototype._unsetRejectionIsUnhandled = function() {
        this._bitField = this._bitField & ~1048576;
        if (this._isUnhandledRejectionNotified()) {
          this._unsetUnhandledRejectionIsNotified();
          this._notifyUnhandledRejectionIsHandled();
        }
      };
      Promise2.prototype._isRejectionUnhandled = function() {
        return (this._bitField & 1048576) > 0;
      };
      Promise2.prototype._warn = function(message, shouldUseOwnTrace, promise) {
        return warn(message, shouldUseOwnTrace, promise || this);
      };
      Promise2.onPossiblyUnhandledRejection = function(fn) {
        var domain = getDomain();
        possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : void 0;
      };
      Promise2.onUnhandledRejectionHandled = function(fn) {
        var domain = getDomain();
        unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : void 0;
      };
      var disableLongStackTraces = function() {
      };
      Promise2.longStackTraces = function() {
        if (async.haveItemsQueued() && !config.longStackTraces) {
          throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
        }
        if (!config.longStackTraces && longStackTracesIsSupported()) {
          var Promise_captureStackTrace = Promise2.prototype._captureStackTrace;
          var Promise_attachExtraTrace = Promise2.prototype._attachExtraTrace;
          config.longStackTraces = true;
          disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
              throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
            }
            Promise2.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise2.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
          };
          Promise2.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
          Promise2.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
          Context.activateLongStackTraces();
          async.disableTrampolineIfNecessary();
        }
      };
      Promise2.hasLongStackTraces = function() {
        return config.longStackTraces && longStackTracesIsSupported();
      };
      var fireDomEvent = function() {
        try {
          if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event2) {
              var domEvent = new CustomEvent(name.toLowerCase(), {
                detail: event2,
                cancelable: true
              });
              return !util.global.dispatchEvent(domEvent);
            };
          } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event2) {
              var domEvent = new Event(name.toLowerCase(), {
                cancelable: true
              });
              domEvent.detail = event2;
              return !util.global.dispatchEvent(domEvent);
            };
          } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event2) {
              var domEvent = document.createEvent("CustomEvent");
              domEvent.initCustomEvent(
                name.toLowerCase(),
                false,
                true,
                event2
              );
              return !util.global.dispatchEvent(domEvent);
            };
          }
        } catch (e) {
        }
        return function() {
          return false;
        };
      }();
      var fireGlobalEvent = function() {
        if (util.isNode) {
          return function() {
            return process.emit.apply(process, arguments);
          };
        } else {
          if (!util.global) {
            return function() {
              return false;
            };
          }
          return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method)
              return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
          };
        }
      }();
      function generatePromiseLifecycleEventObject(name, promise) {
        return { promise };
      }
      var eventToObjectGenerator = {
        promiseCreated: generatePromiseLifecycleEventObject,
        promiseFulfilled: generatePromiseLifecycleEventObject,
        promiseRejected: generatePromiseLifecycleEventObject,
        promiseResolved: generatePromiseLifecycleEventObject,
        promiseCancelled: generatePromiseLifecycleEventObject,
        promiseChained: function(name, promise, child) {
          return { promise, child };
        },
        warning: function(name, warning) {
          return { warning };
        },
        unhandledRejection: function(name, reason, promise) {
          return { reason, promise };
        },
        rejectionHandled: generatePromiseLifecycleEventObject
      };
      var activeFireEvent = function(name) {
        var globalEventFired = false;
        try {
          globalEventFired = fireGlobalEvent.apply(null, arguments);
        } catch (e) {
          async.throwLater(e);
          globalEventFired = true;
        }
        var domEventFired = false;
        try {
          domEventFired = fireDomEvent(
            name,
            eventToObjectGenerator[name].apply(null, arguments)
          );
        } catch (e) {
          async.throwLater(e);
          domEventFired = true;
        }
        return domEventFired || globalEventFired;
      };
      Promise2.config = function(opts) {
        opts = Object(opts);
        if ("longStackTraces" in opts) {
          if (opts.longStackTraces) {
            Promise2.longStackTraces();
          } else if (!opts.longStackTraces && Promise2.hasLongStackTraces()) {
            disableLongStackTraces();
          }
        }
        if ("warnings" in opts) {
          var warningsOption = opts.warnings;
          config.warnings = !!warningsOption;
          wForgottenReturn = config.warnings;
          if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
              wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
          }
        }
        if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
          if (async.haveItemsQueued()) {
            throw new Error(
              "cannot enable cancellation after promises are in use"
            );
          }
          Promise2.prototype._clearCancellationData = cancellationClearCancellationData;
          Promise2.prototype._propagateFrom = cancellationPropagateFrom;
          Promise2.prototype._onCancel = cancellationOnCancel;
          Promise2.prototype._setOnCancel = cancellationSetOnCancel;
          Promise2.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
          Promise2.prototype._execute = cancellationExecute;
          propagateFromFunction = cancellationPropagateFrom;
          config.cancellation = true;
        }
        if ("monitoring" in opts) {
          if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise2.prototype._fireEvent = activeFireEvent;
          } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise2.prototype._fireEvent = defaultFireEvent;
          }
        }
        return Promise2;
      };
      function defaultFireEvent() {
        return false;
      }
      Promise2.prototype._fireEvent = defaultFireEvent;
      Promise2.prototype._execute = function(executor, resolve2, reject) {
        try {
          executor(resolve2, reject);
        } catch (e) {
          return e;
        }
      };
      Promise2.prototype._onCancel = function() {
      };
      Promise2.prototype._setOnCancel = function(handler) {
        ;
      };
      Promise2.prototype._attachCancellationCallback = function(onCancel) {
        ;
      };
      Promise2.prototype._captureStackTrace = function() {
      };
      Promise2.prototype._attachExtraTrace = function() {
      };
      Promise2.prototype._clearCancellationData = function() {
      };
      Promise2.prototype._propagateFrom = function(parent, flags) {
        ;
        ;
      };
      function cancellationExecute(executor, resolve2, reject) {
        var promise = this;
        try {
          executor(resolve2, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
              throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
          });
        } catch (e) {
          return e;
        }
      }
      function cancellationAttachCancellationCallback(onCancel) {
        if (!this._isCancellable())
          return this;
        var previousOnCancel = this._onCancel();
        if (previousOnCancel !== void 0) {
          if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
          } else {
            this._setOnCancel([previousOnCancel, onCancel]);
          }
        } else {
          this._setOnCancel(onCancel);
        }
      }
      function cancellationOnCancel() {
        return this._onCancelField;
      }
      function cancellationSetOnCancel(onCancel) {
        this._onCancelField = onCancel;
      }
      function cancellationClearCancellationData() {
        this._cancellationParent = void 0;
        this._onCancelField = void 0;
      }
      function cancellationPropagateFrom(parent, flags) {
        if ((flags & 1) !== 0) {
          this._cancellationParent = parent;
          var branchesRemainingToCancel = parent._branchesRemainingToCancel;
          if (branchesRemainingToCancel === void 0) {
            branchesRemainingToCancel = 0;
          }
          parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
        }
        if ((flags & 2) !== 0 && parent._isBound()) {
          this._setBoundTo(parent._boundTo);
        }
      }
      function bindingPropagateFrom(parent, flags) {
        if ((flags & 2) !== 0 && parent._isBound()) {
          this._setBoundTo(parent._boundTo);
        }
      }
      var propagateFromFunction = bindingPropagateFrom;
      function boundValueFunction() {
        var ret2 = this._boundTo;
        if (ret2 !== void 0) {
          if (ret2 instanceof Promise2) {
            if (ret2.isFulfilled()) {
              return ret2.value();
            } else {
              return void 0;
            }
          }
        }
        return ret2;
      }
      function longStackTracesCaptureStackTrace() {
        this._trace = new CapturedTrace(this._peekContext());
      }
      function longStackTracesAttachExtraTrace(error, ignoreSelf) {
        if (canAttachTrace2(error)) {
          var trace = this._trace;
          if (trace !== void 0) {
            if (ignoreSelf)
              trace = trace._parent;
          }
          if (trace !== void 0) {
            trace.attachExtraTrace(error);
          } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(
              error,
              "stack",
              parsed.message + "\n" + parsed.stack.join("\n")
            );
            util.notEnumerableProp(error, "__stackCleaned__", true);
          }
        }
      }
      function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
        if (returnValue === void 0 && promiseCreated !== null && wForgottenReturn) {
          if (parent !== void 0 && parent._returnedNonUndefined())
            return;
          if ((promise._bitField & 65535) === 0)
            return;
          if (name)
            name = name + " ";
          var handlerLine = "";
          var creatorLine = "";
          if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
              var line = stack[i];
              if (!nodeFramePattern.test(line)) {
                var lineMatches = line.match(parseLinePattern);
                if (lineMatches) {
                  handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                }
                break;
              }
            }
            if (stack.length > 0) {
              var firstUserLine = stack[0];
              for (var i = 0; i < traceLines.length; ++i) {
                if (traceLines[i] === firstUserLine) {
                  if (i > 0) {
                    creatorLine = "\n" + traceLines[i - 1];
                  }
                  break;
                }
              }
            }
          }
          var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
          promise._warn(msg, true, promiseCreated);
        }
      }
      function deprecated(name, replacement) {
        var message = name + " is deprecated and will be removed in a future version.";
        if (replacement)
          message += " Use " + replacement + " instead.";
        return warn(message);
      }
      function warn(message, shouldUseOwnTrace, promise) {
        if (!config.warnings)
          return;
        var warning = new Warning(message);
        var ctx;
        if (shouldUseOwnTrace) {
          promise._attachExtraTrace(warning);
        } else if (config.longStackTraces && (ctx = Promise2._peekContext())) {
          ctx.attachExtraTrace(warning);
        } else {
          var parsed = parseStackAndMessage(warning);
          warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
        }
        if (!activeFireEvent("warning", warning)) {
          formatAndLogError(warning, "", true);
        }
      }
      function reconstructStack(message, stacks) {
        for (var i = 0; i < stacks.length - 1; ++i) {
          stacks[i].push("From previous event:");
          stacks[i] = stacks[i].join("\n");
        }
        if (i < stacks.length) {
          stacks[i] = stacks[i].join("\n");
        }
        return message + "\n" + stacks.join("\n");
      }
      function removeDuplicateOrEmptyJumps(stacks) {
        for (var i = 0; i < stacks.length; ++i) {
          if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
            stacks.splice(i, 1);
            i--;
          }
        }
      }
      function removeCommonRoots(stacks) {
        var current = stacks[0];
        for (var i = 1; i < stacks.length; ++i) {
          var prev = stacks[i];
          var currentLastIndex = current.length - 1;
          var currentLastLine = current[currentLastIndex];
          var commonRootMeetPoint = -1;
          for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
              commonRootMeetPoint = j;
              break;
            }
          }
          for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
              current.pop();
              currentLastIndex--;
            } else {
              break;
            }
          }
          current = prev;
        }
      }
      function cleanStack(stack) {
        var ret2 = [];
        for (var i = 0; i < stack.length; ++i) {
          var line = stack[i];
          var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
          var isInternalFrame = isTraceLine && shouldIgnore(line);
          if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
              line = "    " + line;
            }
            ret2.push(line);
          }
        }
        return ret2;
      }
      function stackFramesAsArray(error) {
        var stack = error.stack.replace(/\s+$/g, "").split("\n");
        for (var i = 0; i < stack.length; ++i) {
          var line = stack[i];
          if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
          }
        }
        if (i > 0 && error.name != "SyntaxError") {
          stack = stack.slice(i);
        }
        return stack;
      }
      function parseStackAndMessage(error) {
        var stack = error.stack;
        var message = error.toString();
        stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
        return {
          message,
          stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
        };
      }
      function formatAndLogError(error, title, isSoft) {
        if (typeof console !== "undefined") {
          var message;
          if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
          } else {
            message = title + String(error);
          }
          if (typeof printWarning === "function") {
            printWarning(message, isSoft);
          } else if (typeof console.log === "function" || typeof console.log === "object") {
            console.log(message);
          }
        }
      }
      function fireRejectionEvent(name, localHandler, reason, promise) {
        var localEventFired = false;
        try {
          if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
              localHandler(promise);
            } else {
              localHandler(reason, promise);
            }
          }
        } catch (e) {
          async.throwLater(e);
        }
        if (name === "unhandledRejection") {
          if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
          }
        } else {
          activeFireEvent(name, promise);
        }
      }
      function formatNonError(obj2) {
        var str;
        if (typeof obj2 === "function") {
          str = "[function " + (obj2.name || "anonymous") + "]";
        } else {
          str = obj2 && typeof obj2.toString === "function" ? obj2.toString() : util.toString(obj2);
          var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
          if (ruselessToString.test(str)) {
            try {
              var newStr = JSON.stringify(obj2);
              str = newStr;
            } catch (e) {
            }
          }
          if (str.length === 0) {
            str = "(empty array)";
          }
        }
        return "(<" + snip(str) + ">, no stack trace)";
      }
      function snip(str) {
        var maxChars = 41;
        if (str.length < maxChars) {
          return str;
        }
        return str.substr(0, maxChars - 3) + "...";
      }
      function longStackTracesIsSupported() {
        return typeof captureStackTrace === "function";
      }
      var shouldIgnore = function() {
        return false;
      };
      var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
      function parseLineInfo(line) {
        var matches = line.match(parseLineInfoRegex);
        if (matches) {
          return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
          };
        }
      }
      function setBounds(firstLineError, lastLineError) {
        if (!longStackTracesIsSupported())
          return;
        var firstStackLines = firstLineError.stack.split("\n");
        var lastStackLines = lastLineError.stack.split("\n");
        var firstIndex = -1;
        var lastIndex = -1;
        var firstFileName;
        var lastFileName;
        for (var i = 0; i < firstStackLines.length; ++i) {
          var result = parseLineInfo(firstStackLines[i]);
          if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
          }
        }
        for (var i = 0; i < lastStackLines.length; ++i) {
          var result = parseLineInfo(lastStackLines[i]);
          if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
          }
        }
        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
          return;
        }
        shouldIgnore = function(line) {
          if (bluebirdFramePattern.test(line))
            return true;
          var info = parseLineInfo(line);
          if (info) {
            if (info.fileName === firstFileName && (firstIndex <= info.line && info.line <= lastIndex)) {
              return true;
            }
          }
          return false;
        };
      }
      function CapturedTrace(parent) {
        this._parent = parent;
        this._promisesCreated = 0;
        var length = this._length = 1 + (parent === void 0 ? 0 : parent._length);
        captureStackTrace(this, CapturedTrace);
        if (length > 32)
          this.uncycle();
      }
      util.inherits(CapturedTrace, Error);
      Context.CapturedTrace = CapturedTrace;
      CapturedTrace.prototype.uncycle = function() {
        var length = this._length;
        if (length < 2)
          return;
        var nodes = [];
        var stackToIndex = {};
        for (var i = 0, node = this; node !== void 0; ++i) {
          nodes.push(node);
          node = node._parent;
        }
        length = this._length = i;
        for (var i = length - 1; i >= 0; --i) {
          var stack = nodes[i].stack;
          if (stackToIndex[stack] === void 0) {
            stackToIndex[stack] = i;
          }
        }
        for (var i = 0; i < length; ++i) {
          var currentStack = nodes[i].stack;
          var index = stackToIndex[currentStack];
          if (index !== void 0 && index !== i) {
            if (index > 0) {
              nodes[index - 1]._parent = void 0;
              nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = void 0;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
            if (index < length - 1) {
              cycleEdgeNode._parent = nodes[index + 1];
              cycleEdgeNode._parent.uncycle();
              cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
            } else {
              cycleEdgeNode._parent = void 0;
              cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
              nodes[j]._length = currentChildLength;
              currentChildLength++;
            }
            return;
          }
        }
      };
      CapturedTrace.prototype.attachExtraTrace = function(error) {
        if (error.__stackCleaned__)
          return;
        this.uncycle();
        var parsed = parseStackAndMessage(error);
        var message = parsed.message;
        var stacks = [parsed.stack];
        var trace = this;
        while (trace !== void 0) {
          stacks.push(cleanStack(trace.stack.split("\n")));
          trace = trace._parent;
        }
        removeCommonRoots(stacks);
        removeDuplicateOrEmptyJumps(stacks);
        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
        util.notEnumerableProp(error, "__stackCleaned__", true);
      };
      var captureStackTrace = function stackDetection() {
        var v8stackFramePattern = /^\s*at\s*/;
        var v8stackFormatter = function(stack, error) {
          if (typeof stack === "string")
            return stack;
          if (error.name !== void 0 && error.message !== void 0) {
            return error.toString();
          }
          return formatNonError(error);
        };
        if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
          Error.stackTraceLimit += 6;
          stackFramePattern = v8stackFramePattern;
          formatStack = v8stackFormatter;
          var captureStackTrace2 = Error.captureStackTrace;
          shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
          };
          return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace2(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
          };
        }
        var err = new Error();
        if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
          stackFramePattern = /@/;
          formatStack = v8stackFormatter;
          indentStackFrames = true;
          return function captureStackTrace3(o) {
            o.stack = new Error().stack;
          };
        }
        var hasStackAfterThrow;
        try {
          throw new Error();
        } catch (e) {
          hasStackAfterThrow = "stack" in e;
        }
        if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
          stackFramePattern = v8stackFramePattern;
          formatStack = v8stackFormatter;
          return function captureStackTrace3(o) {
            Error.stackTraceLimit += 6;
            try {
              throw new Error();
            } catch (e) {
              o.stack = e.stack;
            }
            Error.stackTraceLimit -= 6;
          };
        }
        formatStack = function(stack, error) {
          if (typeof stack === "string")
            return stack;
          if ((typeof error === "object" || typeof error === "function") && error.name !== void 0 && error.message !== void 0) {
            return error.toString();
          }
          return formatNonError(error);
        };
        return null;
      }([]);
      if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
        printWarning = function(message) {
          console.warn(message);
        };
        if (util.isNode && process.stderr.isTTY) {
          printWarning = function(message, isSoft) {
            var color = isSoft ? "\x1B[33m" : "\x1B[31m";
            console.warn(color + message + "\x1B[0m\n");
          };
        } else if (!util.isNode && typeof new Error().stack === "string") {
          printWarning = function(message, isSoft) {
            console.warn(
              "%c" + message,
              isSoft ? "color: darkorange" : "color: red"
            );
          };
        }
      }
      var config = {
        warnings,
        longStackTraces: false,
        cancellation: false,
        monitoring: false
      };
      if (longStackTraces)
        Promise2.longStackTraces();
      return {
        longStackTraces: function() {
          return config.longStackTraces;
        },
        warnings: function() {
          return config.warnings;
        },
        cancellation: function() {
          return config.cancellation;
        },
        monitoring: function() {
          return config.monitoring;
        },
        propagateFromFunction: function() {
          return propagateFromFunction;
        },
        boundValueFunction: function() {
          return boundValueFunction;
        },
        checkForgottenReturns,
        setBounds,
        warn,
        deprecated,
        CapturedTrace,
        fireDomEvent,
        fireGlobalEvent
      };
    };
  }
});

// node_modules/bluebird/js/release/finally.js
var require_finally = __commonJS({
  "node_modules/bluebird/js/release/finally.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, tryConvertToPromise) {
      var util = require_util();
      var CancellationError = Promise2.CancellationError;
      var errorObj2 = util.errorObj;
      function PassThroughHandlerContext(promise, type, handler) {
        this.promise = promise;
        this.type = type;
        this.handler = handler;
        this.called = false;
        this.cancelPromise = null;
      }
      PassThroughHandlerContext.prototype.isFinallyHandler = function() {
        return this.type === 0;
      };
      function FinallyHandlerCancelReaction(finallyHandler2) {
        this.finallyHandler = finallyHandler2;
      }
      FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
        checkCancel(this.finallyHandler);
      };
      function checkCancel(ctx, reason) {
        if (ctx.cancelPromise != null) {
          if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
          } else {
            ctx.cancelPromise._cancel();
          }
          ctx.cancelPromise = null;
          return true;
        }
        return false;
      }
      function succeed() {
        return finallyHandler.call(this, this.promise._target()._settledValue());
      }
      function fail(reason) {
        if (checkCancel(this, reason))
          return;
        errorObj2.e = reason;
        return errorObj2;
      }
      function finallyHandler(reasonOrValue) {
        var promise = this.promise;
        var handler = this.handler;
        if (!this.called) {
          this.called = true;
          var ret2 = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
          if (ret2 !== void 0) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret2, promise);
            if (maybePromise instanceof Promise2) {
              if (this.cancelPromise != null) {
                if (maybePromise._isCancelled()) {
                  var reason = new CancellationError("late cancellation observer");
                  promise._attachExtraTrace(reason);
                  errorObj2.e = reason;
                  return errorObj2;
                } else if (maybePromise.isPending()) {
                  maybePromise._attachCancellationCallback(
                    new FinallyHandlerCancelReaction(this)
                  );
                }
              }
              return maybePromise._then(
                succeed,
                fail,
                void 0,
                this,
                void 0
              );
            }
          }
        }
        if (promise.isRejected()) {
          checkCancel(this);
          errorObj2.e = reasonOrValue;
          return errorObj2;
        } else {
          checkCancel(this);
          return reasonOrValue;
        }
      }
      Promise2.prototype._passThrough = function(handler, type, success, fail2) {
        if (typeof handler !== "function")
          return this.then();
        return this._then(
          success,
          fail2,
          void 0,
          new PassThroughHandlerContext(this, type, handler),
          void 0
        );
      };
      Promise2.prototype.lastly = Promise2.prototype["finally"] = function(handler) {
        return this._passThrough(
          handler,
          0,
          finallyHandler,
          finallyHandler
        );
      };
      Promise2.prototype.tap = function(handler) {
        return this._passThrough(handler, 1, finallyHandler);
      };
      return PassThroughHandlerContext;
    };
  }
});

// node_modules/bluebird/js/release/catch_filter.js
var require_catch_filter = __commonJS({
  "node_modules/bluebird/js/release/catch_filter.js"(exports2, module2) {
    "use strict";
    module2.exports = function(NEXT_FILTER) {
      var util = require_util();
      var getKeys = require_es5().keys;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      function catchFilter(instances, cb, promise) {
        return function(e) {
          var boundTo = promise._boundValue();
          predicateLoop:
            for (var i = 0; i < instances.length; ++i) {
              var item = instances[i];
              if (item === Error || item != null && item.prototype instanceof Error) {
                if (e instanceof item) {
                  return tryCatch2(cb).call(boundTo, e);
                }
              } else if (typeof item === "function") {
                var matchesPredicate = tryCatch2(item).call(boundTo, e);
                if (matchesPredicate === errorObj2) {
                  return matchesPredicate;
                } else if (matchesPredicate) {
                  return tryCatch2(cb).call(boundTo, e);
                }
              } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                  var key = keys[j];
                  if (item[key] != e[key]) {
                    continue predicateLoop;
                  }
                }
                return tryCatch2(cb).call(boundTo, e);
              }
            }
          return NEXT_FILTER;
        };
      }
      return catchFilter;
    };
  }
});

// node_modules/bluebird/js/release/nodeback.js
var require_nodeback = __commonJS({
  "node_modules/bluebird/js/release/nodeback.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var maybeWrapAsError2 = util.maybeWrapAsError;
    var errors = require_errors();
    var OperationalError = errors.OperationalError;
    var es52 = require_es5();
    function isUntypedError(obj2) {
      return obj2 instanceof Error && es52.getPrototypeOf(obj2) === Error.prototype;
    }
    var rErrorKey = /^(?:name|message|stack|cause)$/;
    function wrapAsOperationalError(obj2) {
      var ret2;
      if (isUntypedError(obj2)) {
        ret2 = new OperationalError(obj2);
        ret2.name = obj2.name;
        ret2.message = obj2.message;
        ret2.stack = obj2.stack;
        var keys = es52.keys(obj2);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (!rErrorKey.test(key)) {
            ret2[key] = obj2[key];
          }
        }
        return ret2;
      }
      util.markAsOriginatingFromRejection(obj2);
      return obj2;
    }
    function nodebackForPromise(promise, multiArgs) {
      return function(err, value) {
        if (promise === null)
          return;
        if (err) {
          var wrapped = wrapAsOperationalError(maybeWrapAsError2(err));
          promise._attachExtraTrace(wrapped);
          promise._reject(wrapped);
        } else if (!multiArgs) {
          promise._fulfill(value);
        } else {
          var $_len = arguments.length;
          var args = new Array(Math.max($_len - 1, 0));
          for (var $_i = 1; $_i < $_len; ++$_i) {
            args[$_i - 1] = arguments[$_i];
          }
          ;
          promise._fulfill(args);
        }
        promise = null;
      };
    }
    module2.exports = nodebackForPromise;
  }
});

// node_modules/bluebird/js/release/method.js
var require_method = __commonJS({
  "node_modules/bluebird/js/release/method.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, debug) {
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      Promise2.method = function(fn) {
        if (typeof fn !== "function") {
          throw new Promise2.TypeError("expecting a function but got " + util.classString(fn));
        }
        return function() {
          var ret2 = new Promise2(INTERNAL);
          ret2._captureStackTrace();
          ret2._pushContext();
          var value = tryCatch2(fn).apply(this, arguments);
          var promiseCreated = ret2._popContext();
          debug.checkForgottenReturns(
            value,
            promiseCreated,
            "Promise.method",
            ret2
          );
          ret2._resolveFromSyncValue(value);
          return ret2;
        };
      };
      Promise2.attempt = Promise2["try"] = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        ret2._pushContext();
        var value;
        if (arguments.length > 1) {
          debug.deprecated("calling Promise.try with more than 1 argument");
          var arg = arguments[1];
          var ctx = arguments[2];
          value = util.isArray(arg) ? tryCatch2(fn).apply(ctx, arg) : tryCatch2(fn).call(ctx, arg);
        } else {
          value = tryCatch2(fn)();
        }
        var promiseCreated = ret2._popContext();
        debug.checkForgottenReturns(
          value,
          promiseCreated,
          "Promise.try",
          ret2
        );
        ret2._resolveFromSyncValue(value);
        return ret2;
      };
      Promise2.prototype._resolveFromSyncValue = function(value) {
        if (value === util.errorObj) {
          this._rejectCallback(value.e, false);
        } else {
          this._resolveCallback(value, true);
        }
      };
    };
  }
});

// node_modules/bluebird/js/release/bind.js
var require_bind = __commonJS({
  "node_modules/bluebird/js/release/bind.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, debug) {
      var calledBind = false;
      var rejectThis = function(_, e) {
        this._reject(e);
      };
      var targetRejected = function(e, context) {
        context.promiseRejectionQueued = true;
        context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
      };
      var bindingResolved = function(thisArg, context) {
        if ((this._bitField & 50397184) === 0) {
          this._resolveCallback(context.target);
        }
      };
      var bindingRejected = function(e, context) {
        if (!context.promiseRejectionQueued)
          this._reject(e);
      };
      Promise2.prototype.bind = function(thisArg) {
        if (!calledBind) {
          calledBind = true;
          Promise2.prototype._propagateFrom = debug.propagateFromFunction();
          Promise2.prototype._boundValue = debug.boundValueFunction();
        }
        var maybePromise = tryConvertToPromise(thisArg);
        var ret2 = new Promise2(INTERNAL);
        ret2._propagateFrom(this, 1);
        var target = this._target();
        ret2._setBoundTo(maybePromise);
        if (maybePromise instanceof Promise2) {
          var context = {
            promiseRejectionQueued: false,
            promise: ret2,
            target,
            bindingPromise: maybePromise
          };
          target._then(INTERNAL, targetRejected, void 0, ret2, context);
          maybePromise._then(
            bindingResolved,
            bindingRejected,
            void 0,
            ret2,
            context
          );
          ret2._setOnCancel(maybePromise);
        } else {
          ret2._resolveCallback(target);
        }
        return ret2;
      };
      Promise2.prototype._setBoundTo = function(obj2) {
        if (obj2 !== void 0) {
          this._bitField = this._bitField | 2097152;
          this._boundTo = obj2;
        } else {
          this._bitField = this._bitField & ~2097152;
        }
      };
      Promise2.prototype._isBound = function() {
        return (this._bitField & 2097152) === 2097152;
      };
      Promise2.bind = function(thisArg, value) {
        return Promise2.resolve(value).bind(thisArg);
      };
    };
  }
});

// node_modules/bluebird/js/release/cancel.js
var require_cancel = __commonJS({
  "node_modules/bluebird/js/release/cancel.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, debug) {
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var async = Promise2._async;
      Promise2.prototype["break"] = Promise2.prototype.cancel = function() {
        if (!debug.cancellation())
          return this._warn("cancellation is disabled");
        var promise = this;
        var child = promise;
        while (promise._isCancellable()) {
          if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
              child._followee().cancel();
            } else {
              child._cancelBranched();
            }
            break;
          }
          var parent = promise._cancellationParent;
          if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
              promise._followee().cancel();
            } else {
              promise._cancelBranched();
            }
            break;
          } else {
            if (promise._isFollowing())
              promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
          }
        }
      };
      Promise2.prototype._branchHasCancelled = function() {
        this._branchesRemainingToCancel--;
      };
      Promise2.prototype._enoughBranchesHaveCancelled = function() {
        return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
      };
      Promise2.prototype._cancelBy = function(canceller) {
        if (canceller === this) {
          this._branchesRemainingToCancel = 0;
          this._invokeOnCancel();
          return true;
        } else {
          this._branchHasCancelled();
          if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
          }
        }
        return false;
      };
      Promise2.prototype._cancelBranched = function() {
        if (this._enoughBranchesHaveCancelled()) {
          this._cancel();
        }
      };
      Promise2.prototype._cancel = function() {
        if (!this._isCancellable())
          return;
        this._setCancelled();
        async.invoke(this._cancelPromises, this, void 0);
      };
      Promise2.prototype._cancelPromises = function() {
        if (this._length() > 0)
          this._settlePromises();
      };
      Promise2.prototype._unsetOnCancel = function() {
        this._onCancelField = void 0;
      };
      Promise2.prototype._isCancellable = function() {
        return this.isPending() && !this._isCancelled();
      };
      Promise2.prototype.isCancellable = function() {
        return this.isPending() && !this.isCancelled();
      };
      Promise2.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
        if (util.isArray(onCancelCallback)) {
          for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
          }
        } else if (onCancelCallback !== void 0) {
          if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
              var e = tryCatch2(onCancelCallback).call(this._boundValue());
              if (e === errorObj2) {
                this._attachExtraTrace(e.e);
                async.throwLater(e.e);
              }
            }
          } else {
            onCancelCallback._resultCancelled(this);
          }
        }
      };
      Promise2.prototype._invokeOnCancel = function() {
        var onCancelCallback = this._onCancel();
        this._unsetOnCancel();
        async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
      };
      Promise2.prototype._invokeInternalOnCancel = function() {
        if (this._isCancellable()) {
          this._doInvokeOnCancel(this._onCancel(), true);
          this._unsetOnCancel();
        }
      };
      Promise2.prototype._resultCancelled = function() {
        this.cancel();
      };
    };
  }
});

// node_modules/bluebird/js/release/direct_resolve.js
var require_direct_resolve = __commonJS({
  "node_modules/bluebird/js/release/direct_resolve.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      function returner() {
        return this.value;
      }
      function thrower2() {
        throw this.reason;
      }
      Promise2.prototype["return"] = Promise2.prototype.thenReturn = function(value) {
        if (value instanceof Promise2)
          value.suppressUnhandledRejections();
        return this._then(
          returner,
          void 0,
          void 0,
          { value },
          void 0
        );
      };
      Promise2.prototype["throw"] = Promise2.prototype.thenThrow = function(reason) {
        return this._then(
          thrower2,
          void 0,
          void 0,
          { reason },
          void 0
        );
      };
      Promise2.prototype.catchThrow = function(reason) {
        if (arguments.length <= 1) {
          return this._then(
            void 0,
            thrower2,
            void 0,
            { reason },
            void 0
          );
        } else {
          var _reason = arguments[1];
          var handler = function() {
            throw _reason;
          };
          return this.caught(reason, handler);
        }
      };
      Promise2.prototype.catchReturn = function(value) {
        if (arguments.length <= 1) {
          if (value instanceof Promise2)
            value.suppressUnhandledRejections();
          return this._then(
            void 0,
            returner,
            void 0,
            { value },
            void 0
          );
        } else {
          var _value = arguments[1];
          if (_value instanceof Promise2)
            _value.suppressUnhandledRejections();
          var handler = function() {
            return _value;
          };
          return this.caught(value, handler);
        }
      };
    };
  }
});

// node_modules/bluebird/js/release/synchronous_inspection.js
var require_synchronous_inspection = __commonJS({
  "node_modules/bluebird/js/release/synchronous_inspection.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      function PromiseInspection(promise) {
        if (promise !== void 0) {
          promise = promise._target();
          this._bitField = promise._bitField;
          this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
        } else {
          this._bitField = 0;
          this._settledValueField = void 0;
        }
      }
      PromiseInspection.prototype._settledValue = function() {
        return this._settledValueField;
      };
      var value = PromiseInspection.prototype.value = function() {
        if (!this.isFulfilled()) {
          throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
        }
        return this._settledValue();
      };
      var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
        if (!this.isRejected()) {
          throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
        }
        return this._settledValue();
      };
      var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
        return (this._bitField & 33554432) !== 0;
      };
      var isRejected = PromiseInspection.prototype.isRejected = function() {
        return (this._bitField & 16777216) !== 0;
      };
      var isPending = PromiseInspection.prototype.isPending = function() {
        return (this._bitField & 50397184) === 0;
      };
      var isResolved = PromiseInspection.prototype.isResolved = function() {
        return (this._bitField & 50331648) !== 0;
      };
      PromiseInspection.prototype.isCancelled = function() {
        return (this._bitField & 8454144) !== 0;
      };
      Promise2.prototype.__isCancelled = function() {
        return (this._bitField & 65536) === 65536;
      };
      Promise2.prototype._isCancelled = function() {
        return this._target().__isCancelled();
      };
      Promise2.prototype.isCancelled = function() {
        return (this._target()._bitField & 8454144) !== 0;
      };
      Promise2.prototype.isPending = function() {
        return isPending.call(this._target());
      };
      Promise2.prototype.isRejected = function() {
        return isRejected.call(this._target());
      };
      Promise2.prototype.isFulfilled = function() {
        return isFulfilled.call(this._target());
      };
      Promise2.prototype.isResolved = function() {
        return isResolved.call(this._target());
      };
      Promise2.prototype.value = function() {
        return value.call(this._target());
      };
      Promise2.prototype.reason = function() {
        var target = this._target();
        target._unsetRejectionIsUnhandled();
        return reason.call(target);
      };
      Promise2.prototype._value = function() {
        return this._settledValue();
      };
      Promise2.prototype._reason = function() {
        this._unsetRejectionIsUnhandled();
        return this._settledValue();
      };
      Promise2.PromiseInspection = PromiseInspection;
    };
  }
});

// node_modules/bluebird/js/release/join.js
var require_join = __commonJS({
  "node_modules/bluebird/js/release/join.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain) {
      var util = require_util();
      var canEvaluate2 = util.canEvaluate;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var reject;
      if (true) {
        if (canEvaluate2) {
          var thenCallback = function(i2) {
            return new Function("value", "holder", "                             \n            'use strict';                                                    \n            holder.pIndex = value;                                           \n            holder.checkFulfillment(this);                                   \n            ".replace(/Index/g, i2));
          };
          var promiseSetter = function(i2) {
            return new Function("promise", "holder", "                           \n            'use strict';                                                    \n            holder.pIndex = promise;                                         \n            ".replace(/Index/g, i2));
          };
          var generateHolderClass = function(total) {
            var props = new Array(total);
            for (var i2 = 0; i2 < props.length; ++i2) {
              props[i2] = "this.p" + (i2 + 1);
            }
            var assignment = props.join(" = ") + " = null;";
            var cancellationCode = "var promise;\n" + props.map(function(prop) {
              return "                                                         \n                promise = " + prop + ";                                      \n                if (promise instanceof Promise) {                            \n                    promise.cancel();                                        \n                }                                                            \n            ";
            }).join("\n");
            var passedArguments = props.join(", ");
            var name = "Holder$" + total;
            var code = "return function(tryCatch, errorObj, Promise, async) {    \n            'use strict';                                                    \n            function [TheName](fn) {                                         \n                [TheProperties]                                              \n                this.fn = fn;                                                \n                this.asyncNeeded = true;                                     \n                this.now = 0;                                                \n            }                                                                \n                                                                             \n            [TheName].prototype._callFunction = function(promise) {          \n                promise._pushContext();                                      \n                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n                promise._popContext();                                       \n                if (ret === errorObj) {                                      \n                    promise._rejectCallback(ret.e, false);                   \n                } else {                                                     \n                    promise._resolveCallback(ret);                           \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype.checkFulfillment = function(promise) {       \n                var now = ++this.now;                                        \n                if (now === [TheTotal]) {                                    \n                    if (this.asyncNeeded) {                                  \n                        async.invoke(this._callFunction, this, promise);     \n                    } else {                                                 \n                        this._callFunction(promise);                         \n                    }                                                        \n                                                                             \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype._resultCancelled = function() {              \n                [CancellationCode]                                           \n            };                                                               \n                                                                             \n            return [TheName];                                                \n        }(tryCatch, errorObj, Promise, async);                               \n        ";
            code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);
            return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch2, errorObj2, Promise2, async);
          };
          var holderClasses = [];
          var thenCallbacks = [];
          var promiseSetters = [];
          for (var i = 0; i < 8; ++i) {
            holderClasses.push(generateHolderClass(i + 1));
            thenCallbacks.push(thenCallback(i + 1));
            promiseSetters.push(promiseSetter(i + 1));
          }
          reject = function(reason) {
            this._reject(reason);
          };
        }
      }
      Promise2.join = function() {
        var last = arguments.length - 1;
        var fn;
        if (last > 0 && typeof arguments[last] === "function") {
          fn = arguments[last];
          if (true) {
            if (last <= 8 && canEvaluate2) {
              var ret2 = new Promise2(INTERNAL);
              ret2._captureStackTrace();
              var HolderClass = holderClasses[last - 1];
              var holder = new HolderClass(fn);
              var callbacks = thenCallbacks;
              for (var i2 = 0; i2 < last; ++i2) {
                var maybePromise = tryConvertToPromise(arguments[i2], ret2);
                if (maybePromise instanceof Promise2) {
                  maybePromise = maybePromise._target();
                  var bitField = maybePromise._bitField;
                  ;
                  if ((bitField & 50397184) === 0) {
                    maybePromise._then(
                      callbacks[i2],
                      reject,
                      void 0,
                      ret2,
                      holder
                    );
                    promiseSetters[i2](maybePromise, holder);
                    holder.asyncNeeded = false;
                  } else if ((bitField & 33554432) !== 0) {
                    callbacks[i2].call(
                      ret2,
                      maybePromise._value(),
                      holder
                    );
                  } else if ((bitField & 16777216) !== 0) {
                    ret2._reject(maybePromise._reason());
                  } else {
                    ret2._cancel();
                  }
                } else {
                  callbacks[i2].call(ret2, maybePromise, holder);
                }
              }
              if (!ret2._isFateSealed()) {
                if (holder.asyncNeeded) {
                  var domain = getDomain();
                  if (domain !== null) {
                    holder.fn = util.domainBind(domain, holder.fn);
                  }
                }
                ret2._setAsyncGuaranteed();
                ret2._setOnCancel(holder);
              }
              return ret2;
            }
          }
        }
        var $_len = arguments.length;
        var args = new Array($_len);
        for (var $_i = 0; $_i < $_len; ++$_i) {
          args[$_i] = arguments[$_i];
        }
        ;
        if (fn)
          args.pop();
        var ret2 = new PromiseArray(args).promise();
        return fn !== void 0 ? ret2.spread(fn) : ret2;
      };
    };
  }
});

// node_modules/bluebird/js/release/map.js
var require_map = __commonJS({
  "node_modules/bluebird/js/release/map.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
      var getDomain = Promise2._getDomain;
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var async = Promise2._async;
      function MappingPromiseArray(promises, fn, limit, _filter) {
        this.constructor$(promises);
        this._promise._captureStackTrace();
        var domain = getDomain();
        this._callback = domain === null ? fn : util.domainBind(domain, fn);
        this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
        this._limit = limit;
        this._inFlight = 0;
        this._queue = [];
        async.invoke(this._asyncInit, this, void 0);
      }
      util.inherits(MappingPromiseArray, PromiseArray);
      MappingPromiseArray.prototype._asyncInit = function() {
        this._init$(void 0, -2);
      };
      MappingPromiseArray.prototype._init = function() {
      };
      MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
        var values = this._values;
        var length = this.length();
        var preservedValues = this._preservedValues;
        var limit = this._limit;
        if (index < 0) {
          index = index * -1 - 1;
          values[index] = value;
          if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved())
              return true;
          }
        } else {
          if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
          }
          if (preservedValues !== null)
            preservedValues[index] = value;
          var promise = this._promise;
          var callback = this._callback;
          var receiver = promise._boundValue();
          promise._pushContext();
          var ret2 = tryCatch2(callback).call(receiver, value, index, length);
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(
            ret2,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
          );
          if (ret2 === errorObj2) {
            this._reject(ret2.e);
            return true;
          }
          var maybePromise = tryConvertToPromise(ret2, this._promise);
          if (maybePromise instanceof Promise2) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if ((bitField & 50397184) === 0) {
              if (limit >= 1)
                this._inFlight++;
              values[index] = maybePromise;
              maybePromise._proxy(this, (index + 1) * -1);
              return false;
            } else if ((bitField & 33554432) !== 0) {
              ret2 = maybePromise._value();
            } else if ((bitField & 16777216) !== 0) {
              this._reject(maybePromise._reason());
              return true;
            } else {
              this._cancel();
              return true;
            }
          }
          values[index] = ret2;
        }
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= length) {
          if (preservedValues !== null) {
            this._filter(values, preservedValues);
          } else {
            this._resolve(values);
          }
          return true;
        }
        return false;
      };
      MappingPromiseArray.prototype._drainQueue = function() {
        var queue = this._queue;
        var limit = this._limit;
        var values = this._values;
        while (queue.length > 0 && this._inFlight < limit) {
          if (this._isResolved())
            return;
          var index = queue.pop();
          this._promiseFulfilled(values[index], index);
        }
      };
      MappingPromiseArray.prototype._filter = function(booleans, values) {
        var len = values.length;
        var ret2 = new Array(len);
        var j = 0;
        for (var i = 0; i < len; ++i) {
          if (booleans[i])
            ret2[j++] = values[i];
        }
        ret2.length = j;
        this._resolve(ret2);
      };
      MappingPromiseArray.prototype.preservedValues = function() {
        return this._preservedValues;
      };
      function map(promises, fn, options, _filter) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var limit = 0;
        if (options !== void 0) {
          if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
              return Promise2.reject(
                new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency))
              );
            }
            limit = options.concurrency;
          } else {
            return Promise2.reject(new TypeError(
              "options argument must be an object but it is " + util.classString(options)
            ));
          }
        }
        limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
        return new MappingPromiseArray(promises, fn, limit, _filter).promise();
      }
      Promise2.prototype.map = function(fn, options) {
        return map(this, fn, options, null);
      };
      Promise2.map = function(promises, fn, options, _filter) {
        return map(promises, fn, options, _filter);
      };
    };
  }
});

// node_modules/bluebird/js/release/call_get.js
var require_call_get = __commonJS({
  "node_modules/bluebird/js/release/call_get.js"(exports2, module2) {
    "use strict";
    var cr = Object.create;
    if (cr) {
      callerCache = cr(null);
      getterCache = cr(null);
      callerCache[" size"] = getterCache[" size"] = 0;
    }
    var callerCache;
    var getterCache;
    module2.exports = function(Promise2) {
      var util = require_util();
      var canEvaluate2 = util.canEvaluate;
      var isIdentifier2 = util.isIdentifier;
      var getMethodCaller;
      var getGetter;
      if (true) {
        var makeMethodCaller = function(methodName) {
          return new Function("ensureMethod", "                                    \n        return function(obj) {                                               \n            'use strict'                                                     \n            var len = this.length;                                           \n            ensureMethod(obj, 'methodName');                                 \n            switch(len) {                                                    \n                case 1: return obj.methodName(this[0]);                      \n                case 2: return obj.methodName(this[0], this[1]);             \n                case 3: return obj.methodName(this[0], this[1], this[2]);    \n                case 0: return obj.methodName();                             \n                default:                                                     \n                    return obj.methodName.apply(obj, this);                  \n            }                                                                \n        };                                                                   \n        ".replace(/methodName/g, methodName))(ensureMethod);
        };
        var makeGetter = function(propertyName) {
          return new Function("obj", "                                             \n        'use strict';                                                        \n        return obj.propertyName;                                             \n        ".replace("propertyName", propertyName));
        };
        var getCompiled = function(name, compiler, cache) {
          var ret2 = cache[name];
          if (typeof ret2 !== "function") {
            if (!isIdentifier2(name)) {
              return null;
            }
            ret2 = compiler(name);
            cache[name] = ret2;
            cache[" size"]++;
            if (cache[" size"] > 512) {
              var keys = Object.keys(cache);
              for (var i = 0; i < 256; ++i)
                delete cache[keys[i]];
              cache[" size"] = keys.length - 256;
            }
          }
          return ret2;
        };
        getMethodCaller = function(name) {
          return getCompiled(name, makeMethodCaller, callerCache);
        };
        getGetter = function(name) {
          return getCompiled(name, makeGetter, getterCache);
        };
      }
      function ensureMethod(obj2, methodName) {
        var fn;
        if (obj2 != null)
          fn = obj2[methodName];
        if (typeof fn !== "function") {
          var message = "Object " + util.classString(obj2) + " has no method '" + util.toString(methodName) + "'";
          throw new Promise2.TypeError(message);
        }
        return fn;
      }
      function caller(obj2) {
        var methodName = this.pop();
        var fn = ensureMethod(obj2, methodName);
        return fn.apply(obj2, this);
      }
      Promise2.prototype.call = function(methodName) {
        var $_len = arguments.length;
        var args = new Array(Math.max($_len - 1, 0));
        for (var $_i = 1; $_i < $_len; ++$_i) {
          args[$_i - 1] = arguments[$_i];
        }
        ;
        if (true) {
          if (canEvaluate2) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
              return this._then(
                maybeCaller,
                void 0,
                void 0,
                args,
                void 0
              );
            }
          }
        }
        args.push(methodName);
        return this._then(caller, void 0, void 0, args, void 0);
      };
      function namedGetter(obj2) {
        return obj2[this];
      }
      function indexedGetter(obj2) {
        var index = +this;
        if (index < 0)
          index = Math.max(0, index + obj2.length);
        return obj2[index];
      }
      Promise2.prototype.get = function(propertyName) {
        var isIndex = typeof propertyName === "number";
        var getter;
        if (!isIndex) {
          if (canEvaluate2) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
          } else {
            getter = namedGetter;
          }
        } else {
          getter = indexedGetter;
        }
        return this._then(getter, void 0, void 0, propertyName, void 0);
      };
    };
  }
});

// node_modules/bluebird/js/release/using.js
var require_using = __commonJS({
  "node_modules/bluebird/js/release/using.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
      var util = require_util();
      var TypeError2 = require_errors().TypeError;
      var inherits2 = require_util().inherits;
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      var NULL = {};
      function thrower2(e) {
        setTimeout(function() {
          throw e;
        }, 0);
      }
      function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
          maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
      }
      function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret2 = new Promise2(INTERNAL);
        function iterator() {
          if (i >= len)
            return ret2._fulfill();
          var maybePromise = castPreservingDisposable(resources[i++]);
          if (maybePromise instanceof Promise2 && maybePromise._isDisposable()) {
            try {
              maybePromise = tryConvertToPromise(
                maybePromise._getDisposer().tryDispose(inspection),
                resources.promise
              );
            } catch (e) {
              return thrower2(e);
            }
            if (maybePromise instanceof Promise2) {
              return maybePromise._then(
                iterator,
                thrower2,
                null,
                null,
                null
              );
            }
          }
          iterator();
        }
        iterator();
        return ret2;
      }
      function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
      }
      Disposer.prototype.data = function() {
        return this._data;
      };
      Disposer.prototype.promise = function() {
        return this._promise;
      };
      Disposer.prototype.resource = function() {
        if (this.promise().isFulfilled()) {
          return this.promise().value();
        }
        return NULL;
      };
      Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== void 0)
          context._pushContext();
        var ret2 = resource !== NULL ? this.doDispose(resource, inspection) : null;
        if (context !== void 0)
          context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret2;
      };
      Disposer.isDisposer = function(d) {
        return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
      };
      function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
      }
      inherits2(FunctionDisposer, Disposer);
      FunctionDisposer.prototype.doDispose = function(resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
      };
      function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
          this.resources[this.index]._setDisposable(value);
          return value.promise();
        }
        return value;
      }
      function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length - 1] = null;
      }
      ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
          var item = this[i];
          if (item instanceof Promise2) {
            item.cancel();
          }
        }
      };
      Promise2.using = function() {
        var len = arguments.length;
        if (len < 2)
          return apiRejection(
            "you must pass at least 2 arguments to Promise.using"
          );
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
          input = arguments[0];
          len = input.length;
          spreadArgs = false;
        } else {
          input = arguments;
          len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
          var resource = input[i];
          if (Disposer.isDisposer(resource)) {
            var disposer = resource;
            resource = resource.promise();
            resource._setDisposable(disposer);
          } else {
            var maybePromise = tryConvertToPromise(resource);
            if (maybePromise instanceof Promise2) {
              resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                resources,
                index: i
              }, void 0);
            }
          }
          resources[i] = resource;
        }
        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
          reflectedResources[i] = Promise2.resolve(resources[i]).reflect();
        }
        var resultPromise = Promise2.all(reflectedResources).then(function(inspections) {
          for (var i2 = 0; i2 < inspections.length; ++i2) {
            var inspection = inspections[i2];
            if (inspection.isRejected()) {
              errorObj2.e = inspection.error();
              return errorObj2;
            } else if (!inspection.isFulfilled()) {
              resultPromise.cancel();
              return;
            }
            inspections[i2] = inspection.value();
          }
          promise._pushContext();
          fn = tryCatch2(fn);
          var ret2 = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections);
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(
            ret2,
            promiseCreated,
            "Promise.using",
            promise
          );
          return ret2;
        });
        var promise = resultPromise.lastly(function() {
          var inspection = new Promise2.PromiseInspection(resultPromise);
          return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
      };
      Promise2.prototype._setDisposable = function(disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
      };
      Promise2.prototype._isDisposable = function() {
        return (this._bitField & 131072) > 0;
      };
      Promise2.prototype._getDisposer = function() {
        return this._disposer;
      };
      Promise2.prototype._unsetDisposable = function() {
        this._bitField = this._bitField & ~131072;
        this._disposer = void 0;
      };
      Promise2.prototype.disposer = function(fn) {
        if (typeof fn === "function") {
          return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError2();
      };
    };
  }
});

// node_modules/bluebird/js/release/timers.js
var require_timers = __commonJS({
  "node_modules/bluebird/js/release/timers.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, debug) {
      var util = require_util();
      var TimeoutError = Promise2.TimeoutError;
      function HandleWrapper(handle) {
        this.handle = handle;
      }
      HandleWrapper.prototype._resultCancelled = function() {
        clearTimeout(this.handle);
      };
      var afterValue = function(value) {
        return delay(+this).thenReturn(value);
      };
      var delay = Promise2.delay = function(ms, value) {
        var ret2;
        var handle;
        if (value !== void 0) {
          ret2 = Promise2.resolve(value)._then(afterValue, null, null, ms, void 0);
          if (debug.cancellation() && value instanceof Promise2) {
            ret2._setOnCancel(value);
          }
        } else {
          ret2 = new Promise2(INTERNAL);
          handle = setTimeout(function() {
            ret2._fulfill();
          }, +ms);
          if (debug.cancellation()) {
            ret2._setOnCancel(new HandleWrapper(handle));
          }
          ret2._captureStackTrace();
        }
        ret2._setAsyncGuaranteed();
        return ret2;
      };
      Promise2.prototype.delay = function(ms) {
        return delay(ms, this);
      };
      var afterTimeout = function(promise, message, parent) {
        var err;
        if (typeof message !== "string") {
          if (message instanceof Error) {
            err = message;
          } else {
            err = new TimeoutError("operation timed out");
          }
        } else {
          err = new TimeoutError(message);
        }
        util.markAsOriginatingFromRejection(err);
        promise._attachExtraTrace(err);
        promise._reject(err);
        if (parent != null) {
          parent.cancel();
        }
      };
      function successClear(value) {
        clearTimeout(this.handle);
        return value;
      }
      function failureClear(reason) {
        clearTimeout(this.handle);
        throw reason;
      }
      Promise2.prototype.timeout = function(ms, message) {
        ms = +ms;
        var ret2, parent;
        var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
          if (ret2.isPending()) {
            afterTimeout(ret2, message, parent);
          }
        }, ms));
        if (debug.cancellation()) {
          parent = this.then();
          ret2 = parent._then(
            successClear,
            failureClear,
            void 0,
            handleWrapper,
            void 0
          );
          ret2._setOnCancel(handleWrapper);
        } else {
          ret2 = this._then(
            successClear,
            failureClear,
            void 0,
            handleWrapper,
            void 0
          );
        }
        return ret2;
      };
    };
  }
});

// node_modules/bluebird/js/release/generators.js
var require_generators = __commonJS({
  "node_modules/bluebird/js/release/generators.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
      var errors = require_errors();
      var TypeError2 = errors.TypeError;
      var util = require_util();
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      var yieldHandlers = [];
      function promiseFromYieldHandler(value, yieldHandlers2, traceParent) {
        for (var i = 0; i < yieldHandlers2.length; ++i) {
          traceParent._pushContext();
          var result = tryCatch2(yieldHandlers2[i])(value);
          traceParent._popContext();
          if (result === errorObj2) {
            traceParent._pushContext();
            var ret2 = Promise2.reject(errorObj2.e);
            traceParent._popContext();
            return ret2;
          }
          var maybePromise = tryConvertToPromise(result, traceParent);
          if (maybePromise instanceof Promise2)
            return maybePromise;
        }
        return null;
      }
      function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
        if (debug.cancellation()) {
          var internal = new Promise2(INTERNAL);
          var _finallyPromise = this._finallyPromise = new Promise2(INTERNAL);
          this._promise = internal.lastly(function() {
            return _finallyPromise;
          });
          internal._captureStackTrace();
          internal._setOnCancel(this);
        } else {
          var promise = this._promise = new Promise2(INTERNAL);
          promise._captureStackTrace();
        }
        this._stack = stack;
        this._generatorFunction = generatorFunction;
        this._receiver = receiver;
        this._generator = void 0;
        this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
        this._yieldedPromise = null;
        this._cancellationPhase = false;
      }
      util.inherits(PromiseSpawn, Proxyable);
      PromiseSpawn.prototype._isResolved = function() {
        return this._promise === null;
      };
      PromiseSpawn.prototype._cleanup = function() {
        this._promise = this._generator = null;
        if (debug.cancellation() && this._finallyPromise !== null) {
          this._finallyPromise._fulfill();
          this._finallyPromise = null;
        }
      };
      PromiseSpawn.prototype._promiseCancelled = function() {
        if (this._isResolved())
          return;
        var implementsReturn = typeof this._generator["return"] !== "undefined";
        var result;
        if (!implementsReturn) {
          var reason = new Promise2.CancellationError(
            "generator .return() sentinel"
          );
          Promise2.coroutine.returnSentinel = reason;
          this._promise._attachExtraTrace(reason);
          this._promise._pushContext();
          result = tryCatch2(this._generator["throw"]).call(
            this._generator,
            reason
          );
          this._promise._popContext();
        } else {
          this._promise._pushContext();
          result = tryCatch2(this._generator["return"]).call(
            this._generator,
            void 0
          );
          this._promise._popContext();
        }
        this._cancellationPhase = true;
        this._yieldedPromise = null;
        this._continue(result);
      };
      PromiseSpawn.prototype._promiseFulfilled = function(value) {
        this._yieldedPromise = null;
        this._promise._pushContext();
        var result = tryCatch2(this._generator.next).call(this._generator, value);
        this._promise._popContext();
        this._continue(result);
      };
      PromiseSpawn.prototype._promiseRejected = function(reason) {
        this._yieldedPromise = null;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        var result = tryCatch2(this._generator["throw"]).call(this._generator, reason);
        this._promise._popContext();
        this._continue(result);
      };
      PromiseSpawn.prototype._resultCancelled = function() {
        if (this._yieldedPromise instanceof Promise2) {
          var promise = this._yieldedPromise;
          this._yieldedPromise = null;
          promise.cancel();
        }
      };
      PromiseSpawn.prototype.promise = function() {
        return this._promise;
      };
      PromiseSpawn.prototype._run = function() {
        this._generator = this._generatorFunction.call(this._receiver);
        this._receiver = this._generatorFunction = void 0;
        this._promiseFulfilled(void 0);
      };
      PromiseSpawn.prototype._continue = function(result) {
        var promise = this._promise;
        if (result === errorObj2) {
          this._cleanup();
          if (this._cancellationPhase) {
            return promise.cancel();
          } else {
            return promise._rejectCallback(result.e, false);
          }
        }
        var value = result.value;
        if (result.done === true) {
          this._cleanup();
          if (this._cancellationPhase) {
            return promise.cancel();
          } else {
            return promise._resolveCallback(value);
          }
        } else {
          var maybePromise = tryConvertToPromise(value, this._promise);
          if (!(maybePromise instanceof Promise2)) {
            maybePromise = promiseFromYieldHandler(
              maybePromise,
              this._yieldHandlers,
              this._promise
            );
            if (maybePromise === null) {
              this._promiseRejected(
                new TypeError2(
                  "A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", value) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")
                )
              );
              return;
            }
          }
          maybePromise = maybePromise._target();
          var bitField = maybePromise._bitField;
          ;
          if ((bitField & 50397184) === 0) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
          } else if ((bitField & 33554432) !== 0) {
            Promise2._async.invoke(
              this._promiseFulfilled,
              this,
              maybePromise._value()
            );
          } else if ((bitField & 16777216) !== 0) {
            Promise2._async.invoke(
              this._promiseRejected,
              this,
              maybePromise._reason()
            );
          } else {
            this._promiseCancelled();
          }
        }
      };
      Promise2.coroutine = function(generatorFunction, options) {
        if (typeof generatorFunction !== "function") {
          throw new TypeError2("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        var yieldHandler = Object(options).yieldHandler;
        var PromiseSpawn$ = PromiseSpawn;
        var stack = new Error().stack;
        return function() {
          var generator = generatorFunction.apply(this, arguments);
          var spawn = new PromiseSpawn$(
            void 0,
            void 0,
            yieldHandler,
            stack
          );
          var ret2 = spawn.promise();
          spawn._generator = generator;
          spawn._promiseFulfilled(void 0);
          return ret2;
        };
      };
      Promise2.coroutine.addYieldHandler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        yieldHandlers.push(fn);
      };
      Promise2.spawn = function(generatorFunction) {
        debug.deprecated("Promise.spawn()", "Promise.coroutine()");
        if (typeof generatorFunction !== "function") {
          return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        var spawn = new PromiseSpawn(generatorFunction, this);
        var ret2 = spawn.promise();
        spawn._run(Promise2.spawn);
        return ret2;
      };
    };
  }
});

// node_modules/bluebird/js/release/nodeify.js
var require_nodeify = __commonJS({
  "node_modules/bluebird/js/release/nodeify.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var util = require_util();
      var async = Promise2._async;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      function spreadAdapter(val, nodeback) {
        var promise = this;
        if (!util.isArray(val))
          return successAdapter.call(promise, val, nodeback);
        var ret2 = tryCatch2(nodeback).apply(promise._boundValue(), [null].concat(val));
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      function successAdapter(val, nodeback) {
        var promise = this;
        var receiver = promise._boundValue();
        var ret2 = val === void 0 ? tryCatch2(nodeback).call(receiver, null) : tryCatch2(nodeback).call(receiver, null, val);
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      function errorAdapter(reason, nodeback) {
        var promise = this;
        if (!reason) {
          var newReason = new Error(reason + "");
          newReason.cause = reason;
          reason = newReason;
        }
        var ret2 = tryCatch2(nodeback).call(promise._boundValue(), reason);
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      Promise2.prototype.asCallback = Promise2.prototype.nodeify = function(nodeback, options) {
        if (typeof nodeback == "function") {
          var adapter = successAdapter;
          if (options !== void 0 && Object(options).spread) {
            adapter = spreadAdapter;
          }
          this._then(
            adapter,
            errorAdapter,
            void 0,
            this,
            nodeback
          );
        }
        return this;
      };
    };
  }
});

// node_modules/bluebird/js/release/promisify.js
var require_promisify = __commonJS({
  "node_modules/bluebird/js/release/promisify.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var THIS = {};
      var util = require_util();
      var nodebackForPromise = require_nodeback();
      var withAppended2 = util.withAppended;
      var maybeWrapAsError2 = util.maybeWrapAsError;
      var canEvaluate2 = util.canEvaluate;
      var TypeError2 = require_errors().TypeError;
      var defaultSuffix = "Async";
      var defaultPromisified = { __isPromisified__: true };
      var noCopyProps = [
        "arity",
        "length",
        "name",
        "arguments",
        "caller",
        "callee",
        "prototype",
        "__isPromisified__"
      ];
      var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
      var defaultFilter = function(name) {
        return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
      };
      function propsFilter(key) {
        return !noCopyPropsPattern.test(key);
      }
      function isPromisified(fn) {
        try {
          return fn.__isPromisified__ === true;
        } catch (e) {
          return false;
        }
      }
      function hasPromisified(obj2, key, suffix) {
        var val = util.getDataPropertyOrDefault(
          obj2,
          key + suffix,
          defaultPromisified
        );
        return val ? isPromisified(val) : false;
      }
      function checkValid(ret2, suffix, suffixRegexp) {
        for (var i = 0; i < ret2.length; i += 2) {
          var key = ret2[i];
          if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret2.length; j += 2) {
              if (ret2[j] === keyWithoutAsyncSuffix) {
                throw new TypeError2("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
              }
            }
          }
        }
      }
      function promisifiableMethods(obj2, suffix, suffixRegexp, filter) {
        var keys = util.inheritedDataKeys(obj2);
        var ret2 = [];
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var value = obj2[key];
          var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj2);
          if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj2, key, suffix) && filter(key, value, obj2, passesDefaultFilter)) {
            ret2.push(key, value);
          }
        }
        checkValid(ret2, suffix, suffixRegexp);
        return ret2;
      }
      var escapeIdentRegex = function(str) {
        return str.replace(/([$])/, "\\$");
      };
      var makeNodePromisifiedEval;
      if (true) {
        var switchCaseArgumentOrder = function(likelyArgumentCount) {
          var ret2 = [likelyArgumentCount];
          var min = Math.max(0, likelyArgumentCount - 1 - 3);
          for (var i = likelyArgumentCount - 1; i >= min; --i) {
            ret2.push(i);
          }
          for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
            ret2.push(i);
          }
          return ret2;
        };
        var argumentSequence = function(argumentCount) {
          return util.filledRange(argumentCount, "_arg", "");
        };
        var parameterDeclaration = function(parameterCount2) {
          return util.filledRange(
            Math.max(parameterCount2, 3),
            "_arg",
            ""
          );
        };
        var parameterCount = function(fn) {
          if (typeof fn.length === "number") {
            return Math.max(Math.min(fn.length, 1023 + 1), 0);
          }
          return 0;
        };
        makeNodePromisifiedEval = function(callback, receiver, originalName, fn, _, multiArgs) {
          var newParameterCount = Math.max(0, parameterCount(fn) - 1);
          var argumentOrder = switchCaseArgumentOrder(newParameterCount);
          var shouldProxyThis = typeof callback === "string" || receiver === THIS;
          function generateCallForArgumentCount(count) {
            var args = argumentSequence(count).join(", ");
            var comma = count > 0 ? ", " : "";
            var ret2;
            if (shouldProxyThis) {
              ret2 = "ret = callback.call(this, {{args}}, nodeback); break;\n";
            } else {
              ret2 = receiver === void 0 ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
            }
            return ret2.replace("{{args}}", args).replace(", ", comma);
          }
          function generateArgumentSwitchCase() {
            var ret2 = "";
            for (var i = 0; i < argumentOrder.length; ++i) {
              ret2 += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
            }
            ret2 += "                                                             \n        default:                                                             \n            var args = new Array(len + 1);                                   \n            var i = 0;                                                       \n            for (var i = 0; i < len; ++i) {                                  \n               args[i] = arguments[i];                                       \n            }                                                                \n            args[i] = nodeback;                                              \n            [CodeForCall]                                                    \n            break;                                                           \n        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
            return ret2;
          }
          var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
          var body = "'use strict';                                                \n        var ret = function (Parameters) {                                    \n            'use strict';                                                    \n            var len = arguments.length;                                      \n            var promise = new Promise(INTERNAL);                             \n            promise._captureStackTrace();                                    \n            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n            var ret;                                                         \n            var callback = tryCatch([GetFunctionCode]);                      \n            switch(len) {                                                    \n                [CodeForSwitchCase]                                          \n            }                                                                \n            if (ret === errorObj) {                                          \n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n            }                                                                \n            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n            return promise;                                                  \n        };                                                                   \n        notEnumerableProp(ret, '__isPromisified__', true);                   \n        return ret;                                                          \n    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
          body = body.replace("Parameters", parameterDeclaration(newParameterCount));
          return new Function(
            "Promise",
            "fn",
            "receiver",
            "withAppended",
            "maybeWrapAsError",
            "nodebackForPromise",
            "tryCatch",
            "errorObj",
            "notEnumerableProp",
            "INTERNAL",
            body
          )(
            Promise2,
            fn,
            receiver,
            withAppended2,
            maybeWrapAsError2,
            nodebackForPromise,
            util.tryCatch,
            util.errorObj,
            util.notEnumerableProp,
            INTERNAL
          );
        };
      }
      function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
        var defaultThis = function() {
          return this;
        }();
        var method = callback;
        if (typeof method === "string") {
          callback = fn;
        }
        function promisified() {
          var _receiver = receiver;
          if (receiver === THIS)
            _receiver = this;
          var promise = new Promise2(INTERNAL);
          promise._captureStackTrace();
          var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
          var fn2 = nodebackForPromise(promise, multiArgs);
          try {
            cb.apply(_receiver, withAppended2(arguments, fn2));
          } catch (e) {
            promise._rejectCallback(maybeWrapAsError2(e), true, true);
          }
          if (!promise._isFateSealed())
            promise._setAsyncGuaranteed();
          return promise;
        }
        util.notEnumerableProp(promisified, "__isPromisified__", true);
        return promisified;
      }
      var makeNodePromisified = canEvaluate2 ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
      function promisifyAll(obj2, suffix, filter, promisifier, multiArgs) {
        var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
        var methods = promisifiableMethods(obj2, suffix, suffixRegexp, filter);
        for (var i = 0, len = methods.length; i < len; i += 2) {
          var key = methods[i];
          var fn = methods[i + 1];
          var promisifiedKey = key + suffix;
          if (promisifier === makeNodePromisified) {
            obj2[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
          } else {
            var promisified = promisifier(fn, function() {
              return makeNodePromisified(
                key,
                THIS,
                key,
                fn,
                suffix,
                multiArgs
              );
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj2[promisifiedKey] = promisified;
          }
        }
        util.toFastProperties(obj2);
        return obj2;
      }
      function promisify(callback, receiver, multiArgs) {
        return makeNodePromisified(
          callback,
          receiver,
          void 0,
          callback,
          null,
          multiArgs
        );
      }
      Promise2.promisify = function(fn, options) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        if (isPromisified(fn)) {
          return fn;
        }
        options = Object(options);
        var receiver = options.context === void 0 ? THIS : options.context;
        var multiArgs = !!options.multiArgs;
        var ret2 = promisify(fn, receiver, multiArgs);
        util.copyDescriptors(fn, ret2, propsFilter);
        return ret2;
      };
      Promise2.promisifyAll = function(target, options) {
        if (typeof target !== "function" && typeof target !== "object") {
          throw new TypeError2("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        options = Object(options);
        var multiArgs = !!options.multiArgs;
        var suffix = options.suffix;
        if (typeof suffix !== "string")
          suffix = defaultSuffix;
        var filter = options.filter;
        if (typeof filter !== "function")
          filter = defaultFilter;
        var promisifier = options.promisifier;
        if (typeof promisifier !== "function")
          promisifier = makeNodePromisified;
        if (!util.isIdentifier(suffix)) {
          throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
        }
        var keys = util.inheritedDataKeys(target);
        for (var i = 0; i < keys.length; ++i) {
          var value = target[keys[i]];
          if (keys[i] !== "constructor" && util.isClass(value)) {
            promisifyAll(
              value.prototype,
              suffix,
              filter,
              promisifier,
              multiArgs
            );
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
          }
        }
        return promisifyAll(target, suffix, filter, promisifier, multiArgs);
      };
    };
  }
});

// node_modules/bluebird/js/release/props.js
var require_props = __commonJS({
  "node_modules/bluebird/js/release/props.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, tryConvertToPromise, apiRejection) {
      var util = require_util();
      var isObject2 = util.isObject;
      var es52 = require_es5();
      var Es6Map;
      if (typeof Map === "function")
        Es6Map = Map;
      var mapToEntries = function() {
        var index = 0;
        var size = 0;
        function extractEntry(value, key) {
          this[index] = value;
          this[index + size] = key;
          index++;
        }
        return function mapToEntries2(map) {
          size = map.size;
          index = 0;
          var ret2 = new Array(map.size * 2);
          map.forEach(extractEntry, ret2);
          return ret2;
        };
      }();
      var entriesToMap = function(entries) {
        var ret2 = new Es6Map();
        var length = entries.length / 2 | 0;
        for (var i = 0; i < length; ++i) {
          var key = entries[length + i];
          var value = entries[i];
          ret2.set(key, value);
        }
        return ret2;
      };
      function PropertiesPromiseArray(obj2) {
        var isMap = false;
        var entries;
        if (Es6Map !== void 0 && obj2 instanceof Es6Map) {
          entries = mapToEntries(obj2);
          isMap = true;
        } else {
          var keys = es52.keys(obj2);
          var len = keys.length;
          entries = new Array(len * 2);
          for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj2[key];
            entries[i + len] = key;
          }
        }
        this.constructor$(entries);
        this._isMap = isMap;
        this._init$(void 0, -3);
      }
      util.inherits(PropertiesPromiseArray, PromiseArray);
      PropertiesPromiseArray.prototype._init = function() {
      };
      PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
        this._values[index] = value;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          var val;
          if (this._isMap) {
            val = entriesToMap(this._values);
          } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
              val[this._values[i + keyOffset]] = this._values[i];
            }
          }
          this._resolve(val);
          return true;
        }
        return false;
      };
      PropertiesPromiseArray.prototype.shouldCopyValues = function() {
        return false;
      };
      PropertiesPromiseArray.prototype.getActualLength = function(len) {
        return len >> 1;
      };
      function props(promises) {
        var ret2;
        var castValue = tryConvertToPromise(promises);
        if (!isObject2(castValue)) {
          return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
        } else if (castValue instanceof Promise2) {
          ret2 = castValue._then(
            Promise2.props,
            void 0,
            void 0,
            void 0,
            void 0
          );
        } else {
          ret2 = new PropertiesPromiseArray(castValue).promise();
        }
        if (castValue instanceof Promise2) {
          ret2._propagateFrom(castValue, 2);
        }
        return ret2;
      }
      Promise2.prototype.props = function() {
        return props(this);
      };
      Promise2.props = function(promises) {
        return props(promises);
      };
    };
  }
});

// node_modules/bluebird/js/release/race.js
var require_race = __commonJS({
  "node_modules/bluebird/js/release/race.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection) {
      var util = require_util();
      var raceLater = function(promise) {
        return promise.then(function(array) {
          return race(array, promise);
        });
      };
      function race(promises, parent) {
        var maybePromise = tryConvertToPromise(promises);
        if (maybePromise instanceof Promise2) {
          return raceLater(maybePromise);
        } else {
          promises = util.asArray(promises);
          if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
        }
        var ret2 = new Promise2(INTERNAL);
        if (parent !== void 0) {
          ret2._propagateFrom(parent, 3);
        }
        var fulfill = ret2._fulfill;
        var reject = ret2._reject;
        for (var i = 0, len = promises.length; i < len; ++i) {
          var val = promises[i];
          if (val === void 0 && !(i in promises)) {
            continue;
          }
          Promise2.cast(val)._then(fulfill, reject, void 0, ret2, null);
        }
        return ret2;
      }
      Promise2.race = function(promises) {
        return race(promises, void 0);
      };
      Promise2.prototype.race = function() {
        return race(this, void 0);
      };
    };
  }
});

// node_modules/bluebird/js/release/reduce.js
var require_reduce = __commonJS({
  "node_modules/bluebird/js/release/reduce.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
      var getDomain = Promise2._getDomain;
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      function ReductionPromiseArray(promises, fn, initialValue, _each) {
        this.constructor$(promises);
        var domain = getDomain();
        this._fn = domain === null ? fn : util.domainBind(domain, fn);
        if (initialValue !== void 0) {
          initialValue = Promise2.resolve(initialValue);
          initialValue._attachCancellationCallback(this);
        }
        this._initialValue = initialValue;
        this._currentCancellable = null;
        if (_each === INTERNAL) {
          this._eachValues = Array(this._length);
        } else if (_each === 0) {
          this._eachValues = null;
        } else {
          this._eachValues = void 0;
        }
        this._promise._captureStackTrace();
        this._init$(void 0, -5);
      }
      util.inherits(ReductionPromiseArray, PromiseArray);
      ReductionPromiseArray.prototype._gotAccum = function(accum) {
        if (this._eachValues !== void 0 && this._eachValues !== null && accum !== INTERNAL) {
          this._eachValues.push(accum);
        }
      };
      ReductionPromiseArray.prototype._eachComplete = function(value) {
        if (this._eachValues !== null) {
          this._eachValues.push(value);
        }
        return this._eachValues;
      };
      ReductionPromiseArray.prototype._init = function() {
      };
      ReductionPromiseArray.prototype._resolveEmptyArray = function() {
        this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
      };
      ReductionPromiseArray.prototype.shouldCopyValues = function() {
        return false;
      };
      ReductionPromiseArray.prototype._resolve = function(value) {
        this._promise._resolveCallback(value);
        this._values = null;
      };
      ReductionPromiseArray.prototype._resultCancelled = function(sender) {
        if (sender === this._initialValue)
          return this._cancel();
        if (this._isResolved())
          return;
        this._resultCancelled$();
        if (this._currentCancellable instanceof Promise2) {
          this._currentCancellable.cancel();
        }
        if (this._initialValue instanceof Promise2) {
          this._initialValue.cancel();
        }
      };
      ReductionPromiseArray.prototype._iterate = function(values) {
        this._values = values;
        var value;
        var i;
        var length = values.length;
        if (this._initialValue !== void 0) {
          value = this._initialValue;
          i = 0;
        } else {
          value = Promise2.resolve(values[0]);
          i = 1;
        }
        this._currentCancellable = value;
        if (!value.isRejected()) {
          for (; i < length; ++i) {
            var ctx = {
              accum: null,
              value: values[i],
              index: i,
              length,
              array: this
            };
            value = value._then(gotAccum, void 0, void 0, ctx, void 0);
          }
        }
        if (this._eachValues !== void 0) {
          value = value._then(this._eachComplete, void 0, void 0, this, void 0);
        }
        value._then(completed, completed, void 0, value, this);
      };
      Promise2.prototype.reduce = function(fn, initialValue) {
        return reduce(this, fn, initialValue, null);
      };
      Promise2.reduce = function(promises, fn, initialValue, _each) {
        return reduce(promises, fn, initialValue, _each);
      };
      function completed(valueOrReason, array) {
        if (this.isFulfilled()) {
          array._resolve(valueOrReason);
        } else {
          array._reject(valueOrReason);
        }
      }
      function reduce(promises, fn, initialValue, _each) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
        return array.promise();
      }
      function gotAccum(accum) {
        this.accum = accum;
        this.array._gotAccum(accum);
        var value = tryConvertToPromise(this.value, this.array._promise);
        if (value instanceof Promise2) {
          this.array._currentCancellable = value;
          return value._then(gotValue, void 0, void 0, this, void 0);
        } else {
          return gotValue.call(this, value);
        }
      }
      function gotValue(value) {
        var array = this.array;
        var promise = array._promise;
        var fn = tryCatch2(array._fn);
        promise._pushContext();
        var ret2;
        if (array._eachValues !== void 0) {
          ret2 = fn.call(promise._boundValue(), value, this.index, this.length);
        } else {
          ret2 = fn.call(
            promise._boundValue(),
            this.accum,
            value,
            this.index,
            this.length
          );
        }
        if (ret2 instanceof Promise2) {
          array._currentCancellable = ret2;
        }
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
          ret2,
          promiseCreated,
          array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce",
          promise
        );
        return ret2;
      }
    };
  }
});

// node_modules/bluebird/js/release/settle.js
var require_settle = __commonJS({
  "node_modules/bluebird/js/release/settle.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, debug) {
      var PromiseInspection = Promise2.PromiseInspection;
      var util = require_util();
      function SettledPromiseArray(values) {
        this.constructor$(values);
      }
      util.inherits(SettledPromiseArray, PromiseArray);
      SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
        this._values[index] = inspection;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          this._resolve(this._values);
          return true;
        }
        return false;
      };
      SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
        var ret2 = new PromiseInspection();
        ret2._bitField = 33554432;
        ret2._settledValueField = value;
        return this._promiseResolved(index, ret2);
      };
      SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
        var ret2 = new PromiseInspection();
        ret2._bitField = 16777216;
        ret2._settledValueField = reason;
        return this._promiseResolved(index, ret2);
      };
      Promise2.settle = function(promises) {
        debug.deprecated(".settle()", ".reflect()");
        return new SettledPromiseArray(promises).promise();
      };
      Promise2.prototype.settle = function() {
        return Promise2.settle(this);
      };
    };
  }
});

// node_modules/bluebird/js/release/some.js
var require_some = __commonJS({
  "node_modules/bluebird/js/release/some.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection) {
      var util = require_util();
      var RangeError2 = require_errors().RangeError;
      var AggregateError = require_errors().AggregateError;
      var isArray = util.isArray;
      var CANCELLATION = {};
      function SomePromiseArray(values) {
        this.constructor$(values);
        this._howMany = 0;
        this._unwrap = false;
        this._initialized = false;
      }
      util.inherits(SomePromiseArray, PromiseArray);
      SomePromiseArray.prototype._init = function() {
        if (!this._initialized) {
          return;
        }
        if (this._howMany === 0) {
          this._resolve([]);
          return;
        }
        this._init$(void 0, -5);
        var isArrayResolved = isArray(this._values);
        if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
          this._reject(this._getRangeError(this.length()));
        }
      };
      SomePromiseArray.prototype.init = function() {
        this._initialized = true;
        this._init();
      };
      SomePromiseArray.prototype.setUnwrap = function() {
        this._unwrap = true;
      };
      SomePromiseArray.prototype.howMany = function() {
        return this._howMany;
      };
      SomePromiseArray.prototype.setHowMany = function(count) {
        this._howMany = count;
      };
      SomePromiseArray.prototype._promiseFulfilled = function(value) {
        this._addFulfilled(value);
        if (this._fulfilled() === this.howMany()) {
          this._values.length = this.howMany();
          if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
          } else {
            this._resolve(this._values);
          }
          return true;
        }
        return false;
      };
      SomePromiseArray.prototype._promiseRejected = function(reason) {
        this._addRejected(reason);
        return this._checkOutcome();
      };
      SomePromiseArray.prototype._promiseCancelled = function() {
        if (this._values instanceof Promise2 || this._values == null) {
          return this._cancel();
        }
        this._addRejected(CANCELLATION);
        return this._checkOutcome();
      };
      SomePromiseArray.prototype._checkOutcome = function() {
        if (this.howMany() > this._canPossiblyFulfill()) {
          var e = new AggregateError();
          for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
              e.push(this._values[i]);
            }
          }
          if (e.length > 0) {
            this._reject(e);
          } else {
            this._cancel();
          }
          return true;
        }
        return false;
      };
      SomePromiseArray.prototype._fulfilled = function() {
        return this._totalResolved;
      };
      SomePromiseArray.prototype._rejected = function() {
        return this._values.length - this.length();
      };
      SomePromiseArray.prototype._addRejected = function(reason) {
        this._values.push(reason);
      };
      SomePromiseArray.prototype._addFulfilled = function(value) {
        this._values[this._totalResolved++] = value;
      };
      SomePromiseArray.prototype._canPossiblyFulfill = function() {
        return this.length() - this._rejected();
      };
      SomePromiseArray.prototype._getRangeError = function(count) {
        var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
        return new RangeError2(message);
      };
      SomePromiseArray.prototype._resolveEmptyArray = function() {
        this._reject(this._getRangeError(0));
      };
      function some(promises, howMany) {
        if ((howMany | 0) !== howMany || howMany < 0) {
          return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
        }
        var ret2 = new SomePromiseArray(promises);
        var promise = ret2.promise();
        ret2.setHowMany(howMany);
        ret2.init();
        return promise;
      }
      Promise2.some = function(promises, howMany) {
        return some(promises, howMany);
      };
      Promise2.prototype.some = function(howMany) {
        return some(this, howMany);
      };
      Promise2._SomePromiseArray = SomePromiseArray;
    };
  }
});

// node_modules/bluebird/js/release/filter.js
var require_filter = __commonJS({
  "node_modules/bluebird/js/release/filter.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var PromiseMap = Promise2.map;
      Promise2.prototype.filter = function(fn, options) {
        return PromiseMap(this, fn, options, INTERNAL);
      };
      Promise2.filter = function(promises, fn, options) {
        return PromiseMap(promises, fn, options, INTERNAL);
      };
    };
  }
});

// node_modules/bluebird/js/release/each.js
var require_each = __commonJS({
  "node_modules/bluebird/js/release/each.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var PromiseReduce = Promise2.reduce;
      var PromiseAll = Promise2.all;
      function promiseAllThis() {
        return PromiseAll(this);
      }
      function PromiseMapSeries(promises, fn) {
        return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
      }
      Promise2.prototype.each = function(fn) {
        return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
      };
      Promise2.prototype.mapSeries = function(fn) {
        return PromiseReduce(this, fn, INTERNAL, INTERNAL);
      };
      Promise2.each = function(promises, fn) {
        return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
      };
      Promise2.mapSeries = PromiseMapSeries;
    };
  }
});

// node_modules/bluebird/js/release/any.js
var require_any = __commonJS({
  "node_modules/bluebird/js/release/any.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var SomePromiseArray = Promise2._SomePromiseArray;
      function any(promises) {
        var ret2 = new SomePromiseArray(promises);
        var promise = ret2.promise();
        ret2.setHowMany(1);
        ret2.setUnwrap();
        ret2.init();
        return promise;
      }
      Promise2.any = function(promises) {
        return any(promises);
      };
      Promise2.prototype.any = function() {
        return any(this);
      };
    };
  }
});

// node_modules/bluebird/js/release/promise.js
var require_promise = __commonJS({
  "node_modules/bluebird/js/release/promise.js"(exports2, module2) {
    "use strict";
    module2.exports = function() {
      var makeSelfResolutionError = function() {
        return new TypeError2("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
      };
      var reflectHandler = function() {
        return new Promise2.PromiseInspection(this._target());
      };
      var apiRejection = function(msg) {
        return Promise2.reject(new TypeError2(msg));
      };
      function Proxyable() {
      }
      var UNDEFINED_BINDING = {};
      var util = require_util();
      var getDomain;
      if (util.isNode) {
        getDomain = function() {
          var ret2 = process.domain;
          if (ret2 === void 0)
            ret2 = null;
          return ret2;
        };
      } else {
        getDomain = function() {
          return null;
        };
      }
      util.notEnumerableProp(Promise2, "_getDomain", getDomain);
      var es52 = require_es5();
      var Async = require_async();
      var async = new Async();
      es52.defineProperty(Promise2, "_async", { value: async });
      var errors = require_errors();
      var TypeError2 = Promise2.TypeError = errors.TypeError;
      Promise2.RangeError = errors.RangeError;
      var CancellationError = Promise2.CancellationError = errors.CancellationError;
      Promise2.TimeoutError = errors.TimeoutError;
      Promise2.OperationalError = errors.OperationalError;
      Promise2.RejectionError = errors.OperationalError;
      Promise2.AggregateError = errors.AggregateError;
      var INTERNAL = function() {
      };
      var APPLY = {};
      var NEXT_FILTER = {};
      var tryConvertToPromise = require_thenables()(Promise2, INTERNAL);
      var PromiseArray = require_promise_array()(
        Promise2,
        INTERNAL,
        tryConvertToPromise,
        apiRejection,
        Proxyable
      );
      var Context = require_context()(Promise2);
      var createContext = Context.create;
      var debug = require_debuggability()(Promise2, Context);
      var CapturedTrace = debug.CapturedTrace;
      var PassThroughHandlerContext = require_finally()(Promise2, tryConvertToPromise);
      var catchFilter = require_catch_filter()(NEXT_FILTER);
      var nodebackForPromise = require_nodeback();
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      function check(self2, executor) {
        if (typeof executor !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(executor));
        }
        if (self2.constructor !== Promise2) {
          throw new TypeError2("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
        }
      }
      function Promise2(executor) {
        this._bitField = 0;
        this._fulfillmentHandler0 = void 0;
        this._rejectionHandler0 = void 0;
        this._promise0 = void 0;
        this._receiver0 = void 0;
        if (executor !== INTERNAL) {
          check(this, executor);
          this._resolveFromExecutor(executor);
        }
        this._promiseCreated();
        this._fireEvent("promiseCreated", this);
      }
      Promise2.prototype.toString = function() {
        return "[object Promise]";
      };
      Promise2.prototype.caught = Promise2.prototype["catch"] = function(fn) {
        var len = arguments.length;
        if (len > 1) {
          var catchInstances = new Array(len - 1), j = 0, i;
          for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
              catchInstances[j++] = item;
            } else {
              return apiRejection("expecting an object but got A catch statement predicate " + util.classString(item));
            }
          }
          catchInstances.length = j;
          fn = arguments[i];
          return this.then(void 0, catchFilter(catchInstances, fn, this));
        }
        return this.then(void 0, fn);
      };
      Promise2.prototype.reflect = function() {
        return this._then(
          reflectHandler,
          reflectHandler,
          void 0,
          this,
          void 0
        );
      };
      Promise2.prototype.then = function(didFulfill, didReject) {
        if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
          var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
          if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
          }
          this._warn(msg);
        }
        return this._then(didFulfill, didReject, void 0, void 0, void 0);
      };
      Promise2.prototype.done = function(didFulfill, didReject) {
        var promise = this._then(didFulfill, didReject, void 0, void 0, void 0);
        promise._setIsFinal();
      };
      Promise2.prototype.spread = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        return this.all()._then(fn, void 0, void 0, APPLY, void 0);
      };
      Promise2.prototype.toJSON = function() {
        var ret2 = {
          isFulfilled: false,
          isRejected: false,
          fulfillmentValue: void 0,
          rejectionReason: void 0
        };
        if (this.isFulfilled()) {
          ret2.fulfillmentValue = this.value();
          ret2.isFulfilled = true;
        } else if (this.isRejected()) {
          ret2.rejectionReason = this.reason();
          ret2.isRejected = true;
        }
        return ret2;
      };
      Promise2.prototype.all = function() {
        if (arguments.length > 0) {
          this._warn(".all() was passed arguments but it does not take any");
        }
        return new PromiseArray(this).promise();
      };
      Promise2.prototype.error = function(fn) {
        return this.caught(util.originatesFromRejection, fn);
      };
      Promise2.getNewLibraryCopy = module2.exports;
      Promise2.is = function(val) {
        return val instanceof Promise2;
      };
      Promise2.fromNode = Promise2.fromCallback = function(fn) {
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
        var result = tryCatch2(fn)(nodebackForPromise(ret2, multiArgs));
        if (result === errorObj2) {
          ret2._rejectCallback(result.e, true);
        }
        if (!ret2._isFateSealed())
          ret2._setAsyncGuaranteed();
        return ret2;
      };
      Promise2.all = function(promises) {
        return new PromiseArray(promises).promise();
      };
      Promise2.cast = function(obj2) {
        var ret2 = tryConvertToPromise(obj2);
        if (!(ret2 instanceof Promise2)) {
          ret2 = new Promise2(INTERNAL);
          ret2._captureStackTrace();
          ret2._setFulfilled();
          ret2._rejectionHandler0 = obj2;
        }
        return ret2;
      };
      Promise2.resolve = Promise2.fulfilled = Promise2.cast;
      Promise2.reject = Promise2.rejected = function(reason) {
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        ret2._rejectCallback(reason, true);
        return ret2;
      };
      Promise2.setScheduler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        return async.setScheduler(fn);
      };
      Promise2.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
        var haveInternalData = internalData !== void 0;
        var promise = haveInternalData ? internalData : new Promise2(INTERNAL);
        var target = this._target();
        var bitField = target._bitField;
        if (!haveInternalData) {
          promise._propagateFrom(this, 3);
          promise._captureStackTrace();
          if (receiver === void 0 && (this._bitField & 2097152) !== 0) {
            if (!((bitField & 50397184) === 0)) {
              receiver = this._boundValue();
            } else {
              receiver = target === this ? void 0 : this._boundTo;
            }
          }
          this._fireEvent("promiseChained", this, promise);
        }
        var domain = getDomain();
        if (!((bitField & 50397184) === 0)) {
          var handler, value, settler = target._settlePromiseCtx;
          if ((bitField & 33554432) !== 0) {
            value = target._rejectionHandler0;
            handler = didFulfill;
          } else if ((bitField & 16777216) !== 0) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
          } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
          }
          async.invoke(settler, target, {
            handler: domain === null ? handler : typeof handler === "function" && util.domainBind(domain, handler),
            promise,
            receiver,
            value
          });
        } else {
          target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
        }
        return promise;
      };
      Promise2.prototype._length = function() {
        return this._bitField & 65535;
      };
      Promise2.prototype._isFateSealed = function() {
        return (this._bitField & 117506048) !== 0;
      };
      Promise2.prototype._isFollowing = function() {
        return (this._bitField & 67108864) === 67108864;
      };
      Promise2.prototype._setLength = function(len) {
        this._bitField = this._bitField & -65536 | len & 65535;
      };
      Promise2.prototype._setFulfilled = function() {
        this._bitField = this._bitField | 33554432;
        this._fireEvent("promiseFulfilled", this);
      };
      Promise2.prototype._setRejected = function() {
        this._bitField = this._bitField | 16777216;
        this._fireEvent("promiseRejected", this);
      };
      Promise2.prototype._setFollowing = function() {
        this._bitField = this._bitField | 67108864;
        this._fireEvent("promiseResolved", this);
      };
      Promise2.prototype._setIsFinal = function() {
        this._bitField = this._bitField | 4194304;
      };
      Promise2.prototype._isFinal = function() {
        return (this._bitField & 4194304) > 0;
      };
      Promise2.prototype._unsetCancelled = function() {
        this._bitField = this._bitField & ~65536;
      };
      Promise2.prototype._setCancelled = function() {
        this._bitField = this._bitField | 65536;
        this._fireEvent("promiseCancelled", this);
      };
      Promise2.prototype._setWillBeCancelled = function() {
        this._bitField = this._bitField | 8388608;
      };
      Promise2.prototype._setAsyncGuaranteed = function() {
        if (async.hasCustomScheduler())
          return;
        this._bitField = this._bitField | 134217728;
      };
      Promise2.prototype._receiverAt = function(index) {
        var ret2 = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
        if (ret2 === UNDEFINED_BINDING) {
          return void 0;
        } else if (ret2 === void 0 && this._isBound()) {
          return this._boundValue();
        }
        return ret2;
      };
      Promise2.prototype._promiseAt = function(index) {
        return this[index * 4 - 4 + 2];
      };
      Promise2.prototype._fulfillmentHandlerAt = function(index) {
        return this[index * 4 - 4 + 0];
      };
      Promise2.prototype._rejectionHandlerAt = function(index) {
        return this[index * 4 - 4 + 1];
      };
      Promise2.prototype._boundValue = function() {
      };
      Promise2.prototype._migrateCallback0 = function(follower) {
        var bitField = follower._bitField;
        var fulfill = follower._fulfillmentHandler0;
        var reject = follower._rejectionHandler0;
        var promise = follower._promise0;
        var receiver = follower._receiverAt(0);
        if (receiver === void 0)
          receiver = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise, receiver, null);
      };
      Promise2.prototype._migrateCallbackAt = function(follower, index) {
        var fulfill = follower._fulfillmentHandlerAt(index);
        var reject = follower._rejectionHandlerAt(index);
        var promise = follower._promiseAt(index);
        var receiver = follower._receiverAt(index);
        if (receiver === void 0)
          receiver = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise, receiver, null);
      };
      Promise2.prototype._addCallbacks = function(fulfill, reject, promise, receiver, domain) {
        var index = this._length();
        if (index >= 65535 - 4) {
          index = 0;
          this._setLength(0);
        }
        if (index === 0) {
          this._promise0 = promise;
          this._receiver0 = receiver;
          if (typeof fulfill === "function") {
            this._fulfillmentHandler0 = domain === null ? fulfill : util.domainBind(domain, fulfill);
          }
          if (typeof reject === "function") {
            this._rejectionHandler0 = domain === null ? reject : util.domainBind(domain, reject);
          }
        } else {
          var base = index * 4 - 4;
          this[base + 2] = promise;
          this[base + 3] = receiver;
          if (typeof fulfill === "function") {
            this[base + 0] = domain === null ? fulfill : util.domainBind(domain, fulfill);
          }
          if (typeof reject === "function") {
            this[base + 1] = domain === null ? reject : util.domainBind(domain, reject);
          }
        }
        this._setLength(index + 1);
        return index;
      };
      Promise2.prototype._proxy = function(proxyable, arg) {
        this._addCallbacks(void 0, void 0, arg, proxyable, null);
      };
      Promise2.prototype._resolveCallback = function(value, shouldBind) {
        if ((this._bitField & 117506048) !== 0)
          return;
        if (value === this)
          return this._rejectCallback(makeSelfResolutionError(), false);
        var maybePromise = tryConvertToPromise(value, this);
        if (!(maybePromise instanceof Promise2))
          return this._fulfill(value);
        if (shouldBind)
          this._propagateFrom(maybePromise, 2);
        var promise = maybePromise._target();
        if (promise === this) {
          this._reject(makeSelfResolutionError());
          return;
        }
        var bitField = promise._bitField;
        if ((bitField & 50397184) === 0) {
          var len = this._length();
          if (len > 0)
            promise._migrateCallback0(this);
          for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
          }
          this._setFollowing();
          this._setLength(0);
          this._setFollowee(promise);
        } else if ((bitField & 33554432) !== 0) {
          this._fulfill(promise._value());
        } else if ((bitField & 16777216) !== 0) {
          this._reject(promise._reason());
        } else {
          var reason = new CancellationError("late cancellation observer");
          promise._attachExtraTrace(reason);
          this._reject(reason);
        }
      };
      Promise2.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
        var trace = util.ensureErrorObject(reason);
        var hasStack = trace === reason;
        if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
          var message = "a promise was rejected with a non-error: " + util.classString(reason);
          this._warn(message, true);
        }
        this._attachExtraTrace(trace, synchronous ? hasStack : false);
        this._reject(reason);
      };
      Promise2.prototype._resolveFromExecutor = function(executor) {
        var promise = this;
        this._captureStackTrace();
        this._pushContext();
        var synchronous = true;
        var r = this._execute(executor, function(value) {
          promise._resolveCallback(value);
        }, function(reason) {
          promise._rejectCallback(reason, synchronous);
        });
        synchronous = false;
        this._popContext();
        if (r !== void 0) {
          promise._rejectCallback(r, true);
        }
      };
      Promise2.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
        var bitField = promise._bitField;
        if ((bitField & 65536) !== 0)
          return;
        promise._pushContext();
        var x;
        if (receiver === APPLY) {
          if (!value || typeof value.length !== "number") {
            x = errorObj2;
            x.e = new TypeError2("cannot .spread() a non-array: " + util.classString(value));
          } else {
            x = tryCatch2(handler).apply(this._boundValue(), value);
          }
        } else {
          x = tryCatch2(handler).call(receiver, value);
        }
        var promiseCreated = promise._popContext();
        bitField = promise._bitField;
        if ((bitField & 65536) !== 0)
          return;
        if (x === NEXT_FILTER) {
          promise._reject(value);
        } else if (x === errorObj2) {
          promise._rejectCallback(x.e, false);
        } else {
          debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
          promise._resolveCallback(x);
        }
      };
      Promise2.prototype._target = function() {
        var ret2 = this;
        while (ret2._isFollowing())
          ret2 = ret2._followee();
        return ret2;
      };
      Promise2.prototype._followee = function() {
        return this._rejectionHandler0;
      };
      Promise2.prototype._setFollowee = function(promise) {
        this._rejectionHandler0 = promise;
      };
      Promise2.prototype._settlePromise = function(promise, handler, receiver, value) {
        var isPromise = promise instanceof Promise2;
        var bitField = this._bitField;
        var asyncGuaranteed = (bitField & 134217728) !== 0;
        if ((bitField & 65536) !== 0) {
          if (isPromise)
            promise._invokeInternalOnCancel();
          if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch2(handler).call(receiver, value) === errorObj2) {
              promise._reject(errorObj2.e);
            }
          } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
          } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
          } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
          } else {
            receiver.cancel();
          }
        } else if (typeof handler === "function") {
          if (!isPromise) {
            handler.call(receiver, value, promise);
          } else {
            if (asyncGuaranteed)
              promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
          }
        } else if (receiver instanceof Proxyable) {
          if (!receiver._isResolved()) {
            if ((bitField & 33554432) !== 0) {
              receiver._promiseFulfilled(value, promise);
            } else {
              receiver._promiseRejected(value, promise);
            }
          }
        } else if (isPromise) {
          if (asyncGuaranteed)
            promise._setAsyncGuaranteed();
          if ((bitField & 33554432) !== 0) {
            promise._fulfill(value);
          } else {
            promise._reject(value);
          }
        }
      };
      Promise2.prototype._settlePromiseLateCancellationObserver = function(ctx) {
        var handler = ctx.handler;
        var promise = ctx.promise;
        var receiver = ctx.receiver;
        var value = ctx.value;
        if (typeof handler === "function") {
          if (!(promise instanceof Promise2)) {
            handler.call(receiver, value, promise);
          } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
          }
        } else if (promise instanceof Promise2) {
          promise._reject(value);
        }
      };
      Promise2.prototype._settlePromiseCtx = function(ctx) {
        this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
      };
      Promise2.prototype._settlePromise0 = function(handler, value, bitField) {
        var promise = this._promise0;
        var receiver = this._receiverAt(0);
        this._promise0 = void 0;
        this._receiver0 = void 0;
        this._settlePromise(promise, handler, receiver, value);
      };
      Promise2.prototype._clearCallbackDataAtIndex = function(index) {
        var base = index * 4 - 4;
        this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
      };
      Promise2.prototype._fulfill = function(value) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16)
          return;
        if (value === this) {
          var err = makeSelfResolutionError();
          this._attachExtraTrace(err);
          return this._reject(err);
        }
        this._setFulfilled();
        this._rejectionHandler0 = value;
        if ((bitField & 65535) > 0) {
          if ((bitField & 134217728) !== 0) {
            this._settlePromises();
          } else {
            async.settlePromises(this);
          }
        }
      };
      Promise2.prototype._reject = function(reason) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16)
          return;
        this._setRejected();
        this._fulfillmentHandler0 = reason;
        if (this._isFinal()) {
          return async.fatalError(reason, util.isNode);
        }
        if ((bitField & 65535) > 0) {
          async.settlePromises(this);
        } else {
          this._ensurePossibleRejectionHandled();
        }
      };
      Promise2.prototype._fulfillPromises = function(len, value) {
        for (var i = 1; i < len; i++) {
          var handler = this._fulfillmentHandlerAt(i);
          var promise = this._promiseAt(i);
          var receiver = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise, handler, receiver, value);
        }
      };
      Promise2.prototype._rejectPromises = function(len, reason) {
        for (var i = 1; i < len; i++) {
          var handler = this._rejectionHandlerAt(i);
          var promise = this._promiseAt(i);
          var receiver = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise, handler, receiver, reason);
        }
      };
      Promise2.prototype._settlePromises = function() {
        var bitField = this._bitField;
        var len = bitField & 65535;
        if (len > 0) {
          if ((bitField & 16842752) !== 0) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
          } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
          }
          this._setLength(0);
        }
        this._clearCancellationData();
      };
      Promise2.prototype._settledValue = function() {
        var bitField = this._bitField;
        if ((bitField & 33554432) !== 0) {
          return this._rejectionHandler0;
        } else if ((bitField & 16777216) !== 0) {
          return this._fulfillmentHandler0;
        }
      };
      function deferResolve(v) {
        this.promise._resolveCallback(v);
      }
      function deferReject(v) {
        this.promise._rejectCallback(v, false);
      }
      Promise2.defer = Promise2.pending = function() {
        debug.deprecated("Promise.defer", "new Promise");
        var promise = new Promise2(INTERNAL);
        return {
          promise,
          resolve: deferResolve,
          reject: deferReject
        };
      };
      util.notEnumerableProp(
        Promise2,
        "_makeSelfResolutionError",
        makeSelfResolutionError
      );
      require_method()(
        Promise2,
        INTERNAL,
        tryConvertToPromise,
        apiRejection,
        debug
      );
      require_bind()(Promise2, INTERNAL, tryConvertToPromise, debug);
      require_cancel()(Promise2, PromiseArray, apiRejection, debug);
      require_direct_resolve()(Promise2);
      require_synchronous_inspection()(Promise2);
      require_join()(
        Promise2,
        PromiseArray,
        tryConvertToPromise,
        INTERNAL,
        async,
        getDomain
      );
      Promise2.Promise = Promise2;
      Promise2.version = "3.4.7";
      require_map()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      require_call_get()(Promise2);
      require_using()(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
      require_timers()(Promise2, INTERNAL, debug);
      require_generators()(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
      require_nodeify()(Promise2);
      require_promisify()(Promise2, INTERNAL);
      require_props()(Promise2, PromiseArray, tryConvertToPromise, apiRejection);
      require_race()(Promise2, INTERNAL, tryConvertToPromise, apiRejection);
      require_reduce()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      require_settle()(Promise2, PromiseArray, debug);
      require_some()(Promise2, PromiseArray, apiRejection);
      require_filter()(Promise2, INTERNAL);
      require_each()(Promise2, INTERNAL);
      require_any()(Promise2);
      util.toFastProperties(Promise2);
      util.toFastProperties(Promise2.prototype);
      function fillTypes(value) {
        var p = new Promise2(INTERNAL);
        p._fulfillmentHandler0 = value;
        p._rejectionHandler0 = value;
        p._promise0 = value;
        p._receiver0 = value;
      }
      fillTypes({ a: 1 });
      fillTypes({ b: 2 });
      fillTypes({ c: 3 });
      fillTypes(1);
      fillTypes(function() {
      });
      fillTypes(void 0);
      fillTypes(false);
      fillTypes(new Promise2(INTERNAL));
      debug.setBounds(Async.firstLineError, util.lastLineError);
      return Promise2;
    };
  }
});

// node_modules/bluebird/js/release/bluebird.js
var require_bluebird = __commonJS({
  "node_modules/bluebird/js/release/bluebird.js"(exports2, module2) {
    "use strict";
    var old;
    if (typeof Promise !== "undefined")
      old = Promise;
    function noConflict() {
      try {
        if (Promise === bluebird)
          Promise = old;
      } catch (e) {
      }
      return bluebird;
    }
    var bluebird = require_promise()();
    bluebird.noConflict = noConflict;
    module2.exports = bluebird;
  }
});

// node_modules/unzipper/lib/Buffer.js
var require_Buffer = __commonJS({
  "node_modules/unzipper/lib/Buffer.js"(exports2, module2) {
    var Buffer2 = require("buffer").Buffer;
    if (Buffer2.from === void 0) {
      Buffer2.from = function(a, b, c) {
        return new Buffer2(a, b, c);
      };
      Buffer2.alloc = Buffer2.from;
    }
    module2.exports = Buffer2;
  }
});

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "node_modules/process-nextick-args/index.js"(exports2, module2) {
    "use strict";
    if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
      module2.exports = { nextTick };
    } else {
      module2.exports = process;
    }
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn !== "function") {
        throw new TypeError('"callback" argument must be a function');
      }
      var len = arguments.length;
      var args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) {
            args[i++] = arguments[i];
          }
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/isarray/index.js"(exports2, module2) {
    var toString = {}.toString;
    module2.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports2, module2) {
    module2.exports = require("stream");
  }
});

// node_modules/readable-stream/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/readable-stream/node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/core-util-is/lib/util.js
var require_util2 = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports2) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports2.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports2.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports2.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports2.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports2.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports2.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports2.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports2.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports2.isRegExp = isRegExp;
    function isObject2(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports2.isObject = isObject2;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports2.isDate = isDate;
    function isError2(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports2.isError = isError2;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports2.isFunction = isFunction;
    function isPrimitive2(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports2.isPrimitive = isPrimitive2;
    exports2.isBuffer = require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits2(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits2(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports2, module2) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer().Buffer;
    var util = require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module2.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0)
          this.tail.next = entry;
        else
          this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0)
          this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0)
          return;
        var ret2 = this.head.data;
        if (this.length === 1)
          this.head = this.tail = null;
        else
          this.head = this.head.next;
        --this.length;
        return ret2;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (this.length === 0)
          return "";
        var p = this.head;
        var ret2 = "" + p.data;
        while (p = p.next) {
          ret2 += s + p.data;
        }
        return ret2;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0)
          return Buffer2.alloc(0);
        if (this.length === 1)
          return this.head.data;
        var ret2 = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret2, i);
          i += p.data.length;
          p = p.next;
        }
        return ret2;
      };
      return BufferList;
    }();
    if (util && util.inspect && util.inspect.custom) {
      module2.exports.prototype[util.inspect.custom] = function() {
        var obj2 = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj2;
      };
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
          pna.nextTick(emitErrorNT, this, err);
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          pna.nextTick(emitErrorNT, _this, err2);
          if (_this._writableState) {
            _this._writableState.errorEmitted = true;
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports2, module2) {
    module2.exports = require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util2());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = global.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0)
        this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0))
        this.highWaterMark = writableHwm;
      else
        this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret2 = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ended)
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret2 = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret2;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret2 = state.length < state.highWaterMark;
      if (!ret2)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret2;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l2 = state.bufferedRequestCount;
        var buffer = new Array(l2);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          pna.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      if (state.corkedRequestsFree) {
        state.corkedRequestsFree.next = corkReq;
      } else {
        state.corkedRequestsFree = corkReq;
      }
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj2) {
      var keys2 = [];
      for (var key in obj2) {
        keys2.push(key);
      }
      return keys2;
    };
    module2.exports = Duplex;
    var util = Object.create(require_util2());
    util.inherits = require_inherits();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method])
          Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false)
        this.readable = false;
      if (options && options.writable === false)
        this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended)
        return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// node_modules/string_decoder/node_modules/safe-buffer/index.js
var require_safe_buffer2 = __commonJS({
  "node_modules/string_decoder/node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports2) {
    "use strict";
    var Buffer2 = require_safe_buffer2().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports2.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed)
        return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0)
        return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports2, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = global.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var util = Object.create(require_util2());
    util.inherits = require_inherits();
    var debugUtil = require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList();
    var destroyImpl = require_destroy();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0)
        this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0))
        this.highWaterMark = readableHwm;
      else
        this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable))
        return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              stream.emit("error", new Error("stream.unshift() after end event"));
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret2;
      if (n > 0)
        ret2 = fromList(n, state);
      else
        ret2 = null;
      if (ret2 === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret2 !== null)
        this.emit("data", ret2);
      return ret2;
    };
    function onEofChunk(stream, state) {
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync)
          pna.nextTick(emitReadable_, stream);
        else
          emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted)
        pna.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret2 = dest.write(chunk);
        if (false === ret2 && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", src._readableState.awaitDrain);
            src._readableState.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, unpipeInfo);
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret2 = _this.push(chunk);
        if (!ret2) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0)
        return null;
      var ret2;
      if (state.objectMode)
        ret2 = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret2 = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret2 = state.buffer.head.data;
        else
          ret2 = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret2 = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret2;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret2;
      if (n < list.head.data.length) {
        ret2 = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret2 = list.shift();
      } else {
        ret2 = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret2;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret2 = p.data;
      n -= ret2.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length)
          ret2 += str;
        else
          ret2 += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next)
              list.head = p.next;
            else
              list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret2;
    }
    function copyFromBuffer(n, list) {
      var ret2 = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret2);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret2, ret2.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next)
              list.head = p.next;
            else
              list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret2;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0)
        throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l2 = xs.length; i < l2; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports2, module2) {
    "use strict";
    module2.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = Object.create(require_util2());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming)
        throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports2, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = Object.create(require_util2());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports2, module2) {
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream;
      exports2 = module2.exports = Stream.Readable;
      exports2.Readable = Stream.Readable;
      exports2.Writable = Stream.Writable;
      exports2.Duplex = Stream.Duplex;
      exports2.Transform = Stream.Transform;
      exports2.PassThrough = Stream.PassThrough;
      exports2.Stream = Stream;
    } else {
      exports2 = module2.exports = require_stream_readable();
      exports2.Stream = Stream || exports2;
      exports2.Readable = exports2;
      exports2.Writable = require_stream_writable();
      exports2.Duplex = require_stream_duplex();
      exports2.Transform = require_stream_transform();
      exports2.PassThrough = require_stream_passthrough();
    }
  }
});

// node_modules/unzipper/lib/PullStream.js
var require_PullStream = __commonJS({
  "node_modules/unzipper/lib/PullStream.js"(exports2, module2) {
    var Stream = require("stream");
    var Promise2 = require_bluebird();
    var util = require("util");
    var Buffer2 = require_Buffer();
    var strFunction = "function";
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    function PullStream() {
      if (!(this instanceof PullStream))
        return new PullStream();
      Stream.Duplex.call(this, { decodeStrings: false, objectMode: true });
      this.buffer = Buffer2.from("");
      var self2 = this;
      self2.on("finish", function() {
        self2.finished = true;
        self2.emit("chunk", false);
      });
    }
    util.inherits(PullStream, Stream.Duplex);
    PullStream.prototype._write = function(chunk, e, cb) {
      this.buffer = Buffer2.concat([this.buffer, chunk]);
      this.cb = cb;
      this.emit("chunk");
    };
    PullStream.prototype.stream = function(eof, includeEof) {
      var p = Stream.PassThrough();
      var done, self2 = this;
      function cb() {
        if (typeof self2.cb === strFunction) {
          var callback = self2.cb;
          self2.cb = void 0;
          return callback();
        }
      }
      function pull() {
        var packet;
        if (self2.buffer && self2.buffer.length) {
          if (typeof eof === "number") {
            packet = self2.buffer.slice(0, eof);
            self2.buffer = self2.buffer.slice(eof);
            eof -= packet.length;
            done = !eof;
          } else {
            var match = self2.buffer.indexOf(eof);
            if (match !== -1) {
              self2.match = match;
              if (includeEof)
                match = match + eof.length;
              packet = self2.buffer.slice(0, match);
              self2.buffer = self2.buffer.slice(match);
              done = true;
            } else {
              var len = self2.buffer.length - eof.length;
              if (len <= 0) {
                cb();
              } else {
                packet = self2.buffer.slice(0, len);
                self2.buffer = self2.buffer.slice(len);
              }
            }
          }
          if (packet)
            p.write(packet, function() {
              if (self2.buffer.length === 0 || eof.length && self2.buffer.length <= eof.length)
                cb();
            });
        }
        if (!done) {
          if (self2.finished && !this.__ended) {
            self2.removeListener("chunk", pull);
            self2.emit("error", new Error("FILE_ENDED"));
            this.__ended = true;
            return;
          }
        } else {
          self2.removeListener("chunk", pull);
          p.end();
        }
      }
      self2.on("chunk", pull);
      pull();
      return p;
    };
    PullStream.prototype.pull = function(eof, includeEof) {
      if (eof === 0)
        return Promise2.resolve("");
      if (!isNaN(eof) && this.buffer.length > eof) {
        var data = this.buffer.slice(0, eof);
        this.buffer = this.buffer.slice(eof);
        return Promise2.resolve(data);
      }
      var buffer = Buffer2.from(""), self2 = this;
      var concatStream = Stream.Transform();
      concatStream._transform = function(d, e, cb) {
        buffer = Buffer2.concat([buffer, d]);
        cb();
      };
      var rejectHandler;
      var pullStreamRejectHandler;
      return new Promise2(function(resolve2, reject) {
        rejectHandler = reject;
        pullStreamRejectHandler = function(e) {
          self2.__emittedError = e;
          reject(e);
        };
        if (self2.finished)
          return reject(new Error("FILE_ENDED"));
        self2.once("error", pullStreamRejectHandler);
        self2.stream(eof, includeEof).on("error", reject).pipe(concatStream).on("finish", function() {
          resolve2(buffer);
        }).on("error", reject);
      }).finally(function() {
        self2.removeListener("error", rejectHandler);
        self2.removeListener("error", pullStreamRejectHandler);
      });
    };
    PullStream.prototype._read = function() {
    };
    module2.exports = PullStream;
  }
});

// node_modules/unzipper/lib/NoopStream.js
var require_NoopStream = __commonJS({
  "node_modules/unzipper/lib/NoopStream.js"(exports2, module2) {
    var Stream = require("stream");
    var util = require("util");
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    function NoopStream() {
      if (!(this instanceof NoopStream)) {
        return new NoopStream();
      }
      Stream.Transform.call(this);
    }
    util.inherits(NoopStream, Stream.Transform);
    NoopStream.prototype._transform = function(d, e, cb) {
      cb();
    };
    module2.exports = NoopStream;
  }
});

// node_modules/unzipper/lib/BufferStream.js
var require_BufferStream = __commonJS({
  "node_modules/unzipper/lib/BufferStream.js"(exports2, module2) {
    var Promise2 = require_bluebird();
    var Stream = require("stream");
    var Buffer2 = require_Buffer();
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    module2.exports = function(entry) {
      return new Promise2(function(resolve2, reject) {
        var chunks = [];
        var bufferStream = Stream.Transform().on("finish", function() {
          resolve2(Buffer2.concat(chunks));
        }).on("error", reject);
        bufferStream._transform = function(d, e, cb) {
          chunks.push(d);
          cb();
        };
        entry.on("error", reject).pipe(bufferStream);
      });
    };
  }
});

// node_modules/unzipper/lib/parseExtraField.js
var require_parseExtraField = __commonJS({
  "node_modules/unzipper/lib/parseExtraField.js"(exports2, module2) {
    var binary = require_binary();
    module2.exports = function(extraField, vars) {
      var extra;
      while (!extra && extraField && extraField.length) {
        var candidateExtra = binary.parse(extraField).word16lu("signature").word16lu("partsize").word64lu("uncompressedSize").word64lu("compressedSize").word64lu("offset").word64lu("disknum").vars;
        if (candidateExtra.signature === 1) {
          extra = candidateExtra;
        } else {
          extraField = extraField.slice(candidateExtra.partsize + 4);
        }
      }
      extra = extra || {};
      if (vars.compressedSize === 4294967295)
        vars.compressedSize = extra.compressedSize;
      if (vars.uncompressedSize === 4294967295)
        vars.uncompressedSize = extra.uncompressedSize;
      if (vars.offsetToLocalFileHeader === 4294967295)
        vars.offsetToLocalFileHeader = extra.offset;
      return extra;
    };
  }
});

// node_modules/unzipper/lib/parseDateTime.js
var require_parseDateTime = __commonJS({
  "node_modules/unzipper/lib/parseDateTime.js"(exports2, module2) {
    module2.exports = function parseDateTime(date, time) {
      const day = date & 31;
      const month = date >> 5 & 15;
      const year = (date >> 9 & 127) + 1980;
      const seconds = time ? (time & 31) * 2 : 0;
      const minutes = time ? time >> 5 & 63 : 0;
      const hours = time ? time >> 11 : 0;
      return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
    };
  }
});

// node_modules/unzipper/lib/parse.js
var require_parse = __commonJS({
  "node_modules/unzipper/lib/parse.js"(exports2, module2) {
    var util = require("util");
    var zlib = require("zlib");
    var Stream = require("stream");
    var binary = require_binary();
    var Promise2 = require_bluebird();
    var PullStream = require_PullStream();
    var NoopStream = require_NoopStream();
    var BufferStream = require_BufferStream();
    var parseExtraField = require_parseExtraField();
    var Buffer2 = require_Buffer();
    var parseDateTime = require_parseDateTime();
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    var endDirectorySignature = Buffer2.alloc(4);
    endDirectorySignature.writeUInt32LE(101010256, 0);
    function Parse(opts) {
      if (!(this instanceof Parse)) {
        return new Parse(opts);
      }
      var self2 = this;
      self2._opts = opts || { verbose: false };
      PullStream.call(self2, self2._opts);
      self2.on("finish", function() {
        self2.emit("close");
      });
      self2._readRecord().catch(function(e) {
        if (!self2.__emittedError || self2.__emittedError !== e)
          self2.emit("error", e);
      });
    }
    util.inherits(Parse, PullStream);
    Parse.prototype._readRecord = function() {
      var self2 = this;
      return self2.pull(4).then(function(data) {
        if (data.length === 0)
          return;
        var signature = data.readUInt32LE(0);
        if (signature === 875721283) {
          return self2._readCrxHeader();
        }
        if (signature === 67324752) {
          return self2._readFile();
        } else if (signature === 33639248) {
          self2.__ended = true;
          return self2._readCentralDirectoryFileHeader();
        } else if (signature === 101010256) {
          return self2._readEndOfCentralDirectoryRecord();
        } else if (self2.__ended) {
          return self2.pull(endDirectorySignature).then(function() {
            return self2._readEndOfCentralDirectoryRecord();
          });
        } else
          self2.emit("error", new Error("invalid signature: 0x" + signature.toString(16)));
      });
    };
    Parse.prototype._readCrxHeader = function() {
      var self2 = this;
      return self2.pull(12).then(function(data) {
        self2.crxHeader = binary.parse(data).word32lu("version").word32lu("pubKeyLength").word32lu("signatureLength").vars;
        return self2.pull(self2.crxHeader.pubKeyLength + self2.crxHeader.signatureLength);
      }).then(function(data) {
        self2.crxHeader.publicKey = data.slice(0, self2.crxHeader.pubKeyLength);
        self2.crxHeader.signature = data.slice(self2.crxHeader.pubKeyLength);
        self2.emit("crx-header", self2.crxHeader);
        return self2._readRecord();
      });
    };
    Parse.prototype._readFile = function() {
      var self2 = this;
      return self2.pull(26).then(function(data) {
        var vars = binary.parse(data).word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").vars;
        vars.lastModifiedDateTime = parseDateTime(vars.lastModifiedDate, vars.lastModifiedTime);
        if (self2.crxHeader)
          vars.crxHeader = self2.crxHeader;
        return self2.pull(vars.fileNameLength).then(function(fileNameBuffer) {
          var fileName = fileNameBuffer.toString("utf8");
          var entry = Stream.PassThrough();
          var __autodraining = false;
          entry.autodrain = function() {
            __autodraining = true;
            var draining = entry.pipe(NoopStream());
            draining.promise = function() {
              return new Promise2(function(resolve2, reject) {
                draining.on("finish", resolve2);
                draining.on("error", reject);
              });
            };
            return draining;
          };
          entry.buffer = function() {
            return BufferStream(entry);
          };
          entry.path = fileName;
          entry.props = {};
          entry.props.path = fileName;
          entry.props.pathBuffer = fileNameBuffer;
          entry.props.flags = {
            "isUnicode": vars.flags & 17
          };
          entry.type = vars.uncompressedSize === 0 && /[\/\\]$/.test(fileName) ? "Directory" : "File";
          if (self2._opts.verbose) {
            if (entry.type === "Directory") {
              console.log("   creating:", fileName);
            } else if (entry.type === "File") {
              if (vars.compressionMethod === 0) {
                console.log(" extracting:", fileName);
              } else {
                console.log("  inflating:", fileName);
              }
            }
          }
          return self2.pull(vars.extraFieldLength).then(function(extraField) {
            var extra = parseExtraField(extraField, vars);
            entry.vars = vars;
            entry.extra = extra;
            if (self2._opts.forceStream) {
              self2.push(entry);
            } else {
              self2.emit("entry", entry);
              if (self2._readableState.pipesCount || self2._readableState.pipes && self2._readableState.pipes.length)
                self2.push(entry);
            }
            if (self2._opts.verbose)
              console.log({
                filename: fileName,
                vars,
                extra
              });
            var fileSizeKnown = !(vars.flags & 8) || vars.compressedSize > 0, eof;
            entry.__autodraining = __autodraining;
            var inflater = vars.compressionMethod && !__autodraining ? zlib.createInflateRaw() : Stream.PassThrough();
            if (fileSizeKnown) {
              entry.size = vars.uncompressedSize;
              eof = vars.compressedSize;
            } else {
              eof = Buffer2.alloc(4);
              eof.writeUInt32LE(134695760, 0);
            }
            return new Promise2(function(resolve2, reject) {
              self2.stream(eof).pipe(inflater).on("error", function(err) {
                self2.emit("error", err);
              }).pipe(entry).on("finish", function() {
                return fileSizeKnown ? self2._readRecord().then(resolve2).catch(reject) : self2._processDataDescriptor(entry).then(resolve2).catch(reject);
              });
            });
          });
        });
      });
    };
    Parse.prototype._processDataDescriptor = function(entry) {
      var self2 = this;
      return self2.pull(16).then(function(data) {
        var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").vars;
        entry.size = vars.uncompressedSize;
        return self2._readRecord();
      });
    };
    Parse.prototype._readCentralDirectoryFileHeader = function() {
      var self2 = this;
      return self2.pull(42).then(function(data) {
        var vars = binary.parse(data).word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").word16lu("fileCommentLength").word16lu("diskNumber").word16lu("internalFileAttributes").word32lu("externalFileAttributes").word32lu("offsetToLocalFileHeader").vars;
        return self2.pull(vars.fileNameLength).then(function(fileName) {
          vars.fileName = fileName.toString("utf8");
          return self2.pull(vars.extraFieldLength);
        }).then(function(extraField) {
          return self2.pull(vars.fileCommentLength);
        }).then(function(fileComment) {
          return self2._readRecord();
        });
      });
    };
    Parse.prototype._readEndOfCentralDirectoryRecord = function() {
      var self2 = this;
      return self2.pull(18).then(function(data) {
        var vars = binary.parse(data).word16lu("diskNumber").word16lu("diskStart").word16lu("numberOfRecordsOnDisk").word16lu("numberOfRecords").word32lu("sizeOfCentralDirectory").word32lu("offsetToStartOfCentralDirectory").word16lu("commentLength").vars;
        return self2.pull(vars.commentLength).then(function(comment) {
          comment = comment.toString("utf8");
          self2.end();
          self2.push(null);
        });
      });
    };
    Parse.prototype.promise = function() {
      var self2 = this;
      return new Promise2(function(resolve2, reject) {
        self2.on("finish", resolve2);
        self2.on("error", reject);
      });
    };
    module2.exports = Parse;
  }
});

// node_modules/duplexer2/index.js
var require_duplexer2 = __commonJS({
  "node_modules/duplexer2/index.js"(exports2, module2) {
    "use strict";
    var stream = require_readable();
    function DuplexWrapper(options, writable, readable) {
      if (typeof readable === "undefined") {
        readable = writable;
        writable = options;
        options = null;
      }
      stream.Duplex.call(this, options);
      if (typeof readable.read !== "function") {
        readable = new stream.Readable(options).wrap(readable);
      }
      this._writable = writable;
      this._readable = readable;
      this._waiting = false;
      var self2 = this;
      writable.once("finish", function() {
        self2.end();
      });
      this.once("finish", function() {
        writable.end();
      });
      readable.on("readable", function() {
        if (self2._waiting) {
          self2._waiting = false;
          self2._read();
        }
      });
      readable.once("end", function() {
        self2.push(null);
      });
      if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
        writable.on("error", function(err) {
          self2.emit("error", err);
        });
        readable.on("error", function(err) {
          self2.emit("error", err);
        });
      }
    }
    DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, { constructor: { value: DuplexWrapper } });
    DuplexWrapper.prototype._write = function _write(input, encoding, done) {
      this._writable.write(input, encoding, done);
    };
    DuplexWrapper.prototype._read = function _read() {
      var buf;
      var reads = 0;
      while ((buf = this._readable.read()) !== null) {
        this.push(buf);
        reads++;
      }
      if (reads === 0) {
        this._waiting = true;
      }
    };
    module2.exports = function duplex2(options, writable, readable) {
      return new DuplexWrapper(options, writable, readable);
    };
    module2.exports.DuplexWrapper = DuplexWrapper;
  }
});

// node_modules/unzipper/lib/parseOne.js
var require_parseOne = __commonJS({
  "node_modules/unzipper/lib/parseOne.js"(exports2, module2) {
    var Stream = require("stream");
    var Parse = require_parse();
    var duplexer2 = require_duplexer2();
    var BufferStream = require_BufferStream();
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    function parseOne(match, opts) {
      var inStream = Stream.PassThrough({ objectMode: true });
      var outStream = Stream.PassThrough();
      var transform = Stream.Transform({ objectMode: true });
      var re = match instanceof RegExp ? match : match && new RegExp(match);
      var found;
      transform._transform = function(entry, e, cb) {
        if (found || re && !re.exec(entry.path)) {
          entry.autodrain();
          return cb();
        } else {
          found = true;
          out.emit("entry", entry);
          entry.on("error", function(e2) {
            outStream.emit("error", e2);
          });
          entry.pipe(outStream).on("error", function(err) {
            cb(err);
          }).on("finish", function(d) {
            cb(null, d);
          });
        }
      };
      inStream.pipe(Parse(opts)).on("error", function(err) {
        outStream.emit("error", err);
      }).pipe(transform).on("error", Object).on("finish", function() {
        if (!found)
          outStream.emit("error", new Error("PATTERN_NOT_FOUND"));
        else
          outStream.end();
      });
      var out = duplexer2(inStream, outStream);
      out.buffer = function() {
        return BufferStream(outStream);
      };
      return out;
    }
    module2.exports = parseOne;
  }
});

// node_modules/fstream/lib/abstract.js
var require_abstract = __commonJS({
  "node_modules/fstream/lib/abstract.js"(exports2, module2) {
    module2.exports = Abstract;
    var Stream = require("stream").Stream;
    var inherits2 = require_inherits();
    function Abstract() {
      Stream.call(this);
    }
    inherits2(Abstract, Stream);
    Abstract.prototype.on = function(ev, fn) {
      if (ev === "ready" && this.ready) {
        process.nextTick(fn.bind(this));
      } else {
        Stream.prototype.on.call(this, ev, fn);
      }
      return this;
    };
    Abstract.prototype.abort = function() {
      this._aborted = true;
      this.emit("abort");
    };
    Abstract.prototype.destroy = function() {
    };
    Abstract.prototype.warn = function(msg, code) {
      var self2 = this;
      var er = decorate(msg, code, self2);
      if (!self2.listeners("warn")) {
        console.error(
          "%s %s\npath = %s\nsyscall = %s\nfstream_type = %s\nfstream_path = %s\nfstream_unc_path = %s\nfstream_class = %s\nfstream_stack =\n%s\n",
          code || "UNKNOWN",
          er.stack,
          er.path,
          er.syscall,
          er.fstream_type,
          er.fstream_path,
          er.fstream_unc_path,
          er.fstream_class,
          er.fstream_stack.join("\n")
        );
      } else {
        self2.emit("warn", er);
      }
    };
    Abstract.prototype.info = function(msg, code) {
      this.emit("info", msg, code);
    };
    Abstract.prototype.error = function(msg, code, th) {
      var er = decorate(msg, code, this);
      if (th)
        throw er;
      else
        this.emit("error", er);
    };
    function decorate(er, code, self2) {
      if (!(er instanceof Error))
        er = new Error(er);
      er.code = er.code || code;
      er.path = er.path || self2.path;
      er.fstream_type = er.fstream_type || self2.type;
      er.fstream_path = er.fstream_path || self2.path;
      if (self2._path !== self2.path) {
        er.fstream_unc_path = er.fstream_unc_path || self2._path;
      }
      if (self2.linkpath) {
        er.fstream_linkpath = er.fstream_linkpath || self2.linkpath;
      }
      er.fstream_class = er.fstream_class || self2.constructor.name;
      er.fstream_stack = er.fstream_stack || new Error().stack.split(/\n/).slice(3).map(function(s) {
        return s.replace(/^ {4}at /, "");
      });
      return er;
    }
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports2, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs);
      }
      if (!fs.lutimes) {
        patchLutimes(fs);
      }
      fs.chown = chownFix(fs.chown);
      fs.fchown = chownFix(fs.fchown);
      fs.lchown = chownFix(fs.lchown);
      fs.chmod = chmodFix(fs.chmod);
      fs.fchmod = chmodFix(fs.fchmod);
      fs.lchmod = chmodFix(fs.lchmod);
      fs.chownSync = chownFixSync(fs.chownSync);
      fs.fchownSync = chownFixSync(fs.fchownSync);
      fs.lchownSync = chownFixSync(fs.lchownSync);
      fs.chmodSync = chmodFixSync(fs.chmodSync);
      fs.fchmodSync = chmodFixSync(fs.fchmodSync);
      fs.lchmodSync = chmodFixSync(fs.lchmodSync);
      fs.stat = statFix(fs.stat);
      fs.fstat = statFix(fs.fstat);
      fs.lstat = statFix(fs.lstat);
      fs.statSync = statFixSync(fs.statSync);
      fs.fstatSync = statFixSync(fs.fstatSync);
      fs.lstatSync = statFixSync(fs.lstatSync);
      if (fs.chmod && !fs.lchmod) {
        fs.lchmod = function(path2, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs.lchmodSync = function() {
        };
      }
      if (fs.chown && !fs.lchown) {
        fs.lchown = function(path2, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs.rename = typeof fs.rename !== "function" ? fs.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          }
          if (Object.setPrototypeOf)
            Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs.rename);
      }
      fs.read = typeof fs.read !== "function" ? fs.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs.read);
      fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs.readSync);
      function patchLchmod(fs2) {
        fs2.lchmod = function(path2, mode, callback) {
          fs2.open(
            path2,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback)
                  callback(err);
                return;
              }
              fs2.fchmod(fd, mode, function(err2) {
                fs2.close(fd, function(err22) {
                  if (callback)
                    callback(err2 || err22);
                });
              });
            }
          );
        };
        fs2.lchmodSync = function(path2, mode) {
          var fd = fs2.openSync(path2, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret2;
          try {
            ret2 = fs2.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs2.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs2.closeSync(fd);
            }
          }
          return ret2;
        };
      }
      function patchLutimes(fs2) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs2.futimes) {
          fs2.lutimes = function(path2, at, mt, cb) {
            fs2.open(path2, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs2.futimes(fd, at, mt, function(er2) {
                fs2.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs2.lutimesSync = function(path2, at, mt) {
            var fd = fs2.openSync(path2, constants.O_SYMLINK);
            var ret2;
            var threw = true;
            try {
              ret2 = fs2.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs2.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs2.closeSync(fd);
              }
            }
            return ret2;
          };
        } else if (fs2.futimes) {
          fs2.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs2.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path2, options) {
        if (!(this instanceof ReadStream))
          return new ReadStream(path2, options);
        Stream.call(this);
        var self2 = this;
        this.path = path2;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream(path2, options) {
        if (!(this instanceof WriteStream))
          return new WriteStream(path2, options);
        Stream.call(this);
        this.path = path2;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports2, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj2) {
      return obj2.__proto__;
    };
    function clone(obj2) {
      if (obj2 === null || typeof obj2 !== "object")
        return obj2;
      if (obj2 instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj2) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj2).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj2, key));
      });
      return copy;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports2, module2) {
    var fs = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs, queue);
      fs.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs.close);
      fs.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs[gracefulQueue]);
          require("assert").equal(fs[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs[gracefulQueue]);
    }
    module2.exports = patch(clone(fs));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
      module2.exports = patch(fs);
      fs.__patched = true;
    }
    function patch(fs2) {
      polyfills(fs2);
      fs2.gracefulify = patch;
      fs2.createReadStream = createReadStream;
      fs2.createWriteStream = createWriteStream;
      var fs$readFile = fs2.readFile;
      fs2.readFile = readFile;
      function readFile(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path2, options, cb);
        function go$readFile(path3, options2, cb2, startTime) {
          return fs$readFile(path3, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs2.writeFile;
      fs2.writeFile = writeFile;
      function writeFile(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path2, data, options, cb);
        function go$writeFile(path3, data2, options2, cb2, startTime) {
          return fs$writeFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs2.appendFile;
      if (fs$appendFile)
        fs2.appendFile = appendFile;
      function appendFile(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path2, data, options, cb);
        function go$appendFile(path3, data2, options2, cb2, startTime) {
          return fs$appendFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs2.copyFile;
      if (fs$copyFile)
        fs2.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs2.readdir;
      fs2.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path3, options2, cb2, startTime) {
          return fs$readdir(path3, fs$readdirCallback(
            path3,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path3, options2, cb2, startTime) {
          return fs$readdir(path3, options2, fs$readdirCallback(
            path3,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path2, options, cb);
        function fs$readdirCallback(path3, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path3, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs2);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs2.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs2.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs2, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs2, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs2, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs2, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path2, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path2, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path2, options) {
        return new fs2.ReadStream(path2, options);
      }
      function createWriteStream(path2, options) {
        return new fs2.WriteStream(path2, options);
      }
      var fs$open = fs2.open;
      fs2.open = open;
      function open(path2, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path2, flags, mode, cb);
        function go$open(path3, flags2, mode2, cb2, startTime) {
          return fs$open(path3, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path3, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs2;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs[gracefulQueue].length; ++i) {
        if (fs[gracefulQueue][i].length > 2) {
          fs[gracefulQueue][i][3] = now;
          fs[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs[gracefulQueue].length === 0)
        return;
      var elem = fs[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/fstream/lib/get-type.js
var require_get_type = __commonJS({
  "node_modules/fstream/lib/get-type.js"(exports2, module2) {
    module2.exports = getType;
    function getType(st) {
      var types = [
        "Directory",
        "File",
        "SymbolicLink",
        "Link",
        // special for hardlinks from tarballs
        "BlockDevice",
        "CharacterDevice",
        "FIFO",
        "Socket"
      ];
      var type;
      if (st.type && types.indexOf(st.type) !== -1) {
        st[st.type] = true;
        return st.type;
      }
      for (var i = 0, l2 = types.length; i < l2; i++) {
        type = types[i];
        var is = st[type] || st["is" + type];
        if (typeof is === "function")
          is = is.call(st);
        if (is) {
          st[type] = true;
          st.type = type;
          return type;
        }
      }
      return null;
    }
  }
});

// node_modules/fstream/lib/link-reader.js
var require_link_reader = __commonJS({
  "node_modules/fstream/lib/link-reader.js"(exports2, module2) {
    module2.exports = LinkReader;
    var fs = require_graceful_fs();
    var inherits2 = require_inherits();
    var Reader = require_reader();
    inherits2(LinkReader, Reader);
    function LinkReader(props) {
      var self2 = this;
      if (!(self2 instanceof LinkReader)) {
        throw new Error("LinkReader must be called as constructor.");
      }
      if (!(props.type === "Link" && props.Link || props.type === "SymbolicLink" && props.SymbolicLink)) {
        throw new Error("Non-link type " + props.type);
      }
      Reader.call(self2, props);
    }
    LinkReader.prototype._stat = function(currentStat) {
      var self2 = this;
      fs.readlink(self2._path, function(er, linkpath) {
        if (er)
          return self2.error(er);
        self2.linkpath = self2.props.linkpath = linkpath;
        self2.emit("linkpath", linkpath);
        Reader.prototype._stat.call(self2, currentStat);
      });
    };
    LinkReader.prototype._read = function() {
      var self2 = this;
      if (self2._paused)
        return;
      if (!self2._ended) {
        self2.emit("end");
        self2.emit("close");
        self2._ended = true;
      }
    };
  }
});

// node_modules/fstream/lib/dir-reader.js
var require_dir_reader = __commonJS({
  "node_modules/fstream/lib/dir-reader.js"(exports2, module2) {
    module2.exports = DirReader;
    var fs = require_graceful_fs();
    var inherits2 = require_inherits();
    var path2 = require("path");
    var Reader = require_reader();
    var assert = require("assert").ok;
    inherits2(DirReader, Reader);
    function DirReader(props) {
      var self2 = this;
      if (!(self2 instanceof DirReader)) {
        throw new Error("DirReader must be called as constructor.");
      }
      if (props.type !== "Directory" || !props.Directory) {
        throw new Error("Non-directory type " + props.type);
      }
      self2.entries = null;
      self2._index = -1;
      self2._paused = false;
      self2._length = -1;
      if (props.sort) {
        this.sort = props.sort;
      }
      Reader.call(this, props);
    }
    DirReader.prototype._getEntries = function() {
      var self2 = this;
      if (self2._gotEntries)
        return;
      self2._gotEntries = true;
      fs.readdir(self2._path, function(er, entries) {
        if (er)
          return self2.error(er);
        self2.entries = entries;
        self2.emit("entries", entries);
        if (self2._paused)
          self2.once("resume", processEntries);
        else
          processEntries();
        function processEntries() {
          self2._length = self2.entries.length;
          if (typeof self2.sort === "function") {
            self2.entries = self2.entries.sort(self2.sort.bind(self2));
          }
          self2._read();
        }
      });
    };
    DirReader.prototype._read = function() {
      var self2 = this;
      if (!self2.entries)
        return self2._getEntries();
      if (self2._paused || self2._currentEntry || self2._aborted) {
        return;
      }
      self2._index++;
      if (self2._index >= self2.entries.length) {
        if (!self2._ended) {
          self2._ended = true;
          self2.emit("end");
          self2.emit("close");
        }
        return;
      }
      var p = path2.resolve(self2._path, self2.entries[self2._index]);
      assert(p !== self2._path);
      assert(self2.entries[self2._index]);
      self2._currentEntry = p;
      fs[self2.props.follow ? "stat" : "lstat"](p, function(er, stat) {
        if (er)
          return self2.error(er);
        var who = self2._proxy || self2;
        stat.path = p;
        stat.basename = path2.basename(p);
        stat.dirname = path2.dirname(p);
        var childProps = self2.getChildProps.call(who, stat);
        childProps.path = p;
        childProps.basename = path2.basename(p);
        childProps.dirname = path2.dirname(p);
        var entry = Reader(childProps, stat);
        self2._currentEntry = entry;
        entry.on("pause", function(who2) {
          if (!self2._paused && !entry._disowned) {
            self2.pause(who2);
          }
        });
        entry.on("resume", function(who2) {
          if (self2._paused && !entry._disowned) {
            self2.resume(who2);
          }
        });
        entry.on("stat", function(props) {
          self2.emit("_entryStat", entry, props);
          if (entry._aborted)
            return;
          if (entry._paused) {
            entry.once("resume", function() {
              self2.emit("entryStat", entry, props);
            });
          } else
            self2.emit("entryStat", entry, props);
        });
        entry.on("ready", function EMITCHILD() {
          if (self2._paused) {
            entry.pause(self2);
            return self2.once("resume", EMITCHILD);
          }
          if (entry.type === "Socket") {
            self2.emit("socket", entry);
          } else {
            self2.emitEntry(entry);
          }
        });
        var ended = false;
        entry.on("close", onend);
        entry.on("disown", onend);
        function onend() {
          if (ended)
            return;
          ended = true;
          self2.emit("childEnd", entry);
          self2.emit("entryEnd", entry);
          self2._currentEntry = null;
          if (!self2._paused) {
            self2._read();
          }
        }
        entry.on("error", function(er2) {
          if (entry._swallowErrors) {
            self2.warn(er2);
            entry.emit("end");
            entry.emit("close");
          } else {
            self2.emit("error", er2);
          }
        });
        [
          "child",
          "childEnd",
          "warn"
        ].forEach(function(ev) {
          entry.on(ev, self2.emit.bind(self2, ev));
        });
      });
    };
    DirReader.prototype.disown = function(entry) {
      entry.emit("beforeDisown");
      entry._disowned = true;
      entry.parent = entry.root = null;
      if (entry === this._currentEntry) {
        this._currentEntry = null;
      }
      entry.emit("disown");
    };
    DirReader.prototype.getChildProps = function() {
      return {
        depth: this.depth + 1,
        root: this.root || this,
        parent: this,
        follow: this.follow,
        filter: this.filter,
        sort: this.props.sort,
        hardlinks: this.props.hardlinks
      };
    };
    DirReader.prototype.pause = function(who) {
      var self2 = this;
      if (self2._paused)
        return;
      who = who || self2;
      self2._paused = true;
      if (self2._currentEntry && self2._currentEntry.pause) {
        self2._currentEntry.pause(who);
      }
      self2.emit("pause", who);
    };
    DirReader.prototype.resume = function(who) {
      var self2 = this;
      if (!self2._paused)
        return;
      who = who || self2;
      self2._paused = false;
      self2.emit("resume", who);
      if (self2._paused) {
        return;
      }
      if (self2._currentEntry) {
        if (self2._currentEntry.resume)
          self2._currentEntry.resume(who);
      } else
        self2._read();
    };
    DirReader.prototype.emitEntry = function(entry) {
      this.emit("entry", entry);
      this.emit("child", entry);
    };
  }
});

// node_modules/fstream/lib/file-reader.js
var require_file_reader = __commonJS({
  "node_modules/fstream/lib/file-reader.js"(exports2, module2) {
    module2.exports = FileReader;
    var fs = require_graceful_fs();
    var inherits2 = require_inherits();
    var Reader = require_reader();
    var EOF = { EOF: true };
    var CLOSE = { CLOSE: true };
    inherits2(FileReader, Reader);
    function FileReader(props) {
      var self2 = this;
      if (!(self2 instanceof FileReader)) {
        throw new Error("FileReader must be called as constructor.");
      }
      if (!(props.type === "Link" && props.Link || props.type === "File" && props.File)) {
        throw new Error("Non-file type " + props.type);
      }
      self2._buffer = [];
      self2._bytesEmitted = 0;
      Reader.call(self2, props);
    }
    FileReader.prototype._getStream = function() {
      var self2 = this;
      var stream = self2._stream = fs.createReadStream(self2._path, self2.props);
      if (self2.props.blksize) {
        stream.bufferSize = self2.props.blksize;
      }
      stream.on("open", self2.emit.bind(self2, "open"));
      stream.on("data", function(c) {
        self2._bytesEmitted += c.length;
        if (!c.length) {
          return;
        } else if (self2._paused || self2._buffer.length) {
          self2._buffer.push(c);
          self2._read();
        } else
          self2.emit("data", c);
      });
      stream.on("end", function() {
        if (self2._paused || self2._buffer.length) {
          self2._buffer.push(EOF);
          self2._read();
        } else {
          self2.emit("end");
        }
        if (self2._bytesEmitted !== self2.props.size) {
          self2.error("Didn't get expected byte count\nexpect: " + self2.props.size + "\nactual: " + self2._bytesEmitted);
        }
      });
      stream.on("close", function() {
        if (self2._paused || self2._buffer.length) {
          self2._buffer.push(CLOSE);
          self2._read();
        } else {
          self2.emit("close");
        }
      });
      stream.on("error", function(e) {
        self2.emit("error", e);
      });
      self2._read();
    };
    FileReader.prototype._read = function() {
      var self2 = this;
      if (self2._paused) {
        return;
      }
      if (!self2._stream) {
        return self2._getStream();
      }
      if (self2._buffer.length) {
        var buf = self2._buffer;
        for (var i = 0, l2 = buf.length; i < l2; i++) {
          var c = buf[i];
          if (c === EOF) {
            self2.emit("end");
          } else if (c === CLOSE) {
            self2.emit("close");
          } else {
            self2.emit("data", c);
          }
          if (self2._paused) {
            self2._buffer = buf.slice(i);
            return;
          }
        }
        self2._buffer.length = 0;
      }
    };
    FileReader.prototype.pause = function(who) {
      var self2 = this;
      if (self2._paused)
        return;
      who = who || self2;
      self2._paused = true;
      if (self2._stream)
        self2._stream.pause();
      self2.emit("pause", who);
    };
    FileReader.prototype.resume = function(who) {
      var self2 = this;
      if (!self2._paused)
        return;
      who = who || self2;
      self2.emit("resume", who);
      self2._paused = false;
      if (self2._stream)
        self2._stream.resume();
      self2._read();
    };
  }
});

// node_modules/fstream/lib/socket-reader.js
var require_socket_reader = __commonJS({
  "node_modules/fstream/lib/socket-reader.js"(exports2, module2) {
    module2.exports = SocketReader;
    var inherits2 = require_inherits();
    var Reader = require_reader();
    inherits2(SocketReader, Reader);
    function SocketReader(props) {
      var self2 = this;
      if (!(self2 instanceof SocketReader)) {
        throw new Error("SocketReader must be called as constructor.");
      }
      if (!(props.type === "Socket" && props.Socket)) {
        throw new Error("Non-socket type " + props.type);
      }
      Reader.call(self2, props);
    }
    SocketReader.prototype._read = function() {
      var self2 = this;
      if (self2._paused)
        return;
      if (!self2._ended) {
        self2.emit("end");
        self2.emit("close");
        self2._ended = true;
      }
    };
  }
});

// node_modules/fstream/lib/proxy-reader.js
var require_proxy_reader = __commonJS({
  "node_modules/fstream/lib/proxy-reader.js"(exports2, module2) {
    module2.exports = ProxyReader;
    var Reader = require_reader();
    var getType = require_get_type();
    var inherits2 = require_inherits();
    var fs = require_graceful_fs();
    inherits2(ProxyReader, Reader);
    function ProxyReader(props) {
      var self2 = this;
      if (!(self2 instanceof ProxyReader)) {
        throw new Error("ProxyReader must be called as constructor.");
      }
      self2.props = props;
      self2._buffer = [];
      self2.ready = false;
      Reader.call(self2, props);
    }
    ProxyReader.prototype._stat = function() {
      var self2 = this;
      var props = self2.props;
      var stat = props.follow ? "stat" : "lstat";
      fs[stat](props.path, function(er, current) {
        var type;
        if (er || !current) {
          type = "File";
        } else {
          type = getType(current);
        }
        props[type] = true;
        props.type = self2.type = type;
        self2._old = current;
        self2._addProxy(Reader(props, current));
      });
    };
    ProxyReader.prototype._addProxy = function(proxy) {
      var self2 = this;
      if (self2._proxyTarget) {
        return self2.error("proxy already set");
      }
      self2._proxyTarget = proxy;
      proxy._proxy = self2;
      [
        "error",
        "data",
        "end",
        "close",
        "linkpath",
        "entry",
        "entryEnd",
        "child",
        "childEnd",
        "warn",
        "stat"
      ].forEach(function(ev) {
        proxy.on(ev, self2.emit.bind(self2, ev));
      });
      self2.emit("proxy", proxy);
      proxy.on("ready", function() {
        self2.ready = true;
        self2.emit("ready");
      });
      var calls = self2._buffer;
      self2._buffer.length = 0;
      calls.forEach(function(c) {
        proxy[c[0]].apply(proxy, c[1]);
      });
    };
    ProxyReader.prototype.pause = function() {
      return this._proxyTarget ? this._proxyTarget.pause() : false;
    };
    ProxyReader.prototype.resume = function() {
      return this._proxyTarget ? this._proxyTarget.resume() : false;
    };
  }
});

// node_modules/fstream/lib/reader.js
var require_reader = __commonJS({
  "node_modules/fstream/lib/reader.js"(exports2, module2) {
    module2.exports = Reader;
    var fs = require_graceful_fs();
    var Stream = require("stream").Stream;
    var inherits2 = require_inherits();
    var path2 = require("path");
    var getType = require_get_type();
    var hardLinks = Reader.hardLinks = {};
    var Abstract = require_abstract();
    inherits2(Reader, Abstract);
    var LinkReader = require_link_reader();
    function Reader(props, currentStat) {
      var self2 = this;
      if (!(self2 instanceof Reader))
        return new Reader(props, currentStat);
      if (typeof props === "string") {
        props = { path: props };
      }
      var type;
      var ClassType;
      if (props.type && typeof props.type === "function") {
        type = props.type;
        ClassType = type;
      } else {
        type = getType(props);
        ClassType = Reader;
      }
      if (currentStat && !type) {
        type = getType(currentStat);
        props[type] = true;
        props.type = type;
      }
      switch (type) {
        case "Directory":
          ClassType = require_dir_reader();
          break;
        case "Link":
        case "File":
          ClassType = require_file_reader();
          break;
        case "SymbolicLink":
          ClassType = LinkReader;
          break;
        case "Socket":
          ClassType = require_socket_reader();
          break;
        case null:
          ClassType = require_proxy_reader();
          break;
      }
      if (!(self2 instanceof ClassType)) {
        return new ClassType(props);
      }
      Abstract.call(self2);
      if (!props.path) {
        self2.error("Must provide a path", null, true);
      }
      self2.readable = true;
      self2.writable = false;
      self2.type = type;
      self2.props = props;
      self2.depth = props.depth = props.depth || 0;
      self2.parent = props.parent || null;
      self2.root = props.root || props.parent && props.parent.root || self2;
      self2._path = self2.path = path2.resolve(props.path);
      if (process.platform === "win32") {
        self2.path = self2._path = self2.path.replace(/\?/g, "_");
        if (self2._path.length >= 260) {
          self2._swallowErrors = true;
          self2._path = "\\\\?\\" + self2.path.replace(/\//g, "\\");
        }
      }
      self2.basename = props.basename = path2.basename(self2.path);
      self2.dirname = props.dirname = path2.dirname(self2.path);
      props.parent = props.root = null;
      self2.size = props.size;
      self2.filter = typeof props.filter === "function" ? props.filter : null;
      if (props.sort === "alpha")
        props.sort = alphasort;
      self2._stat(currentStat);
    }
    function alphasort(a, b) {
      return a === b ? 0 : a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : a > b ? 1 : -1;
    }
    Reader.prototype._stat = function(currentStat) {
      var self2 = this;
      var props = self2.props;
      var stat = props.follow ? "stat" : "lstat";
      if (currentStat)
        process.nextTick(statCb.bind(null, null, currentStat));
      else
        fs[stat](self2._path, statCb);
      function statCb(er, props_) {
        if (er)
          return self2.error(er);
        Object.keys(props_).forEach(function(k2) {
          props[k2] = props_[k2];
        });
        if (void 0 !== self2.size && props.size !== self2.size) {
          return self2.error("incorrect size");
        }
        self2.size = props.size;
        var type = getType(props);
        var handleHardlinks = props.hardlinks !== false;
        if (handleHardlinks && type !== "Directory" && props.nlink && props.nlink > 1) {
          var k = props.dev + ":" + props.ino;
          if (hardLinks[k] === self2._path || !hardLinks[k]) {
            hardLinks[k] = self2._path;
          } else {
            type = self2.type = self2.props.type = "Link";
            self2.Link = self2.props.Link = true;
            self2.linkpath = self2.props.linkpath = hardLinks[k];
            self2._stat = self2._read = LinkReader.prototype._read;
          }
        }
        if (self2.type && self2.type !== type) {
          self2.error("Unexpected type: " + type);
        }
        if (self2.filter) {
          var who = self2._proxy || self2;
          if (!self2.filter.call(who, who, props)) {
            if (!self2._disowned) {
              self2.abort();
              self2.emit("end");
              self2.emit("close");
            }
            return;
          }
        }
        var events = ["_stat", "stat", "ready"];
        var e = 0;
        (function go() {
          if (self2._aborted) {
            self2.emit("end");
            self2.emit("close");
            return;
          }
          if (self2._paused && self2.type !== "Directory") {
            self2.once("resume", go);
            return;
          }
          var ev = events[e++];
          if (!ev) {
            return self2._read();
          }
          self2.emit(ev, props);
          go();
        })();
      }
    };
    Reader.prototype.pipe = function(dest) {
      var self2 = this;
      if (typeof dest.add === "function") {
        self2.on("entry", function(entry) {
          var ret2 = dest.add(entry);
          if (ret2 === false) {
            self2.pause();
          }
        });
      }
      return Stream.prototype.pipe.apply(this, arguments);
    };
    Reader.prototype.pause = function(who) {
      this._paused = true;
      who = who || this;
      this.emit("pause", who);
      if (this._stream)
        this._stream.pause(who);
    };
    Reader.prototype.resume = function(who) {
      this._paused = false;
      who = who || this;
      this.emit("resume", who);
      if (this._stream)
        this._stream.resume(who);
      this._read();
    };
    Reader.prototype._read = function() {
      this.error("Cannot read unknown type: " + this.type);
    };
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports2) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports2.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs.statSync(base);
            linkTarget = fs.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports2.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports2, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs = require("fs");
    var origRealpath = fs.realpath;
    var origRealpathSync = fs.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs.realpath = realpath;
      fs.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs.realpath = origRealpath;
      fs.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports2, module2) {
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports2, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports2, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports2, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path2 = function() {
      try {
        return require("path");
      } catch (e) {
      }
    }() || {
      sep: "/"
    };
    minimatch.sep = path2.sep;
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      b = b || {};
      var t = {};
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options) {
        return orig(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      m.Minimatch.defaults = function defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      };
      m.filter = function filter2(pattern, options) {
        return orig.filter(pattern, ext(def, options));
      };
      m.defaults = function defaults(options) {
        return orig.defaults(ext(def, options));
      };
      m.makeRe = function makeRe2(pattern, options) {
        return orig.makeRe(pattern, ext(def, options));
      };
      m.braceExpand = function braceExpand2(pattern, options) {
        return orig.braceExpand(pattern, ext(def, options));
      };
      m.match = function(list, pattern, options) {
        return orig.match(list, pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      assertValidPattern(pattern);
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      assertValidPattern(pattern);
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (!options.allowWindowsEscape && path2.sep !== "/") {
        pattern = pattern.split(path2.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.partial = !!options.partial;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = function debug() {
          console.error.apply(console, arguments);
        };
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l2 = pattern.length; i < l2 && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    }
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = function(pattern) {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    Minimatch.prototype.parse = parse;
    var SUBPARSE = {};
    function parse(pattern, isSub) {
      assertValidPattern(pattern);
      var options = this.options;
      if (pattern === "**") {
        if (!options.noglobstar)
          return GLOBSTAR;
        else
          pattern = "*";
      }
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self2 = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self2.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/": {
            return false;
          }
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self2.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case "[":
        case ".":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = function match(f, partial) {
      if (typeof partial === "undefined")
        partial = this.partial;
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path2.sep !== "/") {
        f = f.split(path2.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    };
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug(
        "matchOne",
        { "this": this, file, pattern }
      );
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          hit = f === p;
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        return fi === fl - 1 && file[fi] === "";
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports2, module2) {
    "use strict";
    function posix(path2) {
      return path2.charAt(0) === "/";
    }
    function win32(path2) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path2);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/fstream/node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/fstream/node_modules/glob/common.js"(exports2) {
    exports2.setopts = setopts;
    exports2.ownProp = ownProp;
    exports2.makeAbs = makeAbs;
    exports2.finish = finish;
    exports2.mark = mark;
    exports2.isIgnored = isIgnored;
    exports2.childrenIgnored = childrenIgnored;
    function ownProp(obj2, field) {
      return Object.prototype.hasOwnProperty.call(obj2, field);
    }
    var fs = require("fs");
    var path2 = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self2, options) {
      self2.ignore = options.ignore || [];
      if (!Array.isArray(self2.ignore))
        self2.ignore = [self2.ignore];
      if (self2.ignore.length) {
        self2.ignore = self2.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self2, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self2.silent = !!options.silent;
      self2.pattern = pattern;
      self2.strict = options.strict !== false;
      self2.realpath = !!options.realpath;
      self2.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self2.follow = !!options.follow;
      self2.dot = !!options.dot;
      self2.mark = !!options.mark;
      self2.nodir = !!options.nodir;
      if (self2.nodir)
        self2.mark = true;
      self2.sync = !!options.sync;
      self2.nounique = !!options.nounique;
      self2.nonull = !!options.nonull;
      self2.nosort = !!options.nosort;
      self2.nocase = !!options.nocase;
      self2.stat = !!options.stat;
      self2.noprocess = !!options.noprocess;
      self2.absolute = !!options.absolute;
      self2.fs = options.fs || fs;
      self2.maxLength = options.maxLength || Infinity;
      self2.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self2.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self2.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self2, options);
      self2.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self2.cwd = cwd;
      else {
        self2.cwd = path2.resolve(options.cwd);
        self2.changedCwd = self2.cwd !== cwd;
      }
      self2.root = options.root || path2.resolve(self2.cwd, "/");
      self2.root = path2.resolve(self2.root);
      if (process.platform === "win32")
        self2.root = self2.root.replace(/\\/g, "/");
      self2.cwdAbs = isAbsolute(self2.cwd) ? self2.cwd : makeAbs(self2, self2.cwd);
      if (process.platform === "win32")
        self2.cwdAbs = self2.cwdAbs.replace(/\\/g, "/");
      self2.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = false;
      self2.minimatch = new Minimatch(pattern, options);
      self2.options = self2.minimatch.options;
    }
    function finish(self2) {
      var nou = self2.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i = 0, l2 = self2.matches.length; i < l2; i++) {
        var matches = self2.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self2.nonull) {
            var literal = self2.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self2.nosort)
        all = all.sort(alphasort);
      if (self2.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self2._mark(all[i]);
        }
        if (self2.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self2.cache[e] || self2.cache[makeAbs(self2, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self2.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self2, m2);
        });
      self2.found = all;
    }
    function mark(self2, p) {
      var abs = makeAbs(self2, p);
      var c = self2.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self2, m);
          self2.statCache[mabs] = self2.statCache[abs];
          self2.cache[mabs] = self2.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self2, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path2.join(self2.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self2.changedCwd) {
        abs = path2.resolve(self2.cwd, f);
      } else {
        abs = path2.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self2, path3) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return item.matcher.match(path3) || !!(item.gmatcher && item.gmatcher.match(path3));
      });
    }
    function childrenIgnored(self2, path3) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path3));
      });
    }
  }
});

// node_modules/fstream/node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/fstream/node_modules/glob/sync.js"(exports2, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = require("util");
    var path2 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self2 = this;
        this.matches.forEach(function(matchset, index) {
          var set = self2.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self2._makeAbs(p);
              var real = rp.realpathSync(p, self2.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self2._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path2.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path2.join(this.root, prefix);
        } else {
          prefix = path2.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret2 = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret2 === "function" && ret2 !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret2[k] = cb2[k];
          });
        }
        return ret2;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports2, module2) {
    var wrappy = require_wrappy();
    var reqs = /* @__PURE__ */ Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/fstream/node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/fstream/node_modules/glob/glob.js"(exports2, module2) {
    module2.exports = glob;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits2 = require_inherits();
    var EE = require("events").EventEmitter;
    var path2 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits2(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self2 = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self2._processing;
        if (self2._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self2._finish();
            });
          } else {
            self2._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self2 = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self2._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self2 = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i) {
        p = self2._makeAbs(p);
        rp.realpath(p, self2.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self2.emit("error", er);
          if (--n === 0) {
            self2.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self2._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path2.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self2 = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self2.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self2.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self2.cache[abs] = "FILE";
          cb();
        } else
          self2._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self2 = this;
      self2.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self2, abs, cb) {
      return function(er, entries) {
        if (er)
          self2._readdirError(abs, er, cb);
        else
          self2._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self2._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self2 = this;
      this._stat(prefix, function(er, exists) {
        self2._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path2.join(this.root, prefix);
        } else {
          prefix = path2.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self2 = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self2.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self2.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self2._stat2(f, abs, null, lstat, cb);
            else
              self2._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self2._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/fstream/node_modules/rimraf/rimraf.js
var require_rimraf = __commonJS({
  "node_modules/fstream/node_modules/rimraf/rimraf.js"(exports2, module2) {
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
    var assert = require("assert");
    var path2 = require("path");
    var fs = require("fs");
    var glob = void 0;
    try {
      glob = require_glob();
    } catch (_err) {
    }
    var _0666 = parseInt("666", 8);
    var defaultGlobOpts = {
      nosort: true,
      silent: true
    };
    var timeout = 0;
    var isWindows = process.platform === "win32";
    function defaults(options) {
      var methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach(function(m) {
        options[m] = options[m] || fs[m];
        m = m + "Sync";
        options[m] = options[m] || fs[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
      options.emfileWait = options.emfileWait || 1e3;
      if (options.glob === false) {
        options.disableGlob = true;
      }
      if (options.disableGlob !== true && glob === void 0) {
        throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
      }
      options.disableGlob = options.disableGlob || false;
      options.glob = options.glob || defaultGlobOpts;
    }
    function rimraf(p, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert.equal(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      var busyTries = 0;
      var errState = null;
      var n = 0;
      if (options.disableGlob || !glob.hasMagic(p))
        return afterGlob(null, [p]);
      options.lstat(p, function(er, stat) {
        if (!er)
          return afterGlob(null, [p]);
        glob(p, options.glob, afterGlob);
      });
      function next(er) {
        errState = errState || er;
        if (--n === 0)
          cb(errState);
      }
      function afterGlob(er, results) {
        if (er)
          return cb(er);
        n = results.length;
        if (n === 0)
          return cb();
        results.forEach(function(p2) {
          rimraf_(p2, options, function CB(er2) {
            if (er2) {
              if ((er2.code === "EBUSY" || er2.code === "ENOTEMPTY" || er2.code === "EPERM") && busyTries < options.maxBusyTries) {
                busyTries++;
                var time = busyTries * 100;
                return setTimeout(function() {
                  rimraf_(p2, options, CB);
                }, time);
              }
              if (er2.code === "EMFILE" && timeout < options.emfileWait) {
                return setTimeout(function() {
                  rimraf_(p2, options, CB);
                }, timeout++);
              }
              if (er2.code === "ENOENT")
                er2 = null;
            }
            timeout = 0;
            next(er2);
          });
        });
      }
    }
    function rimraf_(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, function(er, st) {
        if (er && er.code === "ENOENT")
          return cb(null);
        if (er && er.code === "EPERM" && isWindows)
          fixWinEPERM(p, options, er, cb);
        if (st && st.isDirectory())
          return rmdir(p, options, er, cb);
        options.unlink(p, function(er2) {
          if (er2) {
            if (er2.code === "ENOENT")
              return cb(null);
            if (er2.code === "EPERM")
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            if (er2.code === "EISDIR")
              return rmdir(p, options, er2, cb);
          }
          return cb(er2);
        });
      });
    }
    function fixWinEPERM(p, options, er, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      if (er)
        assert(er instanceof Error);
      options.chmod(p, _0666, function(er2) {
        if (er2)
          cb(er2.code === "ENOENT" ? null : er);
        else
          options.stat(p, function(er3, stats) {
            if (er3)
              cb(er3.code === "ENOENT" ? null : er);
            else if (stats.isDirectory())
              rmdir(p, options, er, cb);
            else
              options.unlink(p, cb);
          });
      });
    }
    function fixWinEPERMSync(p, options, er) {
      assert(p);
      assert(options);
      if (er)
        assert(er instanceof Error);
      try {
        options.chmodSync(p, _0666);
      } catch (er2) {
        if (er2.code === "ENOENT")
          return;
        else
          throw er;
      }
      try {
        var stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT")
          return;
        else
          throw er;
      }
      if (stats.isDirectory())
        rmdirSync(p, options, er);
      else
        options.unlinkSync(p);
    }
    function rmdir(p, options, originalEr, cb) {
      assert(p);
      assert(options);
      if (originalEr)
        assert(originalEr instanceof Error);
      assert(typeof cb === "function");
      options.rmdir(p, function(er) {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
          rmkids(p, options, cb);
        else if (er && er.code === "ENOTDIR")
          cb(originalEr);
        else
          cb(er);
      });
    }
    function rmkids(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, function(er, files) {
        if (er)
          return cb(er);
        var n = files.length;
        if (n === 0)
          return options.rmdir(p, cb);
        var errState;
        files.forEach(function(f) {
          rimraf(path2.join(p, f), options, function(er2) {
            if (errState)
              return;
            if (er2)
              return cb(errState = er2);
            if (--n === 0)
              options.rmdir(p, cb);
          });
        });
      });
    }
    function rimrafSync(p, options) {
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      var results;
      if (options.disableGlob || !glob.hasMagic(p)) {
        results = [p];
      } else {
        try {
          options.lstatSync(p);
          results = [p];
        } catch (er) {
          results = glob.sync(p, options.glob);
        }
      }
      if (!results.length)
        return;
      for (var i = 0; i < results.length; i++) {
        var p = results[i];
        try {
          var st = options.lstatSync(p);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM" && isWindows)
            fixWinEPERMSync(p, options, er);
        }
        try {
          if (st && st.isDirectory())
            rmdirSync(p, options, null);
          else
            options.unlinkSync(p);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM")
            return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
          if (er.code !== "EISDIR")
            throw er;
          rmdirSync(p, options, er);
        }
      }
    }
    function rmdirSync(p, options, originalEr) {
      assert(p);
      assert(options);
      if (originalEr)
        assert(originalEr instanceof Error);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "ENOTDIR")
          throw originalEr;
        if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
          rmkidsSync(p, options);
      }
    }
    function rmkidsSync(p, options) {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach(function(f) {
        rimrafSync(path2.join(p, f), options);
      });
      var retries = isWindows ? 100 : 1;
      var i = 0;
      do {
        var threw = true;
        try {
          var ret2 = options.rmdirSync(p, options);
          threw = false;
          return ret2;
        } finally {
          if (++i < retries && threw)
            continue;
        }
      } while (true);
    }
  }
});

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports2, module2) {
    var path2 = require("path");
    var fs = require("fs");
    var _0777 = parseInt("0777", 8);
    module2.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      var cb = f || /* istanbul ignore next */
      function() {
      };
      p = path2.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path2.dirname(p) === p)
              return cb(er);
            mkdirP(path2.dirname(p), opts, function(er2, made2) {
              if (er2)
                cb(er2, made2);
              else
                mkdirP(p, opts, cb, made2);
            });
            break;
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory())
                cb(er, made);
              else
                cb(null, made);
            });
            break;
        }
      });
    }
    mkdirP.sync = function sync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      p = path2.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync(path2.dirname(p), opts, made);
            sync(p, opts, made);
            break;
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory())
              throw err0;
            break;
        }
      }
      return made;
    };
  }
});

// node_modules/fstream/lib/collect.js
var require_collect = __commonJS({
  "node_modules/fstream/lib/collect.js"(exports2, module2) {
    module2.exports = collect;
    function collect(stream) {
      if (stream._collected)
        return;
      if (stream._paused)
        return stream.on("resume", collect.bind(null, stream));
      stream._collected = true;
      stream.pause();
      stream.on("data", save);
      stream.on("end", save);
      var buf = [];
      function save(b) {
        if (typeof b === "string")
          b = new Buffer(b);
        if (Buffer.isBuffer(b) && !b.length)
          return;
        buf.push(b);
      }
      stream.on("entry", saveEntry);
      var entryBuffer = [];
      function saveEntry(e) {
        collect(e);
        entryBuffer.push(e);
      }
      stream.on("proxy", proxyPause);
      function proxyPause(p) {
        p.pause();
      }
      stream.pipe = function(orig) {
        return function(dest) {
          var e = 0;
          (function unblockEntry() {
            var entry = entryBuffer[e++];
            if (!entry)
              return resume();
            entry.on("end", unblockEntry);
            if (dest)
              dest.add(entry);
            else
              stream.emit("entry", entry);
          })();
          function resume() {
            stream.removeListener("entry", saveEntry);
            stream.removeListener("data", save);
            stream.removeListener("end", save);
            stream.pipe = orig;
            if (dest)
              stream.pipe(dest);
            buf.forEach(function(b) {
              if (b)
                stream.emit("data", b);
              else
                stream.emit("end");
            });
            stream.resume();
          }
          return dest;
        };
      }(stream.pipe);
    }
  }
});

// node_modules/fstream/lib/dir-writer.js
var require_dir_writer = __commonJS({
  "node_modules/fstream/lib/dir-writer.js"(exports2, module2) {
    module2.exports = DirWriter;
    var Writer = require_writer();
    var inherits2 = require_inherits();
    var mkdir = require_mkdirp();
    var path2 = require("path");
    var collect = require_collect();
    inherits2(DirWriter, Writer);
    function DirWriter(props) {
      var self2 = this;
      if (!(self2 instanceof DirWriter)) {
        self2.error("DirWriter must be called as constructor.", null, true);
      }
      if (props.type !== "Directory" || !props.Directory) {
        self2.error("Non-directory type " + props.type + " " + JSON.stringify(props), null, true);
      }
      Writer.call(this, props);
    }
    DirWriter.prototype._create = function() {
      var self2 = this;
      mkdir(self2._path, Writer.dirmode, function(er) {
        if (er)
          return self2.error(er);
        self2.ready = true;
        self2.emit("ready");
        self2._process();
      });
    };
    DirWriter.prototype.write = function() {
      return true;
    };
    DirWriter.prototype.end = function() {
      this._ended = true;
      this._process();
    };
    DirWriter.prototype.add = function(entry) {
      var self2 = this;
      collect(entry);
      if (!self2.ready || self2._currentEntry) {
        self2._buffer.push(entry);
        return false;
      }
      if (self2._ended) {
        return self2.error("add after end");
      }
      self2._buffer.push(entry);
      self2._process();
      return this._buffer.length === 0;
    };
    DirWriter.prototype._process = function() {
      var self2 = this;
      if (self2._processing)
        return;
      var entry = self2._buffer.shift();
      if (!entry) {
        self2.emit("drain");
        if (self2._ended)
          self2._finish();
        return;
      }
      self2._processing = true;
      self2.emit("entry", entry);
      var p = entry;
      var pp;
      do {
        pp = p._path || p.path;
        if (pp === self2.root._path || pp === self2._path || pp && pp.indexOf(self2._path) === 0) {
          self2._processing = false;
          if (entry._collected)
            entry.pipe();
          return self2._process();
        }
        p = p.parent;
      } while (p);
      var props = {
        parent: self2,
        root: self2.root || self2,
        type: entry.type,
        depth: self2.depth + 1
      };
      pp = entry._path || entry.path || entry.props.path;
      if (entry.parent) {
        pp = pp.substr(entry.parent._path.length + 1);
      }
      props.path = path2.join(self2.path, path2.join("/", pp));
      props.filter = self2.filter;
      Object.keys(entry.props).forEach(function(k) {
        if (!props.hasOwnProperty(k)) {
          props[k] = entry.props[k];
        }
      });
      var child = self2._currentChild = new Writer(props);
      child.on("ready", function() {
        entry.pipe(child);
        entry.resume();
      });
      child.on("error", function(er) {
        if (child._swallowErrors) {
          self2.warn(er);
          child.emit("end");
          child.emit("close");
        } else {
          self2.emit("error", er);
        }
      });
      child.on("close", onend);
      var ended = false;
      function onend() {
        if (ended)
          return;
        ended = true;
        self2._currentChild = null;
        self2._processing = false;
        self2._process();
      }
    };
  }
});

// node_modules/fstream/lib/link-writer.js
var require_link_writer = __commonJS({
  "node_modules/fstream/lib/link-writer.js"(exports2, module2) {
    module2.exports = LinkWriter;
    var fs = require_graceful_fs();
    var Writer = require_writer();
    var inherits2 = require_inherits();
    var path2 = require("path");
    var rimraf = require_rimraf();
    inherits2(LinkWriter, Writer);
    function LinkWriter(props) {
      var self2 = this;
      if (!(self2 instanceof LinkWriter)) {
        throw new Error("LinkWriter must be called as constructor.");
      }
      if (!(props.type === "Link" && props.Link || props.type === "SymbolicLink" && props.SymbolicLink)) {
        throw new Error("Non-link type " + props.type);
      }
      if (props.linkpath === "")
        props.linkpath = ".";
      if (!props.linkpath) {
        self2.error("Need linkpath property to create " + props.type);
      }
      Writer.call(this, props);
    }
    LinkWriter.prototype._create = function() {
      var self2 = this;
      var hard = self2.type === "Link" || process.platform === "win32";
      var link = hard ? "link" : "symlink";
      var lp = hard ? path2.resolve(self2.dirname, self2.linkpath) : self2.linkpath;
      if (hard)
        return clobber(self2, lp, link);
      fs.readlink(self2._path, function(er, p) {
        if (p && p === lp)
          return finish(self2);
        clobber(self2, lp, link);
      });
    };
    function clobber(self2, lp, link) {
      rimraf(self2._path, function(er) {
        if (er)
          return self2.error(er);
        create(self2, lp, link);
      });
    }
    function create(self2, lp, link) {
      fs[link](lp, self2._path, function(er) {
        if (er) {
          if ((er.code === "ENOENT" || er.code === "EACCES" || er.code === "EPERM") && process.platform === "win32") {
            self2.ready = true;
            self2.emit("ready");
            self2.emit("end");
            self2.emit("close");
            self2.end = self2._finish = function() {
            };
          } else
            return self2.error(er);
        }
        finish(self2);
      });
    }
    function finish(self2) {
      self2.ready = true;
      self2.emit("ready");
      if (self2._ended && !self2._finished)
        self2._finish();
    }
    LinkWriter.prototype.end = function() {
      this._ended = true;
      if (this.ready) {
        this._finished = true;
        this._finish();
      }
    };
  }
});

// node_modules/fstream/lib/file-writer.js
var require_file_writer = __commonJS({
  "node_modules/fstream/lib/file-writer.js"(exports2, module2) {
    module2.exports = FileWriter;
    var fs = require_graceful_fs();
    var Writer = require_writer();
    var inherits2 = require_inherits();
    var EOF = {};
    inherits2(FileWriter, Writer);
    function FileWriter(props) {
      var self2 = this;
      if (!(self2 instanceof FileWriter)) {
        throw new Error("FileWriter must be called as constructor.");
      }
      if (props.type !== "File" || !props.File) {
        throw new Error("Non-file type " + props.type);
      }
      self2._buffer = [];
      self2._bytesWritten = 0;
      Writer.call(this, props);
    }
    FileWriter.prototype._create = function() {
      var self2 = this;
      if (self2._stream)
        return;
      var so = {};
      if (self2.props.flags)
        so.flags = self2.props.flags;
      so.mode = Writer.filemode;
      if (self2._old && self2._old.blksize)
        so.bufferSize = self2._old.blksize;
      self2._stream = fs.createWriteStream(self2._path, so);
      self2._stream.on("open", function() {
        self2.ready = true;
        self2._buffer.forEach(function(c) {
          if (c === EOF)
            self2._stream.end();
          else
            self2._stream.write(c);
        });
        self2.emit("ready");
        self2.emit("drain");
      });
      self2._stream.on("error", function(er) {
        self2.emit("error", er);
      });
      self2._stream.on("drain", function() {
        self2.emit("drain");
      });
      self2._stream.on("close", function() {
        self2._finish();
      });
    };
    FileWriter.prototype.write = function(c) {
      var self2 = this;
      self2._bytesWritten += c.length;
      if (!self2.ready) {
        if (!Buffer.isBuffer(c) && typeof c !== "string") {
          throw new Error("invalid write data");
        }
        self2._buffer.push(c);
        return false;
      }
      var ret2 = self2._stream.write(c);
      if (ret2 === false && self2._stream._queue) {
        return self2._stream._queue.length <= 2;
      } else {
        return ret2;
      }
    };
    FileWriter.prototype.end = function(c) {
      var self2 = this;
      if (c)
        self2.write(c);
      if (!self2.ready) {
        self2._buffer.push(EOF);
        return false;
      }
      return self2._stream.end();
    };
    FileWriter.prototype._finish = function() {
      var self2 = this;
      if (typeof self2.size === "number" && self2._bytesWritten !== self2.size) {
        self2.error(
          "Did not get expected byte count.\nexpect: " + self2.size + "\nactual: " + self2._bytesWritten
        );
      }
      Writer.prototype._finish.call(self2);
    };
  }
});

// node_modules/fstream/lib/proxy-writer.js
var require_proxy_writer = __commonJS({
  "node_modules/fstream/lib/proxy-writer.js"(exports2, module2) {
    module2.exports = ProxyWriter;
    var Writer = require_writer();
    var getType = require_get_type();
    var inherits2 = require_inherits();
    var collect = require_collect();
    var fs = require("fs");
    inherits2(ProxyWriter, Writer);
    function ProxyWriter(props) {
      var self2 = this;
      if (!(self2 instanceof ProxyWriter)) {
        throw new Error("ProxyWriter must be called as constructor.");
      }
      self2.props = props;
      self2._needDrain = false;
      Writer.call(self2, props);
    }
    ProxyWriter.prototype._stat = function() {
      var self2 = this;
      var props = self2.props;
      var stat = props.follow ? "stat" : "lstat";
      fs[stat](props.path, function(er, current) {
        var type;
        if (er || !current) {
          type = "File";
        } else {
          type = getType(current);
        }
        props[type] = true;
        props.type = self2.type = type;
        self2._old = current;
        self2._addProxy(Writer(props, current));
      });
    };
    ProxyWriter.prototype._addProxy = function(proxy) {
      var self2 = this;
      if (self2._proxy) {
        return self2.error("proxy already set");
      }
      self2._proxy = proxy;
      [
        "ready",
        "error",
        "close",
        "pipe",
        "drain",
        "warn"
      ].forEach(function(ev) {
        proxy.on(ev, self2.emit.bind(self2, ev));
      });
      self2.emit("proxy", proxy);
      var calls = self2._buffer;
      calls.forEach(function(c) {
        proxy[c[0]].apply(proxy, c[1]);
      });
      self2._buffer.length = 0;
      if (self2._needsDrain)
        self2.emit("drain");
    };
    ProxyWriter.prototype.add = function(entry) {
      collect(entry);
      if (!this._proxy) {
        this._buffer.push(["add", [entry]]);
        this._needDrain = true;
        return false;
      }
      return this._proxy.add(entry);
    };
    ProxyWriter.prototype.write = function(c) {
      if (!this._proxy) {
        this._buffer.push(["write", [c]]);
        this._needDrain = true;
        return false;
      }
      return this._proxy.write(c);
    };
    ProxyWriter.prototype.end = function(c) {
      if (!this._proxy) {
        this._buffer.push(["end", [c]]);
        return false;
      }
      return this._proxy.end(c);
    };
  }
});

// node_modules/fstream/lib/writer.js
var require_writer = __commonJS({
  "node_modules/fstream/lib/writer.js"(exports2, module2) {
    module2.exports = Writer;
    var fs = require_graceful_fs();
    var inherits2 = require_inherits();
    var rimraf = require_rimraf();
    var mkdir = require_mkdirp();
    var path2 = require("path");
    var umask = process.platform === "win32" ? 0 : process.umask();
    var getType = require_get_type();
    var Abstract = require_abstract();
    inherits2(Writer, Abstract);
    Writer.dirmode = parseInt("0777", 8) & ~umask;
    Writer.filemode = parseInt("0666", 8) & ~umask;
    var DirWriter = require_dir_writer();
    var LinkWriter = require_link_writer();
    var FileWriter = require_file_writer();
    var ProxyWriter = require_proxy_writer();
    function Writer(props, current) {
      var self2 = this;
      if (typeof props === "string") {
        props = { path: props };
      }
      var type = getType(props);
      var ClassType = Writer;
      switch (type) {
        case "Directory":
          ClassType = DirWriter;
          break;
        case "File":
          ClassType = FileWriter;
          break;
        case "Link":
        case "SymbolicLink":
          ClassType = LinkWriter;
          break;
        case null:
        default:
          ClassType = ProxyWriter;
          break;
      }
      if (!(self2 instanceof ClassType))
        return new ClassType(props);
      Abstract.call(self2);
      if (!props.path)
        self2.error("Must provide a path", null, true);
      self2.type = props.type;
      self2.props = props;
      self2.depth = props.depth || 0;
      self2.clobber = props.clobber === false ? props.clobber : true;
      self2.parent = props.parent || null;
      self2.root = props.root || props.parent && props.parent.root || self2;
      self2._path = self2.path = path2.resolve(props.path);
      if (process.platform === "win32") {
        self2.path = self2._path = self2.path.replace(/\?/g, "_");
        if (self2._path.length >= 260) {
          self2._swallowErrors = true;
          self2._path = "\\\\?\\" + self2.path.replace(/\//g, "\\");
        }
      }
      self2.basename = path2.basename(props.path);
      self2.dirname = path2.dirname(props.path);
      self2.linkpath = props.linkpath || null;
      props.parent = props.root = null;
      self2.size = props.size;
      if (typeof props.mode === "string") {
        props.mode = parseInt(props.mode, 8);
      }
      self2.readable = false;
      self2.writable = true;
      self2._buffer = [];
      self2.ready = false;
      self2.filter = typeof props.filter === "function" ? props.filter : null;
      self2._stat(current);
    }
    Writer.prototype._create = function() {
      var self2 = this;
      fs[self2.props.follow ? "stat" : "lstat"](self2._path, function(er) {
        if (er) {
          return self2.warn("Cannot create " + self2._path + "\nUnsupported type: " + self2.type, "ENOTSUP");
        }
        self2._finish();
      });
    };
    Writer.prototype._stat = function(current) {
      var self2 = this;
      var props = self2.props;
      var stat = props.follow ? "stat" : "lstat";
      var who = self2._proxy || self2;
      if (current)
        statCb(null, current);
      else
        fs[stat](self2._path, statCb);
      function statCb(er, current2) {
        if (self2.filter && !self2.filter.call(who, who, current2)) {
          self2._aborted = true;
          self2.emit("end");
          self2.emit("close");
          return;
        }
        if (er || !current2) {
          return create(self2);
        }
        self2._old = current2;
        var currentType = getType(current2);
        if (currentType !== self2.type || self2.type === "File" && current2.nlink > 1) {
          return rimraf(self2._path, function(er2) {
            if (er2)
              return self2.error(er2);
            self2._old = null;
            create(self2);
          });
        }
        create(self2);
      }
    };
    function create(self2) {
      mkdir(path2.dirname(self2._path), Writer.dirmode, function(er, made) {
        if (er)
          return self2.error(er);
        self2._madeDir = made;
        return self2._create();
      });
    }
    function endChmod(self2, want, current, path3, cb) {
      var wantMode = want.mode;
      var chmod = want.follow || self2.type !== "SymbolicLink" ? "chmod" : "lchmod";
      if (!fs[chmod])
        return cb();
      if (typeof wantMode !== "number")
        return cb();
      var curMode = current.mode & parseInt("0777", 8);
      wantMode = wantMode & parseInt("0777", 8);
      if (wantMode === curMode)
        return cb();
      fs[chmod](path3, wantMode, cb);
    }
    function endChown(self2, want, current, path3, cb) {
      if (process.platform === "win32")
        return cb();
      if (!process.getuid || process.getuid() !== 0)
        return cb();
      if (typeof want.uid !== "number" && typeof want.gid !== "number")
        return cb();
      if (current.uid === want.uid && current.gid === want.gid)
        return cb();
      var chown = self2.props.follow || self2.type !== "SymbolicLink" ? "chown" : "lchown";
      if (!fs[chown])
        return cb();
      if (typeof want.uid !== "number")
        want.uid = current.uid;
      if (typeof want.gid !== "number")
        want.gid = current.gid;
      fs[chown](path3, want.uid, want.gid, cb);
    }
    function endUtimes(self2, want, current, path3, cb) {
      if (!fs.utimes || process.platform === "win32")
        return cb();
      var utimes = want.follow || self2.type !== "SymbolicLink" ? "utimes" : "lutimes";
      if (utimes === "lutimes" && !fs[utimes]) {
        utimes = "utimes";
      }
      if (!fs[utimes])
        return cb();
      var curA = current.atime;
      var curM = current.mtime;
      var meA = want.atime;
      var meM = want.mtime;
      if (meA === void 0)
        meA = curA;
      if (meM === void 0)
        meM = curM;
      if (!isDate(meA))
        meA = new Date(meA);
      if (!isDate(meM))
        meA = new Date(meM);
      if (meA.getTime() === curA.getTime() && meM.getTime() === curM.getTime())
        return cb();
      fs[utimes](path3, meA, meM, cb);
    }
    Writer.prototype._finish = function() {
      var self2 = this;
      if (self2._finishing)
        return;
      self2._finishing = true;
      var todo = 0;
      var errState = null;
      var done = false;
      if (self2._old) {
        self2._old.atime = /* @__PURE__ */ new Date(0);
        self2._old.mtime = /* @__PURE__ */ new Date(0);
        setProps(self2._old);
      } else {
        var stat = self2.props.follow ? "stat" : "lstat";
        fs[stat](self2._path, function(er, current) {
          if (er) {
            if (er.code === "ENOENT" && (self2.type === "Link" || self2.type === "SymbolicLink") && process.platform === "win32") {
              self2.ready = true;
              self2.emit("ready");
              self2.emit("end");
              self2.emit("close");
              self2.end = self2._finish = function() {
              };
              return;
            } else
              return self2.error(er);
          }
          setProps(self2._old = current);
        });
      }
      return;
      function setProps(current) {
        todo += 3;
        endChmod(self2, self2.props, current, self2._path, next("chmod"));
        endChown(self2, self2.props, current, self2._path, next("chown"));
        endUtimes(self2, self2.props, current, self2._path, next("utimes"));
      }
      function next(what) {
        return function(er) {
          if (errState)
            return;
          if (er) {
            er.fstream_finish_call = what;
            return self2.error(errState = er);
          }
          if (--todo > 0)
            return;
          if (done)
            return;
          done = true;
          if (!self2._madeDir)
            return end();
          else
            endMadeDir(self2, self2._path, end);
          function end(er2) {
            if (er2) {
              er2.fstream_finish_call = "setupMadeDir";
              return self2.error(er2);
            }
            self2.emit("end");
            self2.emit("close");
          }
        };
      }
    };
    function endMadeDir(self2, p, cb) {
      var made = self2._madeDir;
      var d = path2.dirname(p);
      endMadeDir_(self2, d, function(er) {
        if (er)
          return cb(er);
        if (d === made) {
          return cb();
        }
        endMadeDir(self2, d, cb);
      });
    }
    function endMadeDir_(self2, p, cb) {
      var dirProps = {};
      Object.keys(self2.props).forEach(function(k) {
        dirProps[k] = self2.props[k];
        if (k === "mode" && self2.type !== "Directory") {
          dirProps[k] = dirProps[k] | parseInt("0111", 8);
        }
      });
      var todo = 3;
      var errState = null;
      fs.stat(p, function(er, current) {
        if (er)
          return cb(errState = er);
        endChmod(self2, dirProps, current, p, next);
        endChown(self2, dirProps, current, p, next);
        endUtimes(self2, dirProps, current, p, next);
      });
      function next(er) {
        if (errState)
          return;
        if (er)
          return cb(errState = er);
        if (--todo === 0)
          return cb();
      }
    }
    Writer.prototype.pipe = function() {
      this.error("Can't pipe from writable stream");
    };
    Writer.prototype.add = function() {
      this.error("Can't add to non-Directory type");
    };
    Writer.prototype.write = function() {
      return true;
    };
    function objectToString(d) {
      return Object.prototype.toString.call(d);
    }
    function isDate(d) {
      return typeof d === "object" && objectToString(d) === "[object Date]";
    }
  }
});

// node_modules/fstream/fstream.js
var require_fstream = __commonJS({
  "node_modules/fstream/fstream.js"(exports2) {
    exports2.Abstract = require_abstract();
    exports2.Reader = require_reader();
    exports2.Writer = require_writer();
    exports2.File = {
      Reader: require_file_reader(),
      Writer: require_file_writer()
    };
    exports2.Dir = {
      Reader: require_dir_reader(),
      Writer: require_dir_writer()
    };
    exports2.Link = {
      Reader: require_link_reader(),
      Writer: require_link_writer()
    };
    exports2.Proxy = {
      Reader: require_proxy_reader(),
      Writer: require_proxy_writer()
    };
    exports2.Reader.Dir = exports2.DirReader = exports2.Dir.Reader;
    exports2.Reader.File = exports2.FileReader = exports2.File.Reader;
    exports2.Reader.Link = exports2.LinkReader = exports2.Link.Reader;
    exports2.Reader.Proxy = exports2.ProxyReader = exports2.Proxy.Reader;
    exports2.Writer.Dir = exports2.DirWriter = exports2.Dir.Writer;
    exports2.Writer.File = exports2.FileWriter = exports2.File.Writer;
    exports2.Writer.Link = exports2.LinkWriter = exports2.Link.Writer;
    exports2.Writer.Proxy = exports2.ProxyWriter = exports2.Proxy.Writer;
    exports2.collect = require_collect();
  }
});

// node_modules/unzipper/lib/extract.js
var require_extract = __commonJS({
  "node_modules/unzipper/lib/extract.js"(exports2, module2) {
    module2.exports = Extract;
    var Parse = require_parse();
    var Writer = require_fstream().Writer;
    var path2 = require("path");
    var stream = require("stream");
    var duplexer2 = require_duplexer2();
    var Promise2 = require_bluebird();
    function Extract(opts) {
      opts.path = path2.resolve(path2.normalize(opts.path));
      var parser = new Parse(opts);
      var outStream = new stream.Writable({ objectMode: true });
      outStream._write = function(entry, encoding, cb) {
        if (entry.type == "Directory")
          return cb();
        var extractPath = path2.join(opts.path, entry.path);
        if (extractPath.indexOf(opts.path) != 0) {
          return cb();
        }
        const writer = opts.getWriter ? opts.getWriter({ path: extractPath }) : Writer({ path: extractPath });
        entry.pipe(writer).on("error", cb).on("close", cb);
      };
      var extract = duplexer2(parser, outStream);
      parser.once("crx-header", function(crxHeader) {
        extract.crxHeader = crxHeader;
      });
      parser.pipe(outStream).on("finish", function() {
        extract.emit("close");
      });
      extract.promise = function() {
        return new Promise2(function(resolve2, reject) {
          extract.on("close", resolve2);
          extract.on("error", reject);
        });
      };
      return extract;
    }
  }
});

// node_modules/big-integer/BigInteger.js
var require_BigInteger = __commonJS({
  "node_modules/big-integer/BigInteger.js"(exports2, module2) {
    var bigInt = function(undefined2) {
      "use strict";
      var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
      var supportsNativeBigInt = typeof BigInt === "function";
      function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined")
          return Integer[0];
        if (typeof radix !== "undefined")
          return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
      }
      function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
      }
      BigInteger.prototype = Object.create(Integer.prototype);
      function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
      }
      SmallInteger.prototype = Object.create(Integer.prototype);
      function NativeBigInt(value) {
        this.value = value;
      }
      NativeBigInt.prototype = Object.create(Integer.prototype);
      function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
      }
      function smallToArray(n) {
        if (n < 1e7)
          return [n];
        if (n < 1e14)
          return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
      }
      function arrayToSmall(arr) {
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
          switch (length) {
            case 0:
              return 0;
            case 1:
              return arr[0];
            case 2:
              return arr[0] + arr[1] * BASE;
            default:
              return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
          }
        }
        return arr;
      }
      function trim(v) {
        var i2 = v.length;
        while (v[--i2] === 0)
          ;
        v.length = i2 + 1;
      }
      function createArray(length) {
        var x = new Array(length);
        var i2 = -1;
        while (++i2 < length) {
          x[i2] = 0;
        }
        return x;
      }
      function truncate(n) {
        if (n > 0)
          return Math.floor(n);
        return Math.ceil(n);
      }
      function add(a, b) {
        var l_a = a.length, l_b = b.length, r = new Array(l_a), carry = 0, base = BASE, sum, i2;
        for (i2 = 0; i2 < l_b; i2++) {
          sum = a[i2] + b[i2] + carry;
          carry = sum >= base ? 1 : 0;
          r[i2] = sum - carry * base;
        }
        while (i2 < l_a) {
          sum = a[i2] + carry;
          carry = sum === base ? 1 : 0;
          r[i2++] = sum - carry * base;
        }
        if (carry > 0)
          r.push(carry);
        return r;
      }
      function addAny(a, b) {
        if (a.length >= b.length)
          return add(a, b);
        return add(b, a);
      }
      function addSmall(a, carry) {
        var l2 = a.length, r = new Array(l2), base = BASE, sum, i2;
        for (i2 = 0; i2 < l2; i2++) {
          sum = a[i2] - base + carry;
          carry = Math.floor(sum / base);
          r[i2] = sum - carry * base;
          carry += 1;
        }
        while (carry > 0) {
          r[i2++] = carry % base;
          carry = Math.floor(carry / base);
        }
        return r;
      }
      BigInteger.prototype.add = function(v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
          return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
          return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
      };
      BigInteger.prototype.plus = BigInteger.prototype.add;
      SmallInteger.prototype.add = function(v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
          return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
          if (isPrecise(a + b))
            return new SmallInteger(a + b);
          b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
      };
      SmallInteger.prototype.plus = SmallInteger.prototype.add;
      NativeBigInt.prototype.add = function(v) {
        return new NativeBigInt(this.value + parseValue(v).value);
      };
      NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
      function subtract(a, b) {
        var a_l = a.length, b_l = b.length, r = new Array(a_l), borrow = 0, base = BASE, i2, difference;
        for (i2 = 0; i2 < b_l; i2++) {
          difference = a[i2] - borrow - b[i2];
          if (difference < 0) {
            difference += base;
            borrow = 1;
          } else
            borrow = 0;
          r[i2] = difference;
        }
        for (i2 = b_l; i2 < a_l; i2++) {
          difference = a[i2] - borrow;
          if (difference < 0)
            difference += base;
          else {
            r[i2++] = difference;
            break;
          }
          r[i2] = difference;
        }
        for (; i2 < a_l; i2++) {
          r[i2] = a[i2];
        }
        trim(r);
        return r;
      }
      function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
          value = subtract(a, b);
        } else {
          value = subtract(b, a);
          sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
          if (sign)
            value = -value;
          return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
      }
      function subtractSmall(a, b, sign) {
        var l2 = a.length, r = new Array(l2), carry = -b, base = BASE, i2, difference;
        for (i2 = 0; i2 < l2; i2++) {
          difference = a[i2] + carry;
          carry = Math.floor(difference / base);
          difference %= base;
          r[i2] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
          if (sign)
            r = -r;
          return new SmallInteger(r);
        }
        return new BigInteger(r, sign);
      }
      BigInteger.prototype.subtract = function(v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
          return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
          return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
      };
      BigInteger.prototype.minus = BigInteger.prototype.subtract;
      SmallInteger.prototype.subtract = function(v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
          return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
          return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
      };
      SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
      NativeBigInt.prototype.subtract = function(v) {
        return new NativeBigInt(this.value - parseValue(v).value);
      };
      NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
      BigInteger.prototype.negate = function() {
        return new BigInteger(this.value, !this.sign);
      };
      SmallInteger.prototype.negate = function() {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
      };
      NativeBigInt.prototype.negate = function() {
        return new NativeBigInt(-this.value);
      };
      BigInteger.prototype.abs = function() {
        return new BigInteger(this.value, false);
      };
      SmallInteger.prototype.abs = function() {
        return new SmallInteger(Math.abs(this.value));
      };
      NativeBigInt.prototype.abs = function() {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
      };
      function multiplyLong(a, b) {
        var a_l = a.length, b_l = b.length, l2 = a_l + b_l, r = createArray(l2), base = BASE, product, carry, i2, a_i, b_j;
        for (i2 = 0; i2 < a_l; ++i2) {
          a_i = a[i2];
          for (var j = 0; j < b_l; ++j) {
            b_j = b[j];
            product = a_i * b_j + r[i2 + j];
            carry = Math.floor(product / base);
            r[i2 + j] = product - carry * base;
            r[i2 + j + 1] += carry;
          }
        }
        trim(r);
        return r;
      }
      function multiplySmall(a, b) {
        var l2 = a.length, r = new Array(l2), base = BASE, carry = 0, product, i2;
        for (i2 = 0; i2 < l2; i2++) {
          product = a[i2] * b + carry;
          carry = Math.floor(product / base);
          r[i2] = product - carry * base;
        }
        while (carry > 0) {
          r[i2++] = carry % base;
          carry = Math.floor(carry / base);
        }
        return r;
      }
      function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0)
          r.push(0);
        return r.concat(x);
      }
      function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);
        if (n <= 30)
          return multiplyLong(x, y);
        n = Math.ceil(n / 2);
        var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
        var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
      }
      function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 15e-6 * l1 * l2 > 0;
      }
      BigInteger.prototype.multiply = function(v) {
        var n = parseValue(v), a = this.value, b = n.value, sign = this.sign !== n.sign, abs;
        if (n.isSmall) {
          if (b === 0)
            return Integer[0];
          if (b === 1)
            return this;
          if (b === -1)
            return this.negate();
          abs = Math.abs(b);
          if (abs < BASE) {
            return new BigInteger(multiplySmall(a, abs), sign);
          }
          b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length))
          return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
      };
      BigInteger.prototype.times = BigInteger.prototype.multiply;
      function multiplySmallAndArray(a, b, sign) {
        if (a < BASE) {
          return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
      }
      SmallInteger.prototype._multiplyBySmall = function(a) {
        if (isPrecise(a.value * this.value)) {
          return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
      };
      BigInteger.prototype._multiplyBySmall = function(a) {
        if (a.value === 0)
          return Integer[0];
        if (a.value === 1)
          return this;
        if (a.value === -1)
          return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
      };
      SmallInteger.prototype.multiply = function(v) {
        return parseValue(v)._multiplyBySmall(this);
      };
      SmallInteger.prototype.times = SmallInteger.prototype.multiply;
      NativeBigInt.prototype.multiply = function(v) {
        return new NativeBigInt(this.value * parseValue(v).value);
      };
      NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
      function square(a) {
        var l2 = a.length, r = createArray(l2 + l2), base = BASE, product, carry, i2, a_i, a_j;
        for (i2 = 0; i2 < l2; i2++) {
          a_i = a[i2];
          carry = 0 - a_i * a_i;
          for (var j = i2; j < l2; j++) {
            a_j = a[j];
            product = 2 * (a_i * a_j) + r[i2 + j] + carry;
            carry = Math.floor(product / base);
            r[i2 + j] = product - carry * base;
          }
          r[i2 + l2] = carry;
        }
        trim(r);
        return r;
      }
      BigInteger.prototype.square = function() {
        return new BigInteger(square(this.value), false);
      };
      SmallInteger.prototype.square = function() {
        var value = this.value * this.value;
        if (isPrecise(value))
          return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
      };
      NativeBigInt.prototype.square = function(v) {
        return new NativeBigInt(this.value * this.value);
      };
      function divMod1(a, b) {
        var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i2, l2, q;
        if (remainder.length <= a_l)
          remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
          quotientDigit = base - 1;
          if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
            quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
          }
          carry = 0;
          borrow = 0;
          l2 = divisor.length;
          for (i2 = 0; i2 < l2; i2++) {
            carry += quotientDigit * divisor[i2];
            q = Math.floor(carry / base);
            borrow += remainder[shift + i2] - (carry - q * base);
            carry = q;
            if (borrow < 0) {
              remainder[shift + i2] = borrow + base;
              borrow = -1;
            } else {
              remainder[shift + i2] = borrow;
              borrow = 0;
            }
          }
          while (borrow !== 0) {
            quotientDigit -= 1;
            carry = 0;
            for (i2 = 0; i2 < l2; i2++) {
              carry += remainder[shift + i2] - base + divisor[i2];
              if (carry < 0) {
                remainder[shift + i2] = carry + base;
                carry = 0;
              } else {
                remainder[shift + i2] = carry;
                carry = 1;
              }
            }
            borrow += carry;
          }
          result[shift] = quotientDigit;
        }
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
      }
      function divMod2(a, b) {
        var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess, xlen, highx, highy, check;
        while (a_l) {
          part.unshift(a[--a_l]);
          trim(part);
          if (compareAbs(part, b) < 0) {
            result.push(0);
            continue;
          }
          xlen = part.length;
          highx = part[xlen - 1] * base + part[xlen - 2];
          highy = b[b_l - 1] * base + b[b_l - 2];
          if (xlen > b_l) {
            highx = (highx + 1) * base;
          }
          guess = Math.ceil(highx / highy);
          do {
            check = multiplySmall(b, guess);
            if (compareAbs(check, part) <= 0)
              break;
            guess--;
          } while (guess);
          result.push(guess);
          part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
      }
      function divModSmall(value, lambda) {
        var length = value.length, quotient = createArray(length), base = BASE, i2, q, remainder, divisor;
        remainder = 0;
        for (i2 = length - 1; i2 >= 0; --i2) {
          divisor = remainder * base + value[i2];
          q = truncate(divisor / lambda);
          remainder = divisor - q * lambda;
          quotient[i2] = q | 0;
        }
        return [quotient, remainder | 0];
      }
      function divModAny(self2, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
          return [new NativeBigInt(self2.value / n.value), new NativeBigInt(self2.value % n.value)];
        }
        var a = self2.value, b = n.value;
        var quotient;
        if (b === 0)
          throw new Error("Cannot divide by zero");
        if (self2.isSmall) {
          if (n.isSmall) {
            return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
          }
          return [Integer[0], self2];
        }
        if (n.isSmall) {
          if (b === 1)
            return [self2, Integer[0]];
          if (b == -1)
            return [self2.negate(), Integer[0]];
          var abs = Math.abs(b);
          if (abs < BASE) {
            value = divModSmall(a, abs);
            quotient = arrayToSmall(value[0]);
            var remainder = value[1];
            if (self2.sign)
              remainder = -remainder;
            if (typeof quotient === "number") {
              if (self2.sign !== n.sign)
                quotient = -quotient;
              return [new SmallInteger(quotient), new SmallInteger(remainder)];
            }
            return [new BigInteger(quotient, self2.sign !== n.sign), new SmallInteger(remainder)];
          }
          b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1)
          return [Integer[0], self2];
        if (comparison === 0)
          return [Integer[self2.sign === n.sign ? 1 : -1], Integer[0]];
        if (a.length + b.length <= 200)
          value = divMod1(a, b);
        else
          value = divMod2(a, b);
        quotient = value[0];
        var qSign = self2.sign !== n.sign, mod = value[1], mSign = self2.sign;
        if (typeof quotient === "number") {
          if (qSign)
            quotient = -quotient;
          quotient = new SmallInteger(quotient);
        } else
          quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
          if (mSign)
            mod = -mod;
          mod = new SmallInteger(mod);
        } else
          mod = new BigInteger(mod, mSign);
        return [quotient, mod];
      }
      BigInteger.prototype.divmod = function(v) {
        var result = divModAny(this, v);
        return {
          quotient: result[0],
          remainder: result[1]
        };
      };
      NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
      BigInteger.prototype.divide = function(v) {
        return divModAny(this, v)[0];
      };
      NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
        return new NativeBigInt(this.value / parseValue(v).value);
      };
      SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
      BigInteger.prototype.mod = function(v) {
        return divModAny(this, v)[1];
      };
      NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
        return new NativeBigInt(this.value % parseValue(v).value);
      };
      SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
      BigInteger.prototype.pow = function(v) {
        var n = parseValue(v), a = this.value, b = n.value, value, x, y;
        if (b === 0)
          return Integer[1];
        if (a === 0)
          return Integer[0];
        if (a === 1)
          return Integer[1];
        if (a === -1)
          return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
          return Integer[0];
        }
        if (!n.isSmall)
          throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
          if (isPrecise(value = Math.pow(a, b)))
            return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
          if (b & true) {
            y = y.times(x);
            --b;
          }
          if (b === 0)
            break;
          b /= 2;
          x = x.square();
        }
        return y;
      };
      SmallInteger.prototype.pow = BigInteger.prototype.pow;
      NativeBigInt.prototype.pow = function(v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0)
          return Integer[1];
        if (a === _0)
          return Integer[0];
        if (a === _1)
          return Integer[1];
        if (a === BigInt(-1))
          return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative())
          return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
          if ((b & _1) === _1) {
            y = y.times(x);
            --b;
          }
          if (b === _0)
            break;
          b /= _2;
          x = x.square();
        }
        return y;
      };
      BigInteger.prototype.modPow = function(exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero())
          throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1], base = this.mod(mod);
        if (exp.isNegative()) {
          exp = exp.multiply(Integer[-1]);
          base = base.modInv(mod);
        }
        while (exp.isPositive()) {
          if (base.isZero())
            return Integer[0];
          if (exp.isOdd())
            r = r.multiply(base).mod(mod);
          exp = exp.divide(2);
          base = base.square().mod(mod);
        }
        return r;
      };
      NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
      function compareAbs(a, b) {
        if (a.length !== b.length) {
          return a.length > b.length ? 1 : -1;
        }
        for (var i2 = a.length - 1; i2 >= 0; i2--) {
          if (a[i2] !== b[i2])
            return a[i2] > b[i2] ? 1 : -1;
        }
        return 0;
      }
      BigInteger.prototype.compareAbs = function(v) {
        var n = parseValue(v), a = this.value, b = n.value;
        if (n.isSmall)
          return 1;
        return compareAbs(a, b);
      };
      SmallInteger.prototype.compareAbs = function(v) {
        var n = parseValue(v), a = Math.abs(this.value), b = n.value;
        if (n.isSmall) {
          b = Math.abs(b);
          return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
      };
      NativeBigInt.prototype.compareAbs = function(v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
      };
      BigInteger.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var n = parseValue(v), a = this.value, b = n.value;
        if (this.sign !== n.sign) {
          return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
          return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
      };
      BigInteger.prototype.compareTo = BigInteger.prototype.compare;
      SmallInteger.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var n = parseValue(v), a = this.value, b = n.value;
        if (n.isSmall) {
          return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
          return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
      };
      SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
      NativeBigInt.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
      };
      NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
      BigInteger.prototype.equals = function(v) {
        return this.compare(v) === 0;
      };
      NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
      BigInteger.prototype.notEquals = function(v) {
        return this.compare(v) !== 0;
      };
      NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
      BigInteger.prototype.greater = function(v) {
        return this.compare(v) > 0;
      };
      NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
      BigInteger.prototype.lesser = function(v) {
        return this.compare(v) < 0;
      };
      NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
      BigInteger.prototype.greaterOrEquals = function(v) {
        return this.compare(v) >= 0;
      };
      NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
      BigInteger.prototype.lesserOrEquals = function(v) {
        return this.compare(v) <= 0;
      };
      NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
      BigInteger.prototype.isEven = function() {
        return (this.value[0] & 1) === 0;
      };
      SmallInteger.prototype.isEven = function() {
        return (this.value & 1) === 0;
      };
      NativeBigInt.prototype.isEven = function() {
        return (this.value & BigInt(1)) === BigInt(0);
      };
      BigInteger.prototype.isOdd = function() {
        return (this.value[0] & 1) === 1;
      };
      SmallInteger.prototype.isOdd = function() {
        return (this.value & 1) === 1;
      };
      NativeBigInt.prototype.isOdd = function() {
        return (this.value & BigInt(1)) === BigInt(1);
      };
      BigInteger.prototype.isPositive = function() {
        return !this.sign;
      };
      SmallInteger.prototype.isPositive = function() {
        return this.value > 0;
      };
      NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
      BigInteger.prototype.isNegative = function() {
        return this.sign;
      };
      SmallInteger.prototype.isNegative = function() {
        return this.value < 0;
      };
      NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
      BigInteger.prototype.isUnit = function() {
        return false;
      };
      SmallInteger.prototype.isUnit = function() {
        return Math.abs(this.value) === 1;
      };
      NativeBigInt.prototype.isUnit = function() {
        return this.abs().value === BigInt(1);
      };
      BigInteger.prototype.isZero = function() {
        return false;
      };
      SmallInteger.prototype.isZero = function() {
        return this.value === 0;
      };
      NativeBigInt.prototype.isZero = function() {
        return this.value === BigInt(0);
      };
      BigInteger.prototype.isDivisibleBy = function(v) {
        var n = parseValue(v);
        if (n.isZero())
          return false;
        if (n.isUnit())
          return true;
        if (n.compareAbs(2) === 0)
          return this.isEven();
        return this.mod(n).isZero();
      };
      NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
      function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit())
          return false;
        if (n.equals(2) || n.equals(3) || n.equals(5))
          return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
          return false;
        if (n.lesser(49))
          return true;
      }
      function millerRabinTest(n, a) {
        var nPrev = n.prev(), b = nPrev, r = 0, d, t, i2, x;
        while (b.isEven())
          b = b.divide(2), r++;
        next:
          for (i2 = 0; i2 < a.length; i2++) {
            if (n.lesser(a[i2]))
              continue;
            x = bigInt(a[i2]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev))
              continue;
            for (d = r - 1; d != 0; d--) {
              x = x.square().mod(n);
              if (x.isUnit())
                return false;
              if (x.equals(nPrev))
                continue next;
            }
            return false;
          }
        return true;
      }
      BigInteger.prototype.isPrime = function(strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined2)
          return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
          return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
        for (var a = [], i2 = 0; i2 < t; i2++) {
          a.push(bigInt(i2 + 2));
        }
        return millerRabinTest(n, a);
      };
      NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
      BigInteger.prototype.isProbablePrime = function(iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined2)
          return isPrime;
        var n = this.abs();
        var t = iterations === undefined2 ? 5 : iterations;
        for (var a = [], i2 = 0; i2 < t; i2++) {
          a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
      };
      NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
      BigInteger.prototype.modInv = function(n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
          q = r.divide(newR);
          lastT = t;
          lastR = r;
          t = newT;
          r = newR;
          newT = lastT.subtract(q.multiply(newT));
          newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit())
          throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
          t = t.add(n);
        }
        if (this.isNegative()) {
          return t.negate();
        }
        return t;
      };
      NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
      BigInteger.prototype.next = function() {
        var value = this.value;
        if (this.sign) {
          return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
      };
      SmallInteger.prototype.next = function() {
        var value = this.value;
        if (value + 1 < MAX_INT)
          return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
      };
      NativeBigInt.prototype.next = function() {
        return new NativeBigInt(this.value + BigInt(1));
      };
      BigInteger.prototype.prev = function() {
        var value = this.value;
        if (this.sign) {
          return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
      };
      SmallInteger.prototype.prev = function() {
        var value = this.value;
        if (value - 1 > -MAX_INT)
          return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
      };
      NativeBigInt.prototype.prev = function() {
        return new NativeBigInt(this.value - BigInt(1));
      };
      var powersOfTwo = [1];
      while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)
        powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
      var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
      function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
      }
      BigInteger.prototype.shiftLeft = function(v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
          throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0)
          return this.shiftRight(-n);
        var result = this;
        if (result.isZero())
          return result;
        while (n >= powers2Length) {
          result = result.multiply(highestPower2);
          n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
      };
      NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
      BigInteger.prototype.shiftRight = function(v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
          throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0)
          return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
          if (result.isZero() || result.isNegative() && result.isUnit())
            return result;
          remQuo = divModAny(result, highestPower2);
          result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
          n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
      };
      NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
      function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
          xDivMod = divModAny(xRem, highestPower2);
          xDigit = xDivMod[1].toJSNumber();
          if (xSign) {
            xDigit = highestPower2 - 1 - xDigit;
          }
          yDivMod = divModAny(yRem, highestPower2);
          yDigit = yDivMod[1].toJSNumber();
          if (ySign) {
            yDigit = highestPower2 - 1 - yDigit;
          }
          xRem = xDivMod[0];
          yRem = yDivMod[0];
          result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i2 = result.length - 1; i2 >= 0; i2 -= 1) {
          sum = sum.multiply(highestPower2).add(bigInt(result[i2]));
        }
        return sum;
      }
      BigInteger.prototype.not = function() {
        return this.negate().prev();
      };
      NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
      BigInteger.prototype.and = function(n) {
        return bitwise(this, n, function(a, b) {
          return a & b;
        });
      };
      NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
      BigInteger.prototype.or = function(n) {
        return bitwise(this, n, function(a, b) {
          return a | b;
        });
      };
      NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
      BigInteger.prototype.xor = function(n) {
        return bitwise(this, n, function(a, b) {
          return a ^ b;
        });
      };
      NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
      var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
      function roughLOB(n) {
        var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
      }
      function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
          var tmp = integerLogarithm(value, base.square(base));
          var p = tmp.p;
          var e = tmp.e;
          var t = p.multiply(base);
          return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
      }
      BigInteger.prototype.bitLength = function() {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
          n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
          return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
      };
      NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
      function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
      }
      function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
      }
      function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b))
          return a;
        if (a.isZero())
          return b;
        if (b.isZero())
          return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
          d = min(roughLOB(a), roughLOB(b));
          a = a.divide(d);
          b = b.divide(d);
          c = c.multiply(d);
        }
        while (a.isEven()) {
          a = a.divide(roughLOB(a));
        }
        do {
          while (b.isEven()) {
            b = b.divide(roughLOB(b));
          }
          if (a.greater(b)) {
            t = b;
            b = a;
            a = t;
          }
          b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
      }
      function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
      }
      function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall)
          return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i2 = 0; i2 < digits.length; i2++) {
          var top = restricted ? digits[i2] + (i2 + 1 < digits.length ? digits[i2 + 1] / BASE : 0) : BASE;
          var digit = truncate(usedRNG() * top);
          result.push(digit);
          if (digit < digits[i2])
            restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
      }
      var parseBase = function(text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
          text = text.toLowerCase();
          alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i2;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i2 = 0; i2 < alphabet.length; i2++) {
          alphabetValues[alphabet[i2]] = i2;
        }
        for (i2 = 0; i2 < length; i2++) {
          var c = text[i2];
          if (c === "-")
            continue;
          if (c in alphabetValues) {
            if (alphabetValues[c] >= absBase) {
              if (c === "1" && absBase === 1)
                continue;
              throw new Error(c + " is not a valid digit in base " + base + ".");
            }
          }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i2 = isNegative ? 1 : 0; i2 < text.length; i2++) {
          var c = text[i2];
          if (c in alphabetValues)
            digits.push(parseValue(alphabetValues[c]));
          else if (c === "<") {
            var start = i2;
            do {
              i2++;
            } while (text[i2] !== ">" && i2 < text.length);
            digits.push(parseValue(text.slice(start + 1, i2)));
          } else
            throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
      };
      function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i2;
        for (i2 = digits.length - 1; i2 >= 0; i2--) {
          val = val.add(digits[i2].times(pow));
          pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
      }
      function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
          return alphabet[digit];
        }
        return "<" + digit + ">";
      }
      function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
          if (n.isZero())
            return { value: [0], isNegative: false };
          throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
          if (n.isZero())
            return { value: [0], isNegative: false };
          if (n.isNegative())
            return {
              value: [].concat.apply(
                [],
                Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])
              ),
              isNegative: false
            };
          var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
          arr.unshift([1]);
          return {
            value: [].concat.apply([], arr),
            isNegative: false
          };
        }
        var neg = false;
        if (n.isNegative() && base.isPositive()) {
          neg = true;
          n = n.abs();
        }
        if (base.isUnit()) {
          if (n.isZero())
            return { value: [0], isNegative: false };
          return {
            value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
            isNegative: neg
          };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
          divmod = left.divmod(base);
          left = divmod.quotient;
          var digit = divmod.remainder;
          if (digit.isNegative()) {
            digit = base.minus(digit).abs();
            left = left.next();
          }
          out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
      }
      function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
          return stringify(x, alphabet);
        }).join("");
      }
      BigInteger.prototype.toArray = function(radix) {
        return toBase(this, radix);
      };
      SmallInteger.prototype.toArray = function(radix) {
        return toBase(this, radix);
      };
      NativeBigInt.prototype.toArray = function(radix) {
        return toBase(this, radix);
      };
      BigInteger.prototype.toString = function(radix, alphabet) {
        if (radix === undefined2)
          radix = 10;
        if (radix !== 10)
          return toBaseString(this, radix, alphabet);
        var v = this.value, l2 = v.length, str = String(v[--l2]), zeros = "0000000", digit;
        while (--l2 >= 0) {
          digit = String(v[l2]);
          str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
      };
      SmallInteger.prototype.toString = function(radix, alphabet) {
        if (radix === undefined2)
          radix = 10;
        if (radix != 10)
          return toBaseString(this, radix, alphabet);
        return String(this.value);
      };
      NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
      NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
        return this.toString();
      };
      BigInteger.prototype.valueOf = function() {
        return parseInt(this.toString(), 10);
      };
      BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
      SmallInteger.prototype.valueOf = function() {
        return this.value;
      };
      SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
      NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
        return parseInt(this.toString(), 10);
      };
      function parseStringValue(v) {
        if (isPrecise(+v)) {
          var x = +v;
          if (x === truncate(x))
            return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
          throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign)
          v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2)
          throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
          var exp = split[1];
          if (exp[0] === "+")
            exp = exp.slice(1);
          exp = +exp;
          if (exp !== truncate(exp) || !isPrecise(exp))
            throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
          var text = split[0];
          var decimalPlace = text.indexOf(".");
          if (decimalPlace >= 0) {
            exp -= text.length - decimalPlace - 1;
            text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
          }
          if (exp < 0)
            throw new Error("Cannot include negative exponent part for integers");
          text += new Array(exp + 1).join("0");
          v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid)
          throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
          return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max2 = v.length, l2 = LOG_BASE, min2 = max2 - l2;
        while (max2 > 0) {
          r.push(+v.slice(min2, max2));
          min2 -= l2;
          if (min2 < 0)
            min2 = 0;
          max2 -= l2;
        }
        trim(r);
        return new BigInteger(r, sign);
      }
      function parseNumberValue(v) {
        if (supportsNativeBigInt) {
          return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
          if (v !== truncate(v))
            throw new Error(v + " is not an integer.");
          return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
      }
      function parseValue(v) {
        if (typeof v === "number") {
          return parseNumberValue(v);
        }
        if (typeof v === "string") {
          return parseStringValue(v);
        }
        if (typeof v === "bigint") {
          return new NativeBigInt(v);
        }
        return v;
      }
      for (var i = 0; i < 1e3; i++) {
        Integer[i] = parseValue(i);
        if (i > 0)
          Integer[-i] = parseValue(-i);
      }
      Integer.one = Integer[1];
      Integer.zero = Integer[0];
      Integer.minusOne = Integer[-1];
      Integer.max = max;
      Integer.min = min;
      Integer.gcd = gcd;
      Integer.lcm = lcm;
      Integer.isInstance = function(x) {
        return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
      };
      Integer.randBetween = randBetween;
      Integer.fromArray = function(digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
      };
      return Integer;
    }();
    if (typeof module2 !== "undefined" && module2.hasOwnProperty("exports")) {
      module2.exports = bigInt;
    }
    if (typeof define === "function" && define.amd) {
      define(function() {
        return bigInt;
      });
    }
  }
});

// node_modules/unzipper/lib/Decrypt.js
var require_Decrypt = __commonJS({
  "node_modules/unzipper/lib/Decrypt.js"(exports2, module2) {
    var bigInt = require_BigInteger();
    var Stream = require("stream");
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    var table;
    function generateTable() {
      var poly = 3988292384, c, n, k;
      table = [];
      for (n = 0; n < 256; n++) {
        c = n;
        for (k = 0; k < 8; k++)
          c = c & 1 ? poly ^ c >>> 1 : c = c >>> 1;
        table[n] = c >>> 0;
      }
    }
    function crc(ch, crc2) {
      if (!table)
        generateTable();
      if (ch.charCodeAt)
        ch = ch.charCodeAt(0);
      return bigInt(crc2).shiftRight(8).and(16777215).xor(table[bigInt(crc2).xor(ch).and(255)]).value;
    }
    function Decrypt() {
      if (!(this instanceof Decrypt))
        return new Decrypt();
      this.key0 = 305419896;
      this.key1 = 591751049;
      this.key2 = 878082192;
    }
    Decrypt.prototype.update = function(h) {
      this.key0 = crc(h, this.key0);
      this.key1 = bigInt(this.key0).and(255).and(4294967295).add(this.key1);
      this.key1 = bigInt(this.key1).multiply(134775813).add(1).and(4294967295).value;
      this.key2 = crc(bigInt(this.key1).shiftRight(24).and(255), this.key2);
    };
    Decrypt.prototype.decryptByte = function(c) {
      var k = bigInt(this.key2).or(2);
      c = c ^ bigInt(k).multiply(bigInt(k ^ 1)).shiftRight(8).and(255);
      this.update(c);
      return c;
    };
    Decrypt.prototype.stream = function() {
      var stream = Stream.Transform(), self2 = this;
      stream._transform = function(d, e, cb) {
        for (var i = 0; i < d.length; i++) {
          d[i] = self2.decryptByte(d[i]);
        }
        this.push(d);
        cb();
      };
      return stream;
    };
    module2.exports = Decrypt;
  }
});

// node_modules/unzipper/lib/Open/unzip.js
var require_unzip = __commonJS({
  "node_modules/unzipper/lib/Open/unzip.js"(exports2, module2) {
    var Promise2 = require_bluebird();
    var Decrypt = require_Decrypt();
    var PullStream = require_PullStream();
    var Stream = require("stream");
    var binary = require_binary();
    var zlib = require("zlib");
    var parseExtraField = require_parseExtraField();
    var Buffer2 = require_Buffer();
    var parseDateTime = require_parseDateTime();
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    module2.exports = function unzip(source, offset, _password, directoryVars) {
      var file = PullStream(), entry = Stream.PassThrough();
      var req = source.stream(offset);
      req.pipe(file).on("error", function(e) {
        entry.emit("error", e);
      });
      entry.vars = file.pull(30).then(function(data) {
        var vars = binary.parse(data).word32lu("signature").word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").vars;
        vars.lastModifiedDateTime = parseDateTime(vars.lastModifiedDate, vars.lastModifiedTime);
        return file.pull(vars.fileNameLength).then(function(fileName) {
          vars.fileName = fileName.toString("utf8");
          return file.pull(vars.extraFieldLength);
        }).then(function(extraField) {
          var checkEncryption;
          vars.extra = parseExtraField(extraField, vars);
          if (directoryVars && directoryVars.compressedSize)
            vars = directoryVars;
          if (vars.flags & 1)
            checkEncryption = file.pull(12).then(function(header) {
              if (!_password)
                throw new Error("MISSING_PASSWORD");
              var decrypt = Decrypt();
              String(_password).split("").forEach(function(d) {
                decrypt.update(d);
              });
              for (var i = 0; i < header.length; i++)
                header[i] = decrypt.decryptByte(header[i]);
              vars.decrypt = decrypt;
              vars.compressedSize -= 12;
              var check = vars.flags & 8 ? vars.lastModifiedTime >> 8 & 255 : vars.crc32 >> 24 & 255;
              if (header[11] !== check)
                throw new Error("BAD_PASSWORD");
              return vars;
            });
          return Promise2.resolve(checkEncryption).then(function() {
            entry.emit("vars", vars);
            return vars;
          });
        });
      });
      entry.vars.then(function(vars) {
        var fileSizeKnown = !(vars.flags & 8) || vars.compressedSize > 0, eof;
        var inflater = vars.compressionMethod ? zlib.createInflateRaw() : Stream.PassThrough();
        if (fileSizeKnown) {
          entry.size = vars.uncompressedSize;
          eof = vars.compressedSize;
        } else {
          eof = Buffer2.alloc(4);
          eof.writeUInt32LE(134695760, 0);
        }
        var stream = file.stream(eof);
        if (vars.decrypt)
          stream = stream.pipe(vars.decrypt.stream());
        stream.pipe(inflater).on("error", function(err) {
          entry.emit("error", err);
        }).pipe(entry).on("finish", function() {
          if (req.abort)
            req.abort();
          else if (req.close)
            req.close();
          else if (req.push)
            req.push();
          else
            console.log("warning - unable to close stream");
        });
      }).catch(function(e) {
        entry.emit("error", e);
      });
      return entry;
    };
  }
});

// node_modules/unzipper/lib/Open/directory.js
var require_directory = __commonJS({
  "node_modules/unzipper/lib/Open/directory.js"(exports2, module2) {
    var binary = require_binary();
    var PullStream = require_PullStream();
    var unzip = require_unzip();
    var Promise2 = require_bluebird();
    var BufferStream = require_BufferStream();
    var parseExtraField = require_parseExtraField();
    var Buffer2 = require_Buffer();
    var path2 = require("path");
    var Writer = require_fstream().Writer;
    var parseDateTime = require_parseDateTime();
    var signature = Buffer2.alloc(4);
    signature.writeUInt32LE(101010256, 0);
    function getCrxHeader(source) {
      var sourceStream = source.stream(0).pipe(PullStream());
      return sourceStream.pull(4).then(function(data) {
        var signature2 = data.readUInt32LE(0);
        if (signature2 === 875721283) {
          var crxHeader;
          return sourceStream.pull(12).then(function(data2) {
            crxHeader = binary.parse(data2).word32lu("version").word32lu("pubKeyLength").word32lu("signatureLength").vars;
          }).then(function() {
            return sourceStream.pull(crxHeader.pubKeyLength + crxHeader.signatureLength);
          }).then(function(data2) {
            crxHeader.publicKey = data2.slice(0, crxHeader.pubKeyLength);
            crxHeader.signature = data2.slice(crxHeader.pubKeyLength);
            crxHeader.size = 16 + crxHeader.pubKeyLength + crxHeader.signatureLength;
            return crxHeader;
          });
        }
      });
    }
    function getZip64CentralDirectory(source, zip64CDL) {
      var d64loc = binary.parse(zip64CDL).word32lu("signature").word32lu("diskNumber").word64lu("offsetToStartOfCentralDirectory").word32lu("numberOfDisks").vars;
      if (d64loc.signature != 117853008) {
        throw new Error("invalid zip64 end of central dir locator signature (0x07064b50): 0x" + d64loc.signature.toString(16));
      }
      var dir64 = PullStream();
      source.stream(d64loc.offsetToStartOfCentralDirectory).pipe(dir64);
      return dir64.pull(56);
    }
    function parseZip64DirRecord(dir64record) {
      var vars = binary.parse(dir64record).word32lu("signature").word64lu("sizeOfCentralDirectory").word16lu("version").word16lu("versionsNeededToExtract").word32lu("diskNumber").word32lu("diskStart").word64lu("numberOfRecordsOnDisk").word64lu("numberOfRecords").word64lu("sizeOfCentralDirectory").word64lu("offsetToStartOfCentralDirectory").vars;
      if (vars.signature != 101075792) {
        throw new Error("invalid zip64 end of central dir locator signature (0x06064b50): 0x0" + vars.signature.toString(16));
      }
      return vars;
    }
    module2.exports = function centralDirectory(source, options) {
      var endDir = PullStream(), records = PullStream(), tailSize = options && options.tailSize || 80, sourceSize, crxHeader, startOffset, vars;
      if (options && options.crx)
        crxHeader = getCrxHeader(source);
      return source.size().then(function(size) {
        sourceSize = size;
        source.stream(Math.max(0, size - tailSize)).on("error", function(error) {
          endDir.emit("error", error);
        }).pipe(endDir);
        return endDir.pull(signature);
      }).then(function() {
        return Promise2.props({ directory: endDir.pull(22), crxHeader });
      }).then(function(d) {
        var data = d.directory;
        startOffset = d.crxHeader && d.crxHeader.size || 0;
        vars = binary.parse(data).word32lu("signature").word16lu("diskNumber").word16lu("diskStart").word16lu("numberOfRecordsOnDisk").word16lu("numberOfRecords").word32lu("sizeOfCentralDirectory").word32lu("offsetToStartOfCentralDirectory").word16lu("commentLength").vars;
        if (vars.numberOfRecords == 65535 || vars.numberOfRecords == 65535 || vars.offsetToStartOfCentralDirectory == 4294967295) {
          const zip64CDLSize = 20;
          const zip64CDLOffset = sourceSize - (tailSize - endDir.match + zip64CDLSize);
          const zip64CDLStream = PullStream();
          source.stream(zip64CDLOffset).pipe(zip64CDLStream);
          return zip64CDLStream.pull(zip64CDLSize).then(function(d2) {
            return getZip64CentralDirectory(source, d2);
          }).then(function(dir64record) {
            vars = parseZip64DirRecord(dir64record);
          });
        } else {
          vars.offsetToStartOfCentralDirectory += startOffset;
        }
      }).then(function() {
        source.stream(vars.offsetToStartOfCentralDirectory).pipe(records);
        vars.extract = function(opts) {
          if (!opts || !opts.path)
            throw new Error("PATH_MISSING");
          return vars.files.then(function(files) {
            return Promise2.map(files, function(entry) {
              if (entry.type == "Directory")
                return;
              var extractPath = path2.join(opts.path, entry.path);
              if (extractPath.indexOf(opts.path) != 0) {
                return;
              }
              var writer = opts.getWriter ? opts.getWriter({ path: extractPath }) : Writer({ path: extractPath });
              return new Promise2(function(resolve2, reject) {
                entry.stream(opts.password).on("error", reject).pipe(writer).on("close", resolve2).on("error", reject);
              });
            }, opts.concurrency > 1 ? { concurrency: opts.concurrency || void 0 } : void 0);
          });
        };
        vars.files = Promise2.mapSeries(Array(vars.numberOfRecords), function() {
          return records.pull(46).then(function(data) {
            var vars2 = binary.parse(data).word32lu("signature").word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").word16lu("fileCommentLength").word16lu("diskNumber").word16lu("internalFileAttributes").word32lu("externalFileAttributes").word32lu("offsetToLocalFileHeader").vars;
            vars2.offsetToLocalFileHeader += startOffset;
            vars2.lastModifiedDateTime = parseDateTime(vars2.lastModifiedDate, vars2.lastModifiedTime);
            return records.pull(vars2.fileNameLength).then(function(fileNameBuffer) {
              vars2.pathBuffer = fileNameBuffer;
              vars2.path = fileNameBuffer.toString("utf8");
              vars2.isUnicode = vars2.flags & 17;
              return records.pull(vars2.extraFieldLength);
            }).then(function(extraField) {
              vars2.extra = parseExtraField(extraField, vars2);
              return records.pull(vars2.fileCommentLength);
            }).then(function(comment) {
              vars2.comment = comment;
              vars2.type = vars2.uncompressedSize === 0 && /[\/\\]$/.test(vars2.path) ? "Directory" : "File";
              vars2.stream = function(_password) {
                return unzip(source, vars2.offsetToLocalFileHeader, _password, vars2);
              };
              vars2.buffer = function(_password) {
                return BufferStream(vars2.stream(_password));
              };
              return vars2;
            });
          });
        });
        return Promise2.props(vars);
      });
    };
  }
});

// node_modules/unzipper/lib/Open/index.js
var require_Open = __commonJS({
  "node_modules/unzipper/lib/Open/index.js"(exports2, module2) {
    var fs = require_graceful_fs();
    var Promise2 = require_bluebird();
    var directory = require_directory();
    var Stream = require("stream");
    if (!Stream.Writable || !Stream.Writable.prototype.destroy)
      Stream = require_readable();
    module2.exports = {
      buffer: function(buffer, options) {
        var source = {
          stream: function(offset, length) {
            var stream = Stream.PassThrough();
            stream.end(buffer.slice(offset, length));
            return stream;
          },
          size: function() {
            return Promise2.resolve(buffer.length);
          }
        };
        return directory(source, options);
      },
      file: function(filename, options) {
        var source = {
          stream: function(offset, length) {
            return fs.createReadStream(filename, { start: offset, end: length && offset + length });
          },
          size: function() {
            return new Promise2(function(resolve2, reject) {
              fs.stat(filename, function(err, d) {
                if (err)
                  reject(err);
                else
                  resolve2(d.size);
              });
            });
          }
        };
        return directory(source, options);
      },
      url: function(request, params, options) {
        if (typeof params === "string")
          params = { url: params };
        if (!params.url)
          throw "URL missing";
        params.headers = params.headers || {};
        var source = {
          stream: function(offset, length) {
            var options2 = Object.create(params);
            options2.headers = Object.create(params.headers);
            options2.headers.range = "bytes=" + offset + "-" + (length ? length : "");
            return request(options2);
          },
          size: function() {
            return new Promise2(function(resolve2, reject) {
              var req = request(params);
              req.on("response", function(d) {
                req.abort();
                if (!d.headers["content-length"])
                  reject(new Error("Missing content length header"));
                else
                  resolve2(d.headers["content-length"]);
              }).on("error", reject);
            });
          }
        };
        return directory(source, options);
      },
      s3: function(client, params, options) {
        var source = {
          size: function() {
            return new Promise2(function(resolve2, reject) {
              client.headObject(params, function(err, d) {
                if (err)
                  reject(err);
                else
                  resolve2(d.ContentLength);
              });
            });
          },
          stream: function(offset, length) {
            var d = {};
            for (var key in params)
              d[key] = params[key];
            d.Range = "bytes=" + offset + "-" + (length ? length : "");
            return client.getObject(d).createReadStream();
          }
        };
        return directory(source, options);
      }
    };
  }
});

// node_modules/unzipper/unzip.js
var require_unzip2 = __commonJS({
  "node_modules/unzipper/unzip.js"(exports2) {
    "use strict";
    require_listenercount();
    require_buffer_indexof_polyfill();
    require_setImmediate();
    exports2.Parse = require_parse();
    exports2.ParseOne = require_parseOne();
    exports2.Extract = require_extract();
    exports2.Open = require_Open();
  }
});

// node_modules/rimraf/node_modules/glob/common.js
var require_common2 = __commonJS({
  "node_modules/rimraf/node_modules/glob/common.js"(exports2) {
    exports2.setopts = setopts;
    exports2.ownProp = ownProp;
    exports2.makeAbs = makeAbs;
    exports2.finish = finish;
    exports2.mark = mark;
    exports2.isIgnored = isIgnored;
    exports2.childrenIgnored = childrenIgnored;
    function ownProp(obj2, field) {
      return Object.prototype.hasOwnProperty.call(obj2, field);
    }
    var fs = require("fs");
    var path2 = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self2, options) {
      self2.ignore = options.ignore || [];
      if (!Array.isArray(self2.ignore))
        self2.ignore = [self2.ignore];
      if (self2.ignore.length) {
        self2.ignore = self2.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self2, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self2.silent = !!options.silent;
      self2.pattern = pattern;
      self2.strict = options.strict !== false;
      self2.realpath = !!options.realpath;
      self2.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self2.follow = !!options.follow;
      self2.dot = !!options.dot;
      self2.mark = !!options.mark;
      self2.nodir = !!options.nodir;
      if (self2.nodir)
        self2.mark = true;
      self2.sync = !!options.sync;
      self2.nounique = !!options.nounique;
      self2.nonull = !!options.nonull;
      self2.nosort = !!options.nosort;
      self2.nocase = !!options.nocase;
      self2.stat = !!options.stat;
      self2.noprocess = !!options.noprocess;
      self2.absolute = !!options.absolute;
      self2.fs = options.fs || fs;
      self2.maxLength = options.maxLength || Infinity;
      self2.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self2.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self2.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self2, options);
      self2.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self2.cwd = cwd;
      else {
        self2.cwd = path2.resolve(options.cwd);
        self2.changedCwd = self2.cwd !== cwd;
      }
      self2.root = options.root || path2.resolve(self2.cwd, "/");
      self2.root = path2.resolve(self2.root);
      if (process.platform === "win32")
        self2.root = self2.root.replace(/\\/g, "/");
      self2.cwdAbs = isAbsolute(self2.cwd) ? self2.cwd : makeAbs(self2, self2.cwd);
      if (process.platform === "win32")
        self2.cwdAbs = self2.cwdAbs.replace(/\\/g, "/");
      self2.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = false;
      self2.minimatch = new Minimatch(pattern, options);
      self2.options = self2.minimatch.options;
    }
    function finish(self2) {
      var nou = self2.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i = 0, l2 = self2.matches.length; i < l2; i++) {
        var matches = self2.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self2.nonull) {
            var literal = self2.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self2.nosort)
        all = all.sort(alphasort);
      if (self2.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self2._mark(all[i]);
        }
        if (self2.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self2.cache[e] || self2.cache[makeAbs(self2, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self2.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self2, m2);
        });
      self2.found = all;
    }
    function mark(self2, p) {
      var abs = makeAbs(self2, p);
      var c = self2.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self2, m);
          self2.statCache[mabs] = self2.statCache[abs];
          self2.cache[mabs] = self2.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self2, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path2.join(self2.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self2.changedCwd) {
        abs = path2.resolve(self2.cwd, f);
      } else {
        abs = path2.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self2, path3) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return item.matcher.match(path3) || !!(item.gmatcher && item.gmatcher.match(path3));
      });
    }
    function childrenIgnored(self2, path3) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path3));
      });
    }
  }
});

// node_modules/rimraf/node_modules/glob/sync.js
var require_sync2 = __commonJS({
  "node_modules/rimraf/node_modules/glob/sync.js"(exports2, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob2().Glob;
    var util = require("util");
    var path2 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common2();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self2 = this;
        this.matches.forEach(function(matchset, index) {
          var set = self2.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self2._makeAbs(p);
              var real = rp.realpathSync(p, self2.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self2._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path2.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path2.join(this.root, prefix);
        } else {
          prefix = path2.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/rimraf/node_modules/glob/glob.js
var require_glob2 = __commonJS({
  "node_modules/rimraf/node_modules/glob/glob.js"(exports2, module2) {
    module2.exports = glob;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits2 = require_inherits();
    var EE = require("events").EventEmitter;
    var path2 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync2();
    var common = require_common2();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits2(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self2 = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self2._processing;
        if (self2._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self2._finish();
            });
          } else {
            self2._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self2 = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self2._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self2 = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i) {
        p = self2._makeAbs(p);
        rp.realpath(p, self2.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self2.emit("error", er);
          if (--n === 0) {
            self2.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self2._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path2.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self2 = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self2.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self2.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self2.cache[abs] = "FILE";
          cb();
        } else
          self2._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self2 = this;
      self2.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self2, abs, cb) {
      return function(er, entries) {
        if (er)
          self2._readdirError(abs, er, cb);
        else
          self2._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self2._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self2 = this;
      this._stat(prefix, function(er, exists) {
        self2._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path2.join(this.root, prefix);
        } else {
          prefix = path2.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self2 = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self2.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self2.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self2._stat2(f, abs, null, lstat, cb);
            else
              self2._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self2._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/rimraf/rimraf.js
var require_rimraf2 = __commonJS({
  "node_modules/rimraf/rimraf.js"(exports2, module2) {
    var assert = require("assert");
    var path2 = require("path");
    var fs = require("fs");
    var glob = void 0;
    try {
      glob = require_glob2();
    } catch (_err) {
    }
    var defaultGlobOpts = {
      nosort: true,
      silent: true
    };
    var timeout = 0;
    var isWindows = process.platform === "win32";
    var defaults = (options) => {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs[m];
        m = m + "Sync";
        options[m] = options[m] || fs[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
      options.emfileWait = options.emfileWait || 1e3;
      if (options.glob === false) {
        options.disableGlob = true;
      }
      if (options.disableGlob !== true && glob === void 0) {
        throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
      }
      options.disableGlob = options.disableGlob || false;
      options.glob = options.glob || defaultGlobOpts;
    };
    var rimraf = (p, options, cb) => {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert.equal(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      let busyTries = 0;
      let errState = null;
      let n = 0;
      const next = (er) => {
        errState = errState || er;
        if (--n === 0)
          cb(errState);
      };
      const afterGlob = (er, results) => {
        if (er)
          return cb(er);
        n = results.length;
        if (n === 0)
          return cb();
        results.forEach((p2) => {
          const CB = (er2) => {
            if (er2) {
              if ((er2.code === "EBUSY" || er2.code === "ENOTEMPTY" || er2.code === "EPERM") && busyTries < options.maxBusyTries) {
                busyTries++;
                return setTimeout(() => rimraf_(p2, options, CB), busyTries * 100);
              }
              if (er2.code === "EMFILE" && timeout < options.emfileWait) {
                return setTimeout(() => rimraf_(p2, options, CB), timeout++);
              }
              if (er2.code === "ENOENT")
                er2 = null;
            }
            timeout = 0;
            next(er2);
          };
          rimraf_(p2, options, CB);
        });
      };
      if (options.disableGlob || !glob.hasMagic(p))
        return afterGlob(null, [p]);
      options.lstat(p, (er, stat) => {
        if (!er)
          return afterGlob(null, [p]);
        glob(p, options.glob, afterGlob);
      });
    };
    var rimraf_ = (p, options, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT")
          return cb(null);
        if (er && er.code === "EPERM" && isWindows)
          fixWinEPERM(p, options, er, cb);
        if (st && st.isDirectory())
          return rmdir(p, options, er, cb);
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT")
              return cb(null);
            if (er2.code === "EPERM")
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            if (er2.code === "EISDIR")
              return rmdir(p, options, er2, cb);
          }
          return cb(er2);
        });
      });
    };
    var fixWinEPERM = (p, options, er, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.chmod(p, 438, (er2) => {
        if (er2)
          cb(er2.code === "ENOENT" ? null : er);
        else
          options.stat(p, (er3, stats) => {
            if (er3)
              cb(er3.code === "ENOENT" ? null : er);
            else if (stats.isDirectory())
              rmdir(p, options, er, cb);
            else
              options.unlink(p, cb);
          });
      });
    };
    var fixWinEPERMSync = (p, options, er) => {
      assert(p);
      assert(options);
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT")
          return;
        else
          throw er;
      }
      let stats;
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT")
          return;
        else
          throw er;
      }
      if (stats.isDirectory())
        rmdirSync(p, options, er);
      else
        options.unlinkSync(p);
    };
    var rmdir = (p, options, originalEr, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
          rmkids(p, options, cb);
        else if (er && er.code === "ENOTDIR")
          cb(originalEr);
        else
          cb(er);
      });
    };
    var rmkids = (p, options, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er)
          return cb(er);
        let n = files.length;
        if (n === 0)
          return options.rmdir(p, cb);
        let errState;
        files.forEach((f) => {
          rimraf(path2.join(p, f), options, (er2) => {
            if (errState)
              return;
            if (er2)
              return cb(errState = er2);
            if (--n === 0)
              options.rmdir(p, cb);
          });
        });
      });
    };
    var rimrafSync = (p, options) => {
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      let results;
      if (options.disableGlob || !glob.hasMagic(p)) {
        results = [p];
      } else {
        try {
          options.lstatSync(p);
          results = [p];
        } catch (er) {
          results = glob.sync(p, options.glob);
        }
      }
      if (!results.length)
        return;
      for (let i = 0; i < results.length; i++) {
        const p2 = results[i];
        let st;
        try {
          st = options.lstatSync(p2);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM" && isWindows)
            fixWinEPERMSync(p2, options, er);
        }
        try {
          if (st && st.isDirectory())
            rmdirSync(p2, options, null);
          else
            options.unlinkSync(p2);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM")
            return isWindows ? fixWinEPERMSync(p2, options, er) : rmdirSync(p2, options, er);
          if (er.code !== "EISDIR")
            throw er;
          rmdirSync(p2, options, er);
        }
      }
    };
    var rmdirSync = (p, options, originalEr) => {
      assert(p);
      assert(options);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "ENOTDIR")
          throw originalEr;
        if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
          rmkidsSync(p, options);
      }
    };
    var rmkidsSync = (p, options) => {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path2.join(p, f), options));
      const retries = isWindows ? 100 : 1;
      let i = 0;
      do {
        let threw = true;
        try {
          const ret2 = options.rmdirSync(p, options);
          threw = false;
          return ret2;
        } finally {
          if (++i < retries && threw)
            continue;
        }
      } while (true);
    };
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/@vscode/test-electron/out/del.js
var require_del = __commonJS({
  "node_modules/@vscode/test-electron/out/del.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.rmdir = void 0;
    var rimraf = require_rimraf2();
    function rmdir(dir) {
      return new Promise((c, e) => {
        rimraf(dir, (err) => {
          if (err) {
            return e(err);
          }
          c();
        });
      });
    }
    exports2.rmdir = rmdir;
  }
});

// node_modules/@vscode/test-electron/out/progress.js
var require_progress = __commonJS({
  "node_modules/@vscode/test-electron/out/progress.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConsoleReporter = exports2.SilentReporter = exports2.ProgressReportStage = void 0;
    var ProgressReportStage;
    (function(ProgressReportStage2) {
      ProgressReportStage2["FetchingVersion"] = "fetchingVersion";
      ProgressReportStage2["ResolvedVersion"] = "resolvedVersion";
      ProgressReportStage2["FetchingInsidersMetadata"] = "fetchingInsidersMetadata";
      ProgressReportStage2["ReplacingOldInsiders"] = "replacingOldInsiders";
      ProgressReportStage2["FoundMatchingInstall"] = "foundMatchingInstall";
      ProgressReportStage2["ResolvingCDNLocation"] = "resolvingCDNLocation";
      ProgressReportStage2["Downloading"] = "downloading";
      ProgressReportStage2["ExtractingSynchonrously"] = "extractingSynchonrously";
      ProgressReportStage2["Retrying"] = "retrying";
      ProgressReportStage2["NewInstallComplete"] = "newInstallComplete";
    })(ProgressReportStage = exports2.ProgressReportStage || (exports2.ProgressReportStage = {}));
    var SilentReporter = class {
      report() {
      }
      error() {
      }
    };
    exports2.SilentReporter = SilentReporter;
    var ConsoleReporter = class {
      constructor(showDownloadProgress) {
        this.showDownloadProgress = showDownloadProgress;
      }
      report(report) {
        switch (report.stage) {
          case ProgressReportStage.ResolvedVersion:
            this.version = report.version;
            break;
          case ProgressReportStage.ReplacingOldInsiders:
            console.log(`Removing outdated Insiders at ${report.downloadedPath} and re-downloading.`);
            console.log(`Old: ${report.oldHash} | ${report.oldDate.toISOString()}`);
            console.log(`New: ${report.newHash} | ${report.newDate.toISOString()}`);
            break;
          case ProgressReportStage.FoundMatchingInstall:
            console.log(`Found existing install in ${report.downloadedPath}. Skipping download`);
            break;
          case ProgressReportStage.ResolvingCDNLocation:
            console.log(`Downloading VS Code ${this.version} from ${report.url}`);
            break;
          case ProgressReportStage.Downloading:
            if (!this.showDownloadProgress && report.bytesSoFar === 0) {
              console.log(`Downloading VS Code (${report.totalBytes}B)`);
            } else if (!this.downloadReport) {
              this.downloadReport = { timeout: setTimeout(() => this.reportDownload(), 100), report };
            } else {
              this.downloadReport.report = report;
            }
            break;
          case ProgressReportStage.Retrying:
            this.flushDownloadReport();
            console.log(`Error downloading, retrying (attempt ${report.attempt} of ${report.totalAttempts}): ${report.error.message}`);
            break;
          case ProgressReportStage.NewInstallComplete:
            this.flushDownloadReport();
            console.log(`Downloaded VS Code into ${report.downloadedPath}`);
            break;
        }
      }
      error(err) {
        console.error(err);
      }
      flushDownloadReport() {
        if (this.showDownloadProgress) {
          this.reportDownload();
          console.log("");
        }
      }
      reportDownload() {
        if (!this.downloadReport) {
          return;
        }
        const { totalBytes, bytesSoFar } = this.downloadReport.report;
        this.downloadReport = void 0;
        const percent = Math.max(0, Math.min(1, bytesSoFar / totalBytes));
        const progressBarSize = 30;
        const barTicks = Math.floor(percent * progressBarSize);
        const progressBar = "=".repeat(barTicks) + "-".repeat(progressBarSize - barTicks);
        process.stdout.write(`\x1B[G\x1B[0KDownloading VS Code [${progressBar}] ${(percent * 100).toFixed()}%`);
      }
    };
    exports2.ConsoleReporter = ConsoleReporter;
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common3 = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common3()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env2.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env2) || env2.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node2 = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj2, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj2[prop] = val;
      return obj2;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common3()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node2();
    }
  }
});

// node_modules/agent-base/dist/src/promisify.js
var require_promisify2 = __commonJS({
  "node_modules/agent-base/dist/src/promisify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function promisify(fn) {
      return function(req, opts) {
        return new Promise((resolve2, reject) => {
          fn.call(this, req, opts, (err, rtn) => {
            if (err) {
              reject(err);
            } else {
              resolve2(rtn);
            }
          });
        });
      };
    }
    exports2.default = promisify;
  }
});

// node_modules/agent-base/dist/src/index.js
var require_src2 = __commonJS({
  "node_modules/agent-base/dist/src/index.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var events_1 = require("events");
    var debug_1 = __importDefault(require_src());
    var promisify_1 = __importDefault(require_promisify2());
    var debug = debug_1.default("agent-base");
    function isAgent(v) {
      return Boolean(v) && typeof v.addRequest === "function";
    }
    function isSecureEndpoint() {
      const { stack } = new Error();
      if (typeof stack !== "string")
        return false;
      return stack.split("\n").some((l2) => l2.indexOf("(https.js:") !== -1 || l2.indexOf("node:https:") !== -1);
    }
    function createAgent(callback, opts) {
      return new createAgent.Agent(callback, opts);
    }
    (function(createAgent2) {
      class Agent extends events_1.EventEmitter {
        constructor(callback, _opts) {
          super();
          let opts = _opts;
          if (typeof callback === "function") {
            this.callback = callback;
          } else if (callback) {
            opts = callback;
          }
          this.timeout = null;
          if (opts && typeof opts.timeout === "number") {
            this.timeout = opts.timeout;
          }
          this.maxFreeSockets = 1;
          this.maxSockets = 1;
          this.maxTotalSockets = Infinity;
          this.sockets = {};
          this.freeSockets = {};
          this.requests = {};
          this.options = {};
        }
        get defaultPort() {
          if (typeof this.explicitDefaultPort === "number") {
            return this.explicitDefaultPort;
          }
          return isSecureEndpoint() ? 443 : 80;
        }
        set defaultPort(v) {
          this.explicitDefaultPort = v;
        }
        get protocol() {
          if (typeof this.explicitProtocol === "string") {
            return this.explicitProtocol;
          }
          return isSecureEndpoint() ? "https:" : "http:";
        }
        set protocol(v) {
          this.explicitProtocol = v;
        }
        callback(req, opts, fn) {
          throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
        }
        /**
         * Called by node-core's "_http_client.js" module when creating
         * a new HTTP request with this Agent instance.
         *
         * @api public
         */
        addRequest(req, _opts) {
          const opts = Object.assign({}, _opts);
          if (typeof opts.secureEndpoint !== "boolean") {
            opts.secureEndpoint = isSecureEndpoint();
          }
          if (opts.host == null) {
            opts.host = "localhost";
          }
          if (opts.port == null) {
            opts.port = opts.secureEndpoint ? 443 : 80;
          }
          if (opts.protocol == null) {
            opts.protocol = opts.secureEndpoint ? "https:" : "http:";
          }
          if (opts.host && opts.path) {
            delete opts.path;
          }
          delete opts.agent;
          delete opts.hostname;
          delete opts._defaultAgent;
          delete opts.defaultPort;
          delete opts.createConnection;
          req._last = true;
          req.shouldKeepAlive = false;
          let timedOut = false;
          let timeoutId = null;
          const timeoutMs = opts.timeout || this.timeout;
          const onerror = (err) => {
            if (req._hadError)
              return;
            req.emit("error", err);
            req._hadError = true;
          };
          const ontimeout = () => {
            timeoutId = null;
            timedOut = true;
            const err = new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
            err.code = "ETIMEOUT";
            onerror(err);
          };
          const callbackError = (err) => {
            if (timedOut)
              return;
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            onerror(err);
          };
          const onsocket = (socket) => {
            if (timedOut)
              return;
            if (timeoutId != null) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            if (isAgent(socket)) {
              debug("Callback returned another Agent instance %o", socket.constructor.name);
              socket.addRequest(req, opts);
              return;
            }
            if (socket) {
              socket.once("free", () => {
                this.freeSocket(socket, opts);
              });
              req.onSocket(socket);
              return;
            }
            const err = new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``);
            onerror(err);
          };
          if (typeof this.callback !== "function") {
            onerror(new Error("`callback` is not defined"));
            return;
          }
          if (!this.promisifiedCallback) {
            if (this.callback.length >= 3) {
              debug("Converting legacy callback function to promise");
              this.promisifiedCallback = promisify_1.default(this.callback);
            } else {
              this.promisifiedCallback = this.callback;
            }
          }
          if (typeof timeoutMs === "number" && timeoutMs > 0) {
            timeoutId = setTimeout(ontimeout, timeoutMs);
          }
          if ("port" in opts && typeof opts.port !== "number") {
            opts.port = Number(opts.port);
          }
          try {
            debug("Resolving socket for %o request: %o", opts.protocol, `${req.method} ${req.path}`);
            Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
          } catch (err) {
            Promise.reject(err).catch(callbackError);
          }
        }
        freeSocket(socket, opts) {
          debug("Freeing socket %o %o", socket.constructor.name, opts);
          socket.destroy();
        }
        destroy() {
          debug("Destroying agent %o", this.constructor.name);
        }
      }
      createAgent2.Agent = Agent;
      createAgent2.prototype = createAgent2.Agent.prototype;
    })(createAgent || (createAgent = {}));
    module2.exports = createAgent;
  }
});

// node_modules/https-proxy-agent/dist/parse-proxy-response.js
var require_parse_proxy_response = __commonJS({
  "node_modules/https-proxy-agent/dist/parse-proxy-response.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var debug_1 = __importDefault(require_src());
    var debug = debug_1.default("https-proxy-agent:parse-proxy-response");
    function parseProxyResponse(socket) {
      return new Promise((resolve2, reject) => {
        let buffersLength = 0;
        const buffers = [];
        function read() {
          const b = socket.read();
          if (b)
            ondata(b);
          else
            socket.once("readable", read);
        }
        function cleanup() {
          socket.removeListener("end", onend);
          socket.removeListener("error", onerror);
          socket.removeListener("close", onclose);
          socket.removeListener("readable", read);
        }
        function onclose(err) {
          debug("onclose had error %o", err);
        }
        function onend() {
          debug("onend");
        }
        function onerror(err) {
          cleanup();
          debug("onerror %o", err);
          reject(err);
        }
        function ondata(b) {
          buffers.push(b);
          buffersLength += b.length;
          const buffered = Buffer.concat(buffers, buffersLength);
          const endOfHeaders = buffered.indexOf("\r\n\r\n");
          if (endOfHeaders === -1) {
            debug("have not received end of HTTP headers yet...");
            read();
            return;
          }
          const firstLine = buffered.toString("ascii", 0, buffered.indexOf("\r\n"));
          const statusCode = +firstLine.split(" ")[1];
          debug("got proxy server response: %o", firstLine);
          resolve2({
            statusCode,
            buffered
          });
        }
        socket.on("error", onerror);
        socket.on("close", onclose);
        socket.on("end", onend);
        read();
      });
    }
    exports2.default = parseProxyResponse;
  }
});

// node_modules/https-proxy-agent/dist/agent.js
var require_agent = __commonJS({
  "node_modules/https-proxy-agent/dist/agent.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var net_1 = __importDefault(require("net"));
    var tls_1 = __importDefault(require("tls"));
    var url_1 = __importDefault(require("url"));
    var assert_1 = __importDefault(require("assert"));
    var debug_1 = __importDefault(require_src());
    var agent_base_1 = require_src2();
    var parse_proxy_response_1 = __importDefault(require_parse_proxy_response());
    var debug = debug_1.default("https-proxy-agent:agent");
    var HttpsProxyAgent = class extends agent_base_1.Agent {
      constructor(_opts) {
        let opts;
        if (typeof _opts === "string") {
          opts = url_1.default.parse(_opts);
        } else {
          opts = _opts;
        }
        if (!opts) {
          throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
        }
        debug("creating new HttpsProxyAgent instance: %o", opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === "string") {
          proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
          proxy.port = this.secureProxy ? 443 : 80;
        }
        if (this.secureProxy && !("ALPNProtocols" in proxy)) {
          proxy.ALPNProtocols = ["http 1.1"];
        }
        if (proxy.host && proxy.path) {
          delete proxy.path;
          delete proxy.pathname;
        }
        this.proxy = proxy;
      }
      /**
       * Called when the node-core HTTP client library is creating a
       * new HTTP request.
       *
       * @api protected
       */
      callback(req, opts) {
        return __awaiter(this, void 0, void 0, function* () {
          const { proxy, secureProxy } = this;
          let socket;
          if (secureProxy) {
            debug("Creating `tls.Socket`: %o", proxy);
            socket = tls_1.default.connect(proxy);
          } else {
            debug("Creating `net.Socket`: %o", proxy);
            socket = net_1.default.connect(proxy);
          }
          const headers = Object.assign({}, proxy.headers);
          const hostname = `${opts.host}:${opts.port}`;
          let payload = `CONNECT ${hostname} HTTP/1.1\r
`;
          if (proxy.auth) {
            headers["Proxy-Authorization"] = `Basic ${Buffer.from(proxy.auth).toString("base64")}`;
          }
          let { host, port, secureEndpoint } = opts;
          if (!isDefaultPort(port, secureEndpoint)) {
            host += `:${port}`;
          }
          headers.Host = host;
          headers.Connection = "close";
          for (const name of Object.keys(headers)) {
            payload += `${name}: ${headers[name]}\r
`;
          }
          const proxyResponsePromise = parse_proxy_response_1.default(socket);
          socket.write(`${payload}\r
`);
          const { statusCode, buffered } = yield proxyResponsePromise;
          if (statusCode === 200) {
            req.once("socket", resume);
            if (opts.secureEndpoint) {
              debug("Upgrading socket connection to TLS");
              const servername = opts.servername || opts.host;
              return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, "host", "hostname", "path", "port")), {
                socket,
                servername
              }));
            }
            return socket;
          }
          socket.destroy();
          const fakeSocket = new net_1.default.Socket({ writable: false });
          fakeSocket.readable = true;
          req.once("socket", (s) => {
            debug("replaying proxy buffer for failed request");
            assert_1.default(s.listenerCount("data") > 0);
            s.push(buffered);
            s.push(null);
          });
          return fakeSocket;
        });
      }
    };
    exports2.default = HttpsProxyAgent;
    function resume(socket) {
      socket.resume();
    }
    function isDefaultPort(port, secure) {
      return Boolean(!secure && port === 80 || secure && port === 443);
    }
    function isHTTPS(protocol) {
      return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
    }
    function omit(obj2, ...keys) {
      const ret2 = {};
      let key;
      for (key in obj2) {
        if (!keys.includes(key)) {
          ret2[key] = obj2[key];
        }
      }
      return ret2;
    }
  }
});

// node_modules/https-proxy-agent/dist/index.js
var require_dist = __commonJS({
  "node_modules/https-proxy-agent/dist/index.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var agent_1 = __importDefault(require_agent());
    function createHttpsProxyAgent(opts) {
      return new agent_1.default(opts);
    }
    (function(createHttpsProxyAgent2) {
      createHttpsProxyAgent2.HttpsProxyAgent = agent_1.default;
      createHttpsProxyAgent2.prototype = agent_1.default.prototype;
    })(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
    module2.exports = createHttpsProxyAgent;
  }
});

// node_modules/@tootallnate/once/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@tootallnate/once/dist/index.js"(exports2, module2) {
    "use strict";
    function noop() {
    }
    function once(emitter, name) {
      const o = once.spread(emitter, name);
      const r = o.then((args) => args[0]);
      r.cancel = o.cancel;
      return r;
    }
    (function(once2) {
      function spread(emitter, name) {
        let c = null;
        const p = new Promise((resolve2, reject) => {
          function cancel() {
            emitter.removeListener(name, onEvent);
            emitter.removeListener("error", onError);
            p.cancel = noop;
          }
          function onEvent(...args) {
            cancel();
            resolve2(args);
          }
          function onError(err) {
            cancel();
            reject(err);
          }
          c = cancel;
          emitter.on(name, onEvent);
          emitter.on("error", onError);
        });
        if (!c) {
          throw new TypeError("Could not get `cancel()` function");
        }
        p.cancel = c;
        return p;
      }
      once2.spread = spread;
    })(once || (once = {}));
    module2.exports = once;
  }
});

// node_modules/http-proxy-agent/dist/agent.js
var require_agent2 = __commonJS({
  "node_modules/http-proxy-agent/dist/agent.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var net_1 = __importDefault(require("net"));
    var tls_1 = __importDefault(require("tls"));
    var url_1 = __importDefault(require("url"));
    var debug_1 = __importDefault(require_src());
    var once_1 = __importDefault(require_dist2());
    var agent_base_1 = require_src2();
    var debug = debug_1.default("http-proxy-agent");
    function isHTTPS(protocol) {
      return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
    }
    var HttpProxyAgent = class extends agent_base_1.Agent {
      constructor(_opts) {
        let opts;
        if (typeof _opts === "string") {
          opts = url_1.default.parse(_opts);
        } else {
          opts = _opts;
        }
        if (!opts) {
          throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
        }
        debug("Creating new HttpProxyAgent instance: %o", opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === "string") {
          proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
          proxy.port = this.secureProxy ? 443 : 80;
        }
        if (proxy.host && proxy.path) {
          delete proxy.path;
          delete proxy.pathname;
        }
        this.proxy = proxy;
      }
      /**
       * Called when the node-core HTTP client library is creating a
       * new HTTP request.
       *
       * @api protected
       */
      callback(req, opts) {
        return __awaiter(this, void 0, void 0, function* () {
          const { proxy, secureProxy } = this;
          const parsed = url_1.default.parse(req.path);
          if (!parsed.protocol) {
            parsed.protocol = "http:";
          }
          if (!parsed.hostname) {
            parsed.hostname = opts.hostname || opts.host || null;
          }
          if (parsed.port == null && typeof opts.port) {
            parsed.port = String(opts.port);
          }
          if (parsed.port === "80") {
            delete parsed.port;
          }
          req.path = url_1.default.format(parsed);
          if (proxy.auth) {
            req.setHeader("Proxy-Authorization", `Basic ${Buffer.from(proxy.auth).toString("base64")}`);
          }
          let socket;
          if (secureProxy) {
            debug("Creating `tls.Socket`: %o", proxy);
            socket = tls_1.default.connect(proxy);
          } else {
            debug("Creating `net.Socket`: %o", proxy);
            socket = net_1.default.connect(proxy);
          }
          if (req._header) {
            let first;
            let endOfHeaders;
            debug("Regenerating stored HTTP header string for request");
            req._header = null;
            req._implicitHeader();
            if (req.output && req.output.length > 0) {
              debug("Patching connection write() output buffer with updated header");
              first = req.output[0];
              endOfHeaders = first.indexOf("\r\n\r\n") + 4;
              req.output[0] = req._header + first.substring(endOfHeaders);
              debug("Output buffer: %o", req.output);
            } else if (req.outputData && req.outputData.length > 0) {
              debug("Patching connection write() output buffer with updated header");
              first = req.outputData[0].data;
              endOfHeaders = first.indexOf("\r\n\r\n") + 4;
              req.outputData[0].data = req._header + first.substring(endOfHeaders);
              debug("Output buffer: %o", req.outputData[0].data);
            }
          }
          yield once_1.default(socket, "connect");
          return socket;
        });
      }
    };
    exports2.default = HttpProxyAgent;
  }
});

// node_modules/http-proxy-agent/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/http-proxy-agent/dist/index.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var agent_1 = __importDefault(require_agent2());
    function createHttpProxyAgent(opts) {
      return new agent_1.default(opts);
    }
    (function(createHttpProxyAgent2) {
      createHttpProxyAgent2.HttpProxyAgent = agent_1.default;
      createHttpProxyAgent2.prototype = agent_1.default.prototype;
    })(createHttpProxyAgent || (createHttpProxyAgent = {}));
    module2.exports = createHttpProxyAgent;
  }
});

// node_modules/@vscode/test-electron/out/runTest.js
var require_runTest = __commonJS({
  "node_modules/@vscode/test-electron/out/runTest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getProfileArguments = exports2.runTests = void 0;
    var cp = require("child_process");
    var path2 = require("path");
    var download_1 = require_download();
    async function runTests2(options) {
      if (!options.vscodeExecutablePath) {
        options.vscodeExecutablePath = await download_1.downloadAndUnzipVSCode(options);
      }
      let args = [
        // https://github.com/microsoft/vscode/issues/84238
        "--no-sandbox",
        // https://github.com/microsoft/vscode-test/issues/120
        "--disable-updates",
        "--skip-welcome",
        "--skip-release-notes",
        "--disable-workspace-trust",
        "--extensionTestsPath=" + options.extensionTestsPath
      ];
      if (Array.isArray(options.extensionDevelopmentPath)) {
        args.push(...options.extensionDevelopmentPath.map((devPath) => `--extensionDevelopmentPath=${devPath}`));
      } else {
        args.push(`--extensionDevelopmentPath=${options.extensionDevelopmentPath}`);
      }
      if (options.launchArgs) {
        args = options.launchArgs.concat(args);
      }
      if (!options.reuseMachineInstall) {
        args.push(...getProfileArguments(args));
      }
      return innerRunTests(options.vscodeExecutablePath, args, options.extensionTestsEnv);
    }
    exports2.runTests = runTests2;
    function getProfileArguments(args) {
      const out = [];
      if (!hasArg("extensions-dir", args)) {
        out.push(`--extensions-dir=${path2.join(download_1.defaultCachePath, "extensions")}`);
      }
      if (!hasArg("user-data-dir", args)) {
        out.push(`--user-data-dir=${path2.join(download_1.defaultCachePath, "user-data")}`);
      }
      return out;
    }
    exports2.getProfileArguments = getProfileArguments;
    function hasArg(argName, argList) {
      return argList.some((a) => a === `--${argName}` || a.startsWith(`--${argName}=`));
    }
    async function innerRunTests(executable, args, testRunnerEnv) {
      return new Promise((resolve2, reject) => {
        const fullEnv = Object.assign({}, process.env, testRunnerEnv);
        const cmd = cp.spawn(executable, args, { env: fullEnv });
        cmd.stdout.on("data", (d) => process.stdout.write(d));
        cmd.stderr.on("data", (d) => process.stderr.write(d));
        cmd.on("error", function(data) {
          console.log("Test error: " + data.toString());
        });
        let finished = false;
        function onProcessClosed(code, signal) {
          if (finished) {
            return;
          }
          finished = true;
          console.log(`Exit code:   ${code !== null && code !== void 0 ? code : signal}`);
          if (code === null) {
            reject(signal);
          } else if (code !== 0) {
            reject("Failed");
          } else {
            console.log("Done\n");
            resolve2(code !== null && code !== void 0 ? code : -1);
          }
        }
        cmd.on("close", onProcessClosed);
        cmd.on("exit", onProcessClosed);
      });
    }
  }
});

// node_modules/@vscode/test-electron/out/util.js
var require_util3 = __commonJS({
  "node_modules/@vscode/test-electron/out/util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveCliArgsFromVSCodeExecutablePath = exports2.resolveCliPathFromVSCodeExecutablePath = exports2.getLatestInsidersMetadata = exports2.insidersDownloadDirMetadata = exports2.insidersDownloadDirToExecutablePath = exports2.downloadDirToExecutablePath = exports2.urlToOptions = exports2.getVSCodeDownloadUrl = exports2.isStableVersionIdentifier = exports2.systemDefaultPlatform = void 0;
    var path2 = require("path");
    var url_1 = require("url");
    var request = require_request();
    var createHttpsProxyAgent = require_dist();
    var createHttpProxyAgent = require_dist3();
    var fs_1 = require("fs");
    var runTest_1 = require_runTest();
    var windowsPlatforms = /* @__PURE__ */ new Set(["win32-archive", "win32-x64-archive", "win32-arm64-archive"]);
    var darwinPlatforms = /* @__PURE__ */ new Set(["darwin-arm64", "darwin"]);
    switch (process.platform) {
      case "darwin":
        exports2.systemDefaultPlatform = process.arch === "arm64" ? "darwin-arm64" : "darwin";
        break;
      case "win32":
        exports2.systemDefaultPlatform = process.arch === "arm64" ? "win32-arm64-archive" : process.arch === "ia32" ? "win32-archive" : "win32-x64-archive";
        break;
      default:
        exports2.systemDefaultPlatform = process.arch === "arm64" ? "linux-arm64" : process.arch === "arm" ? "linux-armhf" : "linux-x64";
    }
    function isStableVersionIdentifier(version) {
      return version === "stable" || version.includes(".");
    }
    exports2.isStableVersionIdentifier = isStableVersionIdentifier;
    function getVSCodeDownloadUrl(version, platform = exports2.systemDefaultPlatform) {
      if (version === "insiders") {
        return `https://update.code.visualstudio.com/latest/${platform}/insider`;
      } else if (isStableVersionIdentifier(version)) {
        return `https://update.code.visualstudio.com/${version}/${platform}/stable`;
      } else {
        return `https://update.code.visualstudio.com/commit:${version}/${platform}/insider`;
      }
    }
    exports2.getVSCodeDownloadUrl = getVSCodeDownloadUrl;
    var PROXY_AGENT = void 0;
    var HTTPS_PROXY_AGENT = void 0;
    if (process.env.npm_config_proxy) {
      PROXY_AGENT = createHttpProxyAgent(process.env.npm_config_proxy);
      HTTPS_PROXY_AGENT = createHttpsProxyAgent(process.env.npm_config_proxy);
    }
    if (process.env.npm_config_https_proxy) {
      HTTPS_PROXY_AGENT = createHttpsProxyAgent(process.env.npm_config_https_proxy);
    }
    function urlToOptions(url) {
      const parsed = new url_1.URL(url);
      const options = {};
      if (PROXY_AGENT && parsed.protocol.startsWith("http:")) {
        options.agent = PROXY_AGENT;
      }
      if (HTTPS_PROXY_AGENT && parsed.protocol.startsWith("https:")) {
        options.agent = HTTPS_PROXY_AGENT;
      }
      return options;
    }
    exports2.urlToOptions = urlToOptions;
    function downloadDirToExecutablePath(dir, platform) {
      if (windowsPlatforms.has(platform)) {
        return path2.resolve(dir, "Code.exe");
      } else if (darwinPlatforms.has(platform)) {
        return path2.resolve(dir, "Visual Studio Code.app/Contents/MacOS/Electron");
      } else {
        return path2.resolve(dir, "code");
      }
    }
    exports2.downloadDirToExecutablePath = downloadDirToExecutablePath;
    function insidersDownloadDirToExecutablePath(dir, platform) {
      if (windowsPlatforms.has(platform)) {
        return path2.resolve(dir, "Code - Insiders.exe");
      } else if (darwinPlatforms.has(platform)) {
        return path2.resolve(dir, "Visual Studio Code - Insiders.app/Contents/MacOS/Electron");
      } else {
        return path2.resolve(dir, "code-insiders");
      }
    }
    exports2.insidersDownloadDirToExecutablePath = insidersDownloadDirToExecutablePath;
    function insidersDownloadDirMetadata(dir, platform) {
      let productJsonPath;
      if (windowsPlatforms.has(platform)) {
        productJsonPath = path2.resolve(dir, "resources/app/product.json");
      } else if (darwinPlatforms.has(platform)) {
        productJsonPath = path2.resolve(dir, "Visual Studio Code - Insiders.app/Contents/Resources/app/product.json");
      } else {
        productJsonPath = path2.resolve(dir, "resources/app/product.json");
      }
      const productJson = JSON.parse(fs_1.readFileSync(productJsonPath, "utf-8"));
      return {
        version: productJson.commit,
        date: new Date(productJson.date)
      };
    }
    exports2.insidersDownloadDirMetadata = insidersDownloadDirMetadata;
    async function getLatestInsidersMetadata(platform) {
      const remoteUrl = `https://update.code.visualstudio.com/api/update/${platform}/insider/latest`;
      return await request.getJSON(remoteUrl, 3e4);
    }
    exports2.getLatestInsidersMetadata = getLatestInsidersMetadata;
    function resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath, platform = exports2.systemDefaultPlatform) {
      if (windowsPlatforms.has(platform)) {
        if (vscodeExecutablePath.endsWith("Code - Insiders.exe")) {
          return path2.resolve(vscodeExecutablePath, "../bin/code-insiders.cmd");
        } else {
          return path2.resolve(vscodeExecutablePath, "../bin/code.cmd");
        }
      } else if (darwinPlatforms.has(platform)) {
        return path2.resolve(vscodeExecutablePath, "../../../Contents/Resources/app/bin/code");
      } else {
        if (vscodeExecutablePath.endsWith("code-insiders")) {
          return path2.resolve(vscodeExecutablePath, "../bin/code-insiders");
        } else {
          return path2.resolve(vscodeExecutablePath, "../bin/code");
        }
      }
    }
    exports2.resolveCliPathFromVSCodeExecutablePath = resolveCliPathFromVSCodeExecutablePath;
    function resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath, options) {
      var _a;
      const args = [resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath, (_a = options === null || options === void 0 ? void 0 : options.platform) !== null && _a !== void 0 ? _a : exports2.systemDefaultPlatform)];
      if (!(options === null || options === void 0 ? void 0 : options.reuseMachineInstall)) {
        args.push(...runTest_1.getProfileArguments(args));
      }
      return args;
    }
    exports2.resolveCliArgsFromVSCodeExecutablePath = resolveCliArgsFromVSCodeExecutablePath;
  }
});

// node_modules/@vscode/test-electron/out/request.js
var require_request = __commonJS({
  "node_modules/@vscode/test-electron/out/request.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TimeoutError = exports2.TimeoutController = exports2.getJSON = exports2.getStream = void 0;
    var https = require("https");
    var util_1 = require_util3();
    async function getStream(api, timeout) {
      const ctrl = new TimeoutController(timeout);
      return new Promise((resolve2, reject) => {
        ctrl.signal.addEventListener("abort", () => {
          reject(new TimeoutError(timeout));
          req.destroy();
        });
        const req = https.get(api, util_1.urlToOptions(api), (res) => resolve2(res)).on("error", reject);
      }).finally(() => ctrl.dispose());
    }
    exports2.getStream = getStream;
    async function getJSON(api, timeout) {
      const ctrl = new TimeoutController(timeout);
      return new Promise((resolve2, reject) => {
        ctrl.signal.addEventListener("abort", () => {
          reject(new TimeoutError(timeout));
          req.destroy();
        });
        const req = https.get(api, util_1.urlToOptions(api), (res) => {
          if (res.statusCode !== 200) {
            reject("Failed to get JSON");
          }
          let data = "";
          res.on("data", (chunk) => {
            ctrl.touch();
            data += chunk;
          });
          res.on("end", () => {
            ctrl.dispose();
            try {
              const jsonData = JSON.parse(data);
              resolve2(jsonData);
            } catch (err) {
              console.error(`Failed to parse response from ${api} as JSON`);
              reject(err);
            }
          });
          res.on("error", reject);
        }).on("error", reject);
      }).finally(() => ctrl.dispose());
    }
    exports2.getJSON = getJSON;
    var TimeoutController = class {
      constructor(timeout) {
        this.timeout = timeout;
        this.ctrl = new AbortController();
        this.reject = () => {
          this.ctrl.abort();
        };
        this.handle = setTimeout(this.reject, timeout);
      }
      get signal() {
        return this.ctrl.signal;
      }
      touch() {
        clearTimeout(this.handle);
        this.handle = setTimeout(this.reject, this.timeout);
      }
      dispose() {
        clearTimeout(this.handle);
      }
    };
    exports2.TimeoutController = TimeoutController;
    var TimeoutError = class extends Error {
      constructor(duration) {
        super(`@vscode/test-electron request timeout out after ${duration}ms`);
      }
    };
    exports2.TimeoutError = TimeoutError;
  }
});

// node_modules/@vscode/test-electron/out/download.js
var require_download = __commonJS({
  "node_modules/@vscode/test-electron/out/download.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.downloadAndUnzipVSCode = exports2.download = exports2.defaultCachePath = void 0;
    var cp = require("child_process");
    var fs = require("fs");
    var os_1 = require("os");
    var path2 = require("path");
    var stream_1 = require("stream");
    var unzipper_1 = require_unzip2();
    var util_1 = require("util");
    var del = require_del();
    var progress_1 = require_progress();
    var request = require_request();
    var util_2 = require_util3();
    var extensionRoot = process.cwd();
    var vscodeStableReleasesAPI = `https://update.code.visualstudio.com/api/releases/stable`;
    var vscodeInsiderCommitsAPI = (platform) => `https://update.code.visualstudio.com/api/commits/insider/${platform}`;
    var DOWNLOAD_ATTEMPTS = 3;
    async function fetchLatestStableVersion(timeout) {
      const versions = await request.getJSON(vscodeStableReleasesAPI, timeout);
      if (!versions || !Array.isArray(versions) || !versions[0]) {
        throw Error("Failed to get latest VS Code version");
      }
      return versions[0];
    }
    async function isValidVersion(version, platform, timeout) {
      if (version === "insiders") {
        return true;
      }
      const stableVersionNumbers = await request.getJSON(vscodeStableReleasesAPI, timeout);
      if (stableVersionNumbers.includes(version)) {
        return true;
      }
      const insiderCommits = await request.getJSON(vscodeInsiderCommitsAPI(platform), timeout);
      if (insiderCommits.includes(version)) {
        return true;
      }
    }
    async function downloadVSCodeArchive(options) {
      var _a, _b;
      if (!fs.existsSync(options.cachePath)) {
        fs.mkdirSync(options.cachePath);
      }
      const timeout = options.timeout;
      const downloadUrl = util_2.getVSCodeDownloadUrl(options.version, options.platform);
      (_a = options.reporter) === null || _a === void 0 ? void 0 : _a.report({ stage: progress_1.ProgressReportStage.ResolvingCDNLocation, url: downloadUrl });
      const res = await request.getStream(downloadUrl, timeout);
      if (res.statusCode !== 302) {
        throw "Failed to get VS Code archive location";
      }
      const url = res.headers.location;
      if (!url) {
        throw "Failed to get VS Code archive location";
      }
      res.destroy();
      const download2 = await request.getStream(url, timeout);
      const totalBytes = Number(download2.headers["content-length"]);
      const contentType = download2.headers["content-type"];
      const isZip = contentType ? contentType === "application/zip" : url.endsWith(".zip");
      const timeoutCtrl = new request.TimeoutController(timeout);
      (_b = options.reporter) === null || _b === void 0 ? void 0 : _b.report({ stage: progress_1.ProgressReportStage.Downloading, url, bytesSoFar: 0, totalBytes });
      let bytesSoFar = 0;
      download2.on("data", (chunk) => {
        var _a2;
        bytesSoFar += chunk.length;
        timeoutCtrl.touch();
        (_a2 = options.reporter) === null || _a2 === void 0 ? void 0 : _a2.report({ stage: progress_1.ProgressReportStage.Downloading, url, bytesSoFar, totalBytes });
      });
      download2.on("end", () => {
        var _a2;
        timeoutCtrl.dispose();
        (_a2 = options.reporter) === null || _a2 === void 0 ? void 0 : _a2.report({ stage: progress_1.ProgressReportStage.Downloading, url, bytesSoFar: totalBytes, totalBytes });
      });
      timeoutCtrl.signal.addEventListener("abort", () => {
        download2.emit("error", new request.TimeoutError(timeout));
        download2.destroy();
      });
      return { stream: download2, format: isZip ? "zip" : "tgz" };
    }
    async function unzipVSCode(reporter, extractDir, extractSync, stream, format) {
      const stagingFile = path2.join(os_1.tmpdir(), `vscode-test-${Date.now()}.zip`);
      if (format === "zip") {
        if (process.platform === "win32" && extractSync) {
          try {
            await util_1.promisify(stream_1.pipeline)(stream, fs.createWriteStream(stagingFile));
            reporter.report({ stage: progress_1.ProgressReportStage.ExtractingSynchonrously });
            await spawnDecompressorChild("powershell.exe", [
              "-NoProfile",
              "-ExecutionPolicy",
              "Bypass",
              "-NonInteractive",
              "-NoLogo",
              "-Command",
              `Microsoft.PowerShell.Archive\\Expand-Archive -Path "${stagingFile}" -DestinationPath "${extractDir}"`
            ]);
          } finally {
            fs.unlink(stagingFile, () => void 0);
          }
        } else if (process.platform !== "darwin" && !extractSync) {
          await new Promise((resolve2, reject) => stream.on("error", reject).pipe(unzipper_1.Extract({ path: extractDir })).on("close", resolve2).on("error", reject));
        } else {
          try {
            await util_1.promisify(stream_1.pipeline)(stream, fs.createWriteStream(stagingFile));
            reporter.report({ stage: progress_1.ProgressReportStage.ExtractingSynchonrously });
            await spawnDecompressorChild("unzip", ["-q", stagingFile, "-d", extractDir]);
          } finally {
            fs.unlink(stagingFile, () => void 0);
          }
        }
      } else {
        if (!fs.existsSync(extractDir)) {
          fs.mkdirSync(extractDir);
        }
        await spawnDecompressorChild("tar", ["-xzf", "-", "--strip-components=1", "-C", extractDir], stream);
      }
    }
    function spawnDecompressorChild(command, args, input) {
      return new Promise((resolve2, reject) => {
        const child = cp.spawn(command, args, { stdio: "pipe" });
        if (input) {
          input.on("error", reject);
          input.pipe(child.stdin);
        }
        child.stderr.pipe(process.stderr);
        child.stdout.pipe(process.stdout);
        child.on("error", reject);
        child.on("exit", (code) => code === 0 ? resolve2() : reject(new Error(`Failed to unzip archive, exited with ${code}`)));
      });
    }
    exports2.defaultCachePath = path2.resolve(extensionRoot, ".vscode-test");
    async function download(options = {}) {
      let version = options === null || options === void 0 ? void 0 : options.version;
      const { platform = util_2.systemDefaultPlatform, cachePath = exports2.defaultCachePath, reporter = new progress_1.ConsoleReporter(process.stdout.isTTY), extractSync = false, timeout = 15e3 } = options;
      if (version) {
        if (version === "stable") {
          version = await fetchLatestStableVersion(timeout);
        } else {
          if (!fs.existsSync(path2.resolve(cachePath, `vscode-${platform}-${version}`))) {
            if (!await isValidVersion(version, platform, timeout)) {
              throw Error(`Invalid version ${version}`);
            }
          }
        }
      } else {
        version = await fetchLatestStableVersion(timeout);
      }
      reporter.report({ stage: progress_1.ProgressReportStage.ResolvedVersion, version });
      const downloadedPath = path2.resolve(cachePath, `vscode-${platform}-${version}`);
      if (fs.existsSync(downloadedPath)) {
        if (version === "insiders") {
          reporter.report({ stage: progress_1.ProgressReportStage.FetchingInsidersMetadata });
          const { version: currentHash, date: currentDate } = util_2.insidersDownloadDirMetadata(downloadedPath, platform);
          const { version: latestHash, timestamp: latestTimestamp } = await util_2.getLatestInsidersMetadata(util_2.systemDefaultPlatform);
          if (currentHash === latestHash) {
            reporter.report({ stage: progress_1.ProgressReportStage.FoundMatchingInstall, downloadedPath });
            return Promise.resolve(util_2.insidersDownloadDirToExecutablePath(downloadedPath, platform));
          } else {
            try {
              reporter.report({
                stage: progress_1.ProgressReportStage.ReplacingOldInsiders,
                downloadedPath,
                oldDate: currentDate,
                oldHash: currentHash,
                newDate: new Date(latestTimestamp),
                newHash: latestHash
              });
              await del.rmdir(downloadedPath);
            } catch (err) {
              reporter.error(err);
              throw Error(`Failed to remove outdated Insiders at ${downloadedPath}.`);
            }
          }
        } else if (util_2.isStableVersionIdentifier(version)) {
          reporter.report({ stage: progress_1.ProgressReportStage.FoundMatchingInstall, downloadedPath });
          return Promise.resolve(util_2.downloadDirToExecutablePath(downloadedPath, platform));
        } else {
          reporter.report({ stage: progress_1.ProgressReportStage.FoundMatchingInstall, downloadedPath });
          return Promise.resolve(util_2.insidersDownloadDirToExecutablePath(downloadedPath, platform));
        }
      }
      for (let i = 0; ; i++) {
        try {
          const { stream, format } = await downloadVSCodeArchive({ version, platform, cachePath, reporter, timeout });
          await unzipVSCode(reporter, downloadedPath, extractSync, stream, format);
          reporter.report({ stage: progress_1.ProgressReportStage.NewInstallComplete, downloadedPath });
          break;
        } catch (error) {
          if (i++ < DOWNLOAD_ATTEMPTS) {
            reporter.report({ stage: progress_1.ProgressReportStage.Retrying, attempt: i, error, totalAttempts: DOWNLOAD_ATTEMPTS });
          } else {
            reporter.error(error);
            throw Error(`Failed to download and unzip VS Code ${version}`);
          }
        }
      }
      reporter.report({ stage: progress_1.ProgressReportStage.NewInstallComplete, downloadedPath });
      if (util_2.isStableVersionIdentifier(version)) {
        return util_2.downloadDirToExecutablePath(downloadedPath, platform);
      } else {
        return util_2.insidersDownloadDirToExecutablePath(downloadedPath, platform);
      }
    }
    exports2.download = download;
    async function downloadAndUnzipVSCode(versionOrOptions, platform, reporter, extractSync) {
      return await download(typeof versionOrOptions === "object" ? versionOrOptions : { version: versionOrOptions, platform, reporter, extractSync });
    }
    exports2.downloadAndUnzipVSCode = downloadAndUnzipVSCode;
  }
});

// node_modules/@vscode/test-electron/out/index.js
var require_out = __commonJS({
  "node_modules/@vscode/test-electron/out/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveCliArgsFromVSCodeExecutablePath = exports2.resolveCliPathFromVSCodeExecutablePath = exports2.runTests = exports2.downloadAndUnzipVSCode = exports2.download = void 0;
    var download_1 = require_download();
    Object.defineProperty(exports2, "download", { enumerable: true, get: function() {
      return download_1.download;
    } });
    Object.defineProperty(exports2, "downloadAndUnzipVSCode", { enumerable: true, get: function() {
      return download_1.downloadAndUnzipVSCode;
    } });
    var runTest_1 = require_runTest();
    Object.defineProperty(exports2, "runTests", { enumerable: true, get: function() {
      return runTest_1.runTests;
    } });
    var util_1 = require_util3();
    Object.defineProperty(exports2, "resolveCliPathFromVSCodeExecutablePath", { enumerable: true, get: function() {
      return util_1.resolveCliPathFromVSCodeExecutablePath;
    } });
    Object.defineProperty(exports2, "resolveCliArgsFromVSCodeExecutablePath", { enumerable: true, get: function() {
      return util_1.resolveCliArgsFromVSCodeExecutablePath;
    } });
    __exportStar(require_progress(), exports2);
  }
});

// src/test-runner/runTestOnVSCodeHost.ts
var import_test_electron = __toESM(require_out());
var path = __toESM(require("path"));
async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");
    const extensionTestsPath = path.resolve(
      extensionDevelopmentPath,
      "out/test-runner/mochaRunner"
    );
    await (0, import_test_electron.runTests)({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error("Failed to run tests", err);
    process.exit(1);
  }
}
main();
//# sourceMappingURL=runTestOnVSCodeHost.js.map
