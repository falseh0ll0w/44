/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/balanced-match/index.js":
/*!**********************************************!*\
  !*** ./node_modules/balanced-match/index.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

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
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
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
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ "./node_modules/brace-expansion/index.js":
/*!***********************************************!*\
  !*** ./node_modules/brace-expansion/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var concatMap = __webpack_require__(/*! concat-map */ "./node_modules/concat-map/index.js");
var balanced = __webpack_require__(/*! balanced-match */ "./node_modules/balanced-match/index.js");

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
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

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
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
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
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
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
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



/***/ }),

/***/ "./node_modules/concat-map/index.js":
/*!******************************************!*\
  !*** ./node_modules/concat-map/index.js ***!
  \******************************************/
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "./node_modules/fs.realpath/index.js":
/*!*******************************************!*\
  !*** ./node_modules/fs.realpath/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(/*! fs */ "fs")
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(/*! ./old.js */ "./node_modules/fs.realpath/old.js")

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ "./node_modules/fs.realpath/old.js":
/*!*****************************************!*\
  !*** ./node_modules/fs.realpath/old.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(/*! path */ "path");
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(/*! fs */ "fs");

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
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
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ "./node_modules/glob/common.js":
/*!*************************************!*\
  !*** ./node_modules/glob/common.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var fs = __webpack_require__(/*! fs */ "fs")
var path = __webpack_require__(/*! path */ "path")
var minimatch = __webpack_require__(/*! minimatch */ "./node_modules/minimatch/minimatch.js")
var isAbsolute = __webpack_require__(/*! path-is-absolute */ "./node_modules/path-is-absolute/index.js")
var Minimatch = minimatch.Minimatch

function alphasort (a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute
  self.fs = options.fs || fs

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true
  // always treat \ in patterns as escapes, not path separators
  options.allowWindowsEscape = false

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ "./node_modules/glob/glob.js":
/*!***********************************!*\
  !*** ./node_modules/glob/glob.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var rp = __webpack_require__(/*! fs.realpath */ "./node_modules/fs.realpath/index.js")
var minimatch = __webpack_require__(/*! minimatch */ "./node_modules/minimatch/minimatch.js")
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits.js")
var EE = (__webpack_require__(/*! events */ "events").EventEmitter)
var path = __webpack_require__(/*! path */ "path")
var assert = __webpack_require__(/*! assert */ "assert")
var isAbsolute = __webpack_require__(/*! path-is-absolute */ "./node_modules/path-is-absolute/index.js")
var globSync = __webpack_require__(/*! ./sync.js */ "./node_modules/glob/sync.js")
var common = __webpack_require__(/*! ./common.js */ "./node_modules/glob/common.js")
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(/*! inflight */ "./node_modules/inflight/inflight.js")
var util = __webpack_require__(/*! util */ "util")
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(/*! once */ "./node_modules/once/once.js")

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) ||
      isAbsolute(pattern.map(function (p) {
        return typeof p === 'string' ? p : '[*]'
      }).join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    self.fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  self.fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    self.fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return self.fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ "./node_modules/glob/sync.js":
/*!***********************************!*\
  !*** ./node_modules/glob/sync.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var rp = __webpack_require__(/*! fs.realpath */ "./node_modules/fs.realpath/index.js")
var minimatch = __webpack_require__(/*! minimatch */ "./node_modules/minimatch/minimatch.js")
var Minimatch = minimatch.Minimatch
var Glob = (__webpack_require__(/*! ./glob.js */ "./node_modules/glob/glob.js").Glob)
var util = __webpack_require__(/*! util */ "util")
var path = __webpack_require__(/*! path */ "path")
var assert = __webpack_require__(/*! assert */ "assert")
var isAbsolute = __webpack_require__(/*! path-is-absolute */ "./node_modules/path-is-absolute/index.js")
var common = __webpack_require__(/*! ./common.js */ "./node_modules/glob/common.js")
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert.ok(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert.ok(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) ||
      isAbsolute(pattern.map(function (p) {
        return typeof p === 'string' ? p : '[*]'
      }).join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = this.fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, this.fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = this.fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = this.fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ "./node_modules/inflight/inflight.js":
/*!*******************************************!*\
  !*** ./node_modules/inflight/inflight.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(/*! wrappy */ "./node_modules/wrappy/wrappy.js")
var reqs = Object.create(null)
var once = __webpack_require__(/*! once */ "./node_modules/once/once.js")

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ "./node_modules/inherits/inherits.js":
/*!*******************************************!*\
  !*** ./node_modules/inherits/inherits.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

try {
  var util = __webpack_require__(/*! util */ "util");
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(/*! ./inherits_browser.js */ "./node_modules/inherits/inherits_browser.js");
}


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "./node_modules/minimatch/minimatch.js":
/*!*********************************************!*\
  !*** ./node_modules/minimatch/minimatch.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __webpack_require__(/*! path */ "path") } catch (e) {}}()) || {
  sep: '/'
}
minimatch.sep = path.sep

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(/*! brace-expansion */ "./node_modules/brace-expansion/index.js")

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  b = b || {}
  var t = {}
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }
  m.Minimatch.defaults = function defaults (options) {
    return orig.defaults(ext(def, options)).Minimatch
  }

  m.filter = function filter (pattern, options) {
    return orig.filter(pattern, ext(def, options))
  }

  m.defaults = function defaults (options) {
    return orig.defaults(ext(def, options))
  }

  m.makeRe = function makeRe (pattern, options) {
    return orig.makeRe(pattern, ext(def, options))
  }

  m.braceExpand = function braceExpand (pattern, options) {
    return orig.braceExpand(pattern, ext(def, options))
  }

  m.match = function (list, pattern, options) {
    return orig.match(list, pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  assertValidPattern(pattern)

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  assertValidPattern(pattern)

  if (!options) options = {}

  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (!options.allowWindowsEscape && path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false
  this.partial = !!options.partial

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = function debug() { console.error.apply(console, arguments) }

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

var MAX_PATTERN_LENGTH = 1024 * 64
var assertValidPattern = function (pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  assertValidPattern(pattern)

  var options = this.options

  // shortcuts
  if (pattern === '**') {
    if (!options.noglobstar)
      return GLOBSTAR
    else
      pattern = '*'
  }
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      /* istanbul ignore next */
      case '/': {
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false
      }

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        // split where the last [ was, make sure we don't have
        // an invalid re. if so, re-walk the contents of the
        // would-be class to re-translate any characters that
        // were passed through as-is
        // TODO: It would probably be faster to determine this
        // without a try/catch and a new RegExp, but it's tricky
        // to do safely.  For now, this is safe and works.
        var cs = pattern.substring(classStart + 1, i)
        try {
          RegExp('[' + cs + ']')
        } catch (er) {
          // not a valid class!
          var sp = this.parse(cs, SUBPARSE)
          re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
          hasMagic = hasMagic || sp[1]
          inClass = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '[': case '.': case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) /* istanbul ignore next - should be impossible */ {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) /* istanbul ignore next - should be impossible */ {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = function match (f, partial) {
  if (typeof partial === 'undefined') partial = this.partial
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    /* istanbul ignore if */
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      /* istanbul ignore if */
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      hit = f === p
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else /* istanbul ignore else */ if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    return (fi === fl - 1) && (file[fi] === '')
  }

  // should be unreachable.
  /* istanbul ignore next */
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ "./node_modules/once/once.js":
/*!***********************************!*\
  !*** ./node_modules/once/once.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(/*! wrappy */ "./node_modules/wrappy/wrappy.js")
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ "./node_modules/path-is-absolute/index.js":
/*!************************************************!*\
  !*** ./node_modules/path-is-absolute/index.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ "./node_modules/rimraf/rimraf.js":
/*!***************************************!*\
  !*** ./node_modules/rimraf/rimraf.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const assert = __webpack_require__(/*! assert */ "assert")
const path = __webpack_require__(/*! path */ "path")
const fs = __webpack_require__(/*! fs */ "fs")
let glob = undefined
try {
  glob = __webpack_require__(/*! glob */ "./node_modules/glob/glob.js")
} catch (_err) {
  // treat glob as optional.
}

const defaultGlobOpts = {
  nosort: true,
  silent: true
}

// for EMFILE handling
let timeout = 0

const isWindows = (process.platform === "win32")

const defaults = options => {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(m => {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
  options.emfileWait = options.emfileWait || 1000
  if (options.glob === false) {
    options.disableGlob = true
  }
  if (options.disableGlob !== true && glob === undefined) {
    throw Error('glob dependency not found, set `options.disableGlob = true` if intentional')
  }
  options.disableGlob = options.disableGlob || false
  options.glob = options.glob || defaultGlobOpts
}

const rimraf = (p, options, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  let busyTries = 0
  let errState = null
  let n = 0

  const next = (er) => {
    errState = errState || er
    if (--n === 0)
      cb(errState)
  }

  const afterGlob = (er, results) => {
    if (er)
      return cb(er)

    n = results.length
    if (n === 0)
      return cb()

    results.forEach(p => {
      const CB = (er) => {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
              busyTries < options.maxBusyTries) {
            busyTries ++
            // try again, with the same exact callback as this one.
            return setTimeout(() => rimraf_(p, options, CB), busyTries * 100)
          }

          // this one won't happen if graceful-fs is used.
          if (er.code === "EMFILE" && timeout < options.emfileWait) {
            return setTimeout(() => rimraf_(p, options, CB), timeout ++)
          }

          // already gone
          if (er.code === "ENOENT") er = null
        }

        timeout = 0
        next(er)
      }
      rimraf_(p, options, CB)
    })
  }

  if (options.disableGlob || !glob.hasMagic(p))
    return afterGlob(null, [p])

  options.lstat(p, (er, stat) => {
    if (!er)
      return afterGlob(null, [p])

    glob(p, options.glob, afterGlob)
  })

}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
const rimraf_ = (p, options, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === "ENOENT")
      return cb(null)

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === "EPERM" && isWindows)
      fixWinEPERM(p, options, er, cb)

    if (st && st.isDirectory())
      return rmdir(p, options, er, cb)

    options.unlink(p, er => {
      if (er) {
        if (er.code === "ENOENT")
          return cb(null)
        if (er.code === "EPERM")
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        if (er.code === "EISDIR")
          return rmdir(p, options, er, cb)
      }
      return cb(er)
    })
  })
}

const fixWinEPERM = (p, options, er, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.chmod(p, 0o666, er2 => {
    if (er2)
      cb(er2.code === "ENOENT" ? null : er)
    else
      options.stat(p, (er3, stats) => {
        if (er3)
          cb(er3.code === "ENOENT" ? null : er)
        else if (stats.isDirectory())
          rmdir(p, options, er, cb)
        else
          options.unlink(p, cb)
      })
  })
}

const fixWinEPERMSync = (p, options, er) => {
  assert(p)
  assert(options)

  try {
    options.chmodSync(p, 0o666)
  } catch (er2) {
    if (er2.code === "ENOENT")
      return
    else
      throw er
  }

  let stats
  try {
    stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === "ENOENT")
      return
    else
      throw er
  }

  if (stats.isDirectory())
    rmdirSync(p, options, er)
  else
    options.unlinkSync(p)
}

const rmdir = (p, options, originalEr, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
      rmkids(p, options, cb)
    else if (er && er.code === "ENOTDIR")
      cb(originalEr)
    else
      cb(er)
  })
}

const rmkids = (p, options, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, (er, files) => {
    if (er)
      return cb(er)
    let n = files.length
    if (n === 0)
      return options.rmdir(p, cb)
    let errState
    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState)
          return
        if (er)
          return cb(errState = er)
        if (--n === 0)
          options.rmdir(p, cb)
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
const rimrafSync = (p, options) => {
  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  let results

  if (options.disableGlob || !glob.hasMagic(p)) {
    results = [p]
  } else {
    try {
      options.lstatSync(p)
      results = [p]
    } catch (er) {
      results = glob.sync(p, options.glob)
    }
  }

  if (!results.length)
    return

  for (let i = 0; i < results.length; i++) {
    const p = results[i]

    let st
    try {
      st = options.lstatSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return

      // Windows can EPERM on stat.  Life is suffering.
      if (er.code === "EPERM" && isWindows)
        fixWinEPERMSync(p, options, er)
    }

    try {
      // sunos lets the root user unlink directories, which is... weird.
      if (st && st.isDirectory())
        rmdirSync(p, options, null)
      else
        options.unlinkSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return
      if (er.code === "EPERM")
        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
      if (er.code !== "EISDIR")
        throw er

      rmdirSync(p, options, er)
    }
  }
}

const rmdirSync = (p, options, originalEr) => {
  assert(p)
  assert(options)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === "ENOENT")
      return
    if (er.code === "ENOTDIR")
      throw originalEr
    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
      rmkidsSync(p, options)
  }
}

const rmkidsSync = (p, options) => {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))

  // We only end up here once we got ENOTEMPTY at least once, and
  // at this point, we are guaranteed to have removed all the kids.
  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
  // try really hard to delete stuff on windows, because it has a
  // PROFOUNDLY annoying habit of not closing handles promptly when
  // files are deleted, resulting in spurious ENOTEMPTY errors.
  const retries = isWindows ? 100 : 1
  let i = 0
  do {
    let threw = true
    try {
      const ret = options.rmdirSync(p, options)
      threw = false
      return ret
    } finally {
      if (++i < retries && threw)
        continue
    }
  } while (true)
}

module.exports = rimraf
rimraf.sync = rimrafSync


/***/ }),

/***/ "./node_modules/tmp/lib/tmp.js":
/*!*************************************!*\
  !*** ./node_modules/tmp/lib/tmp.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

/*
 * Module dependencies.
 */
const fs = __webpack_require__(/*! fs */ "fs");
const os = __webpack_require__(/*! os */ "os");
const path = __webpack_require__(/*! path */ "path");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const _c = { fs: fs.constants, os: os.constants };
const rimraf = __webpack_require__(/*! rimraf */ "./node_modules/rimraf/rimraf.js");

/*
 * The working inner variables.
 */
const
  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  DEFAULT_TRIES = 3,

  CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR),

  // constants are off on the windows platform and will not match the actual errno codes
  IS_WIN32 = os.platform() === 'win32',
  EBADF = _c.EBADF || _c.os.errno.EBADF,
  ENOENT = _c.ENOENT || _c.os.errno.ENOENT,

  DIR_MODE = 0o700 /* 448 */,
  FILE_MODE = 0o600 /* 384 */,

  EXIT = 'exit',

  // this will hold the objects need to be removed on exit
  _removeObjects = [],

  // API change in fs.rmdirSync leads to error when passing in a second parameter, e.g. the callback
  FN_RMDIR_SYNC = fs.rmdirSync.bind(fs),
  FN_RIMRAF_SYNC = rimraf.sync;

let
  _gracefulCleanup = false;

/**
 * Gets a temporary file name.
 *
 * @param {(Options|tmpNameCallback)} options options or callback
 * @param {?tmpNameCallback} callback the callback function
 */
function tmpName(options, callback) {
  const
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  try {
    _assertAndSanitizeOptions(opts);
  } catch (err) {
    return cb(err);
  }

  let tries = opts.tries;
  (function _getUniqueName() {
    try {
      const name = _generateTmpName(opts);

      // check whether the path exists then retry if needed
      fs.stat(name, function (err) {
        /* istanbul ignore else */
        if (!err) {
          /* istanbul ignore else */
          if (tries-- > 0) return _getUniqueName();

          return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
        }

        cb(null, name);
      });
    } catch (err) {
      cb(err);
    }
  }());
}

/**
 * Synchronous version of tmpName.
 *
 * @param {Object} options
 * @returns {string} the generated random name
 * @throws {Error} if the options are invalid or could not generate a filename
 */
function tmpNameSync(options) {
  const
    args = _parseArguments(options),
    opts = args[0];

  _assertAndSanitizeOptions(opts);

  let tries = opts.tries;
  do {
    const name = _generateTmpName(opts);
    try {
      fs.statSync(name);
    } catch (e) {
      return name;
    }
  } while (tries-- > 0);

  throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
 * Creates and opens a temporary file.
 *
 * @param {(Options|null|undefined|fileCallback)} options the config options or the callback function or null or undefined
 * @param {?fileCallback} callback
 */
function file(options, callback) {
  const
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    /* istanbul ignore else */
    if (err) return cb(err);

    // create and open the file
    fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
      /* istanbu ignore else */
      if (err) return cb(err);

      if (opts.discardDescriptor) {
        return fs.close(fd, function _discardCallback(possibleErr) {
          // the chance of getting an error on close here is rather low and might occur in the most edgiest cases only
          return cb(possibleErr, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts, false));
        });
      } else {
        // detachDescriptor passes the descriptor whereas discardDescriptor closes it, either way, we no longer care
        // about the descriptor
        const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
        cb(null, name, fd, _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, false));
      }
    });
  });
}

/**
 * Synchronous version of file.
 *
 * @param {Options} options
 * @returns {FileSyncObject} object consists of name, fd and removeCallback
 * @throws {Error} if cannot create a file
 */
function fileSync(options) {
  const
    args = _parseArguments(options),
    opts = args[0];

  const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
  const name = tmpNameSync(opts);
  var fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
  /* istanbul ignore else */
  if (opts.discardDescriptor) {
    fs.closeSync(fd);
    fd = undefined;
  }

  return {
    name: name,
    fd: fd,
    removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, true)
  };
}

/**
 * Creates a temporary directory.
 *
 * @param {(Options|dirCallback)} options the options or the callback function
 * @param {?dirCallback} callback
 */
function dir(options, callback) {
  const
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    /* istanbul ignore else */
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
      /* istanbul ignore else */
      if (err) return cb(err);

      cb(null, name, _prepareTmpDirRemoveCallback(name, opts, false));
    });
  });
}

/**
 * Synchronous version of dir.
 *
 * @param {Options} options
 * @returns {DirSyncObject} object consists of name and removeCallback
 * @throws {Error} if it cannot create a directory
 */
function dirSync(options) {
  const
    args = _parseArguments(options),
    opts = args[0];

  const name = tmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || DIR_MODE);

  return {
    name: name,
    removeCallback: _prepareTmpDirRemoveCallback(name, opts, true)
  };
}

/**
 * Removes files asynchronously.
 *
 * @param {Object} fdPath
 * @param {Function} next
 * @private
 */
function _removeFileAsync(fdPath, next) {
  const _handler = function (err) {
    if (err && !_isENOENT(err)) {
      // reraise any unanticipated error
      return next(err);
    }
    next();
  };

  if (0 <= fdPath[0])
    fs.close(fdPath[0], function () {
      fs.unlink(fdPath[1], _handler);
    });
  else fs.unlink(fdPath[1], _handler);
}

/**
 * Removes files synchronously.
 *
 * @param {Object} fdPath
 * @private
 */
function _removeFileSync(fdPath) {
  let rethrownException = null;
  try {
    if (0 <= fdPath[0]) fs.closeSync(fdPath[0]);
  } catch (e) {
    // reraise any unanticipated error
    if (!_isEBADF(e) && !_isENOENT(e)) throw e;
  } finally {
    try {
      fs.unlinkSync(fdPath[1]);
    }
    catch (e) {
      // reraise any unanticipated error
      if (!_isENOENT(e)) rethrownException = e;
    }
  }
  if (rethrownException !== null) {
    throw rethrownException;
  }
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * Returns either a sync callback or a async callback depending on whether
 * fileSync or file was called, which is expressed by the sync parameter.
 *
 * @param {string} name the path of the file
 * @param {number} fd file descriptor
 * @param {Object} opts
 * @param {boolean} sync
 * @returns {fileCallback | fileCallbackSync}
 * @private
 */
function _prepareTmpFileRemoveCallback(name, fd, opts, sync) {
  const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name], sync);
  const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], sync, removeCallbackSync);

  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

  return sync ? removeCallbackSync : removeCallback;
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * Returns either a sync callback or a async callback depending on whether
 * tmpFileSync or tmpFile was called, which is expressed by the sync parameter.
 *
 * @param {string} name
 * @param {Object} opts
 * @param {boolean} sync
 * @returns {Function} the callback
 * @private
 */
function _prepareTmpDirRemoveCallback(name, opts, sync) {
  const removeFunction = opts.unsafeCleanup ? rimraf : fs.rmdir.bind(fs);
  const removeFunctionSync = opts.unsafeCleanup ? FN_RIMRAF_SYNC : FN_RMDIR_SYNC;
  const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name, sync);
  const removeCallback = _prepareRemoveCallback(removeFunction, name, sync, removeCallbackSync);
  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

  return sync ? removeCallbackSync : removeCallback;
}

/**
 * Creates a guarded function wrapping the removeFunction call.
 *
 * The cleanup callback is save to be called multiple times.
 * Subsequent invocations will be ignored.
 *
 * @param {Function} removeFunction
 * @param {string} fileOrDirName
 * @param {boolean} sync
 * @param {cleanupCallbackSync?} cleanupCallbackSync
 * @returns {cleanupCallback | cleanupCallbackSync}
 * @private
 */
function _prepareRemoveCallback(removeFunction, fileOrDirName, sync, cleanupCallbackSync) {
  let called = false;

  // if sync is true, the next parameter will be ignored
  return function _cleanupCallback(next) {

    /* istanbul ignore else */
    if (!called) {
      // remove cleanupCallback from cache
      const toRemove = cleanupCallbackSync || _cleanupCallback;
      const index = _removeObjects.indexOf(toRemove);
      /* istanbul ignore else */
      if (index >= 0) _removeObjects.splice(index, 1);

      called = true;
      if (sync || removeFunction === FN_RMDIR_SYNC || removeFunction === FN_RIMRAF_SYNC) {
        return removeFunction(fileOrDirName);
      } else {
        return removeFunction(fileOrDirName, next || function() {});
      }
    }
  };
}

/**
 * The garbage collector.
 *
 * @private
 */
function _garbageCollector() {
  /* istanbul ignore else */
  if (!_gracefulCleanup) return;

  // the function being called removes itself from _removeObjects,
  // loop until _removeObjects is empty
  while (_removeObjects.length) {
    try {
      _removeObjects[0]();
    } catch (e) {
      // already removed?
    }
  }
}

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {number} howMany
 * @returns {string} the generated random name
 * @private
 */
function _randomChars(howMany) {
  let
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Helper which determines whether a string s is blank, that is undefined, or empty or null.
 *
 * @private
 * @param {string} s
 * @returns {Boolean} true whether the string s is blank, false otherwise
 */
function _isBlank(s) {
  return s === null || _isUndefined(s) || !s.trim();
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @returns {boolean} true if the object is undefined
 * @private
 */
function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

/**
 * Parses the function arguments.
 *
 * This function helps to have optional arguments.
 *
 * @param {(Options|null|undefined|Function)} options
 * @param {?Function} callback
 * @returns {Array} parsed arguments
 * @private
 */
function _parseArguments(options, callback) {
  /* istanbul ignore else */
  if (typeof options === 'function') {
    return [{}, options];
  }

  /* istanbul ignore else */
  if (_isUndefined(options)) {
    return [{}, callback];
  }

  // copy options so we do not leak the changes we make internally
  const actualOptions = {};
  for (const key of Object.getOwnPropertyNames(options)) {
    actualOptions[key] = options[key];
  }

  return [actualOptions, callback];
}

/**
 * Generates a new temporary name.
 *
 * @param {Object} opts
 * @returns {string} the new random name according to opts
 * @private
 */
function _generateTmpName(opts) {

  const tmpDir = opts.tmpdir;

  /* istanbul ignore else */
  if (!_isUndefined(opts.name))
    return path.join(tmpDir, opts.dir, opts.name);

  /* istanbul ignore else */
  if (!_isUndefined(opts.template))
    return path.join(tmpDir, opts.dir, opts.template).replace(TEMPLATE_PATTERN, _randomChars(6));

  // prefix and postfix
  const name = [
    opts.prefix ? opts.prefix : 'tmp',
    '-',
    process.pid,
    '-',
    _randomChars(12),
    opts.postfix ? '-' + opts.postfix : ''
  ].join('');

  return path.join(tmpDir, opts.dir, name);
}

/**
 * Asserts whether the specified options are valid, also sanitizes options and provides sane defaults for missing
 * options.
 *
 * @param {Options} options
 * @private
 */
function _assertAndSanitizeOptions(options) {

  options.tmpdir = _getTmpDir(options);

  const tmpDir = options.tmpdir;

  /* istanbul ignore else */
  if (!_isUndefined(options.name))
    _assertIsRelative(options.name, 'name', tmpDir);
  /* istanbul ignore else */
  if (!_isUndefined(options.dir))
    _assertIsRelative(options.dir, 'dir', tmpDir);
  /* istanbul ignore else */
  if (!_isUndefined(options.template)) {
    _assertIsRelative(options.template, 'template', tmpDir);
    if (!options.template.match(TEMPLATE_PATTERN))
      throw new Error(`Invalid template, found "${options.template}".`);
  }
  /* istanbul ignore else */
  if (!_isUndefined(options.tries) && isNaN(options.tries) || options.tries < 0)
    throw new Error(`Invalid tries, found "${options.tries}".`);

  // if a name was specified we will try once
  options.tries = _isUndefined(options.name) ? options.tries || DEFAULT_TRIES : 1;
  options.keep = !!options.keep;
  options.detachDescriptor = !!options.detachDescriptor;
  options.discardDescriptor = !!options.discardDescriptor;
  options.unsafeCleanup = !!options.unsafeCleanup;

  // sanitize dir, also keep (multiple) blanks if the user, purportedly sane, requests us to
  options.dir = _isUndefined(options.dir) ? '' : path.relative(tmpDir, _resolvePath(options.dir, tmpDir));
  options.template = _isUndefined(options.template) ? undefined : path.relative(tmpDir, _resolvePath(options.template, tmpDir));
  // sanitize further if template is relative to options.dir
  options.template = _isBlank(options.template) ? undefined : path.relative(options.dir, options.template);

  // for completeness' sake only, also keep (multiple) blanks if the user, purportedly sane, requests us to
  options.name = _isUndefined(options.name) ? undefined : _sanitizeName(options.name);
  options.prefix = _isUndefined(options.prefix) ? '' : options.prefix;
  options.postfix = _isUndefined(options.postfix) ? '' : options.postfix;
}

/**
 * Resolve the specified path name in respect to tmpDir.
 *
 * The specified name might include relative path components, e.g. ../
 * so we need to resolve in order to be sure that is is located inside tmpDir
 *
 * @param name
 * @param tmpDir
 * @returns {string}
 * @private
 */
function _resolvePath(name, tmpDir) {
  const sanitizedName = _sanitizeName(name);
  if (sanitizedName.startsWith(tmpDir)) {
    return path.resolve(sanitizedName);
  } else {
    return path.resolve(path.join(tmpDir, sanitizedName));
  }
}

/**
 * Sanitize the specified path name by removing all quote characters.
 *
 * @param name
 * @returns {string}
 * @private
 */
function _sanitizeName(name) {
  if (_isBlank(name)) {
    return name;
  }
  return name.replace(/["']/g, '');
}

/**
 * Asserts whether specified name is relative to the specified tmpDir.
 *
 * @param {string} name
 * @param {string} option
 * @param {string} tmpDir
 * @throws {Error}
 * @private
 */
function _assertIsRelative(name, option, tmpDir) {
  if (option === 'name') {
    // assert that name is not absolute and does not contain a path
    if (path.isAbsolute(name))
      throw new Error(`${option} option must not contain an absolute path, found "${name}".`);
    // must not fail on valid .<name> or ..<name> or similar such constructs
    let basename = path.basename(name);
    if (basename === '..' || basename === '.' || basename !== name)
      throw new Error(`${option} option must not contain a path, found "${name}".`);
  }
  else { // if (option === 'dir' || option === 'template') {
    // assert that dir or template are relative to tmpDir
    if (path.isAbsolute(name) && !name.startsWith(tmpDir)) {
      throw new Error(`${option} option must be relative to "${tmpDir}", found "${name}".`);
    }
    let resolvedPath = _resolvePath(name, tmpDir);
    if (!resolvedPath.startsWith(tmpDir))
      throw new Error(`${option} option must be relative to "${tmpDir}", found "${resolvedPath}".`);
  }
}

/**
 * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
 *
 * @private
 */
function _isEBADF(error) {
  return _isExpectedError(error, -EBADF, 'EBADF');
}

/**
 * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
 *
 * @private
 */
function _isENOENT(error) {
  return _isExpectedError(error, -ENOENT, 'ENOENT');
}

/**
 * Helper to determine whether the expected error code matches the actual code and errno,
 * which will differ between the supported node versions.
 *
 * - Node >= 7.0:
 *   error.code {string}
 *   error.errno {number} any numerical value will be negated
 *
 * CAVEAT
 *
 * On windows, the errno for EBADF is -4083 but os.constants.errno.EBADF is different and we must assume that ENOENT
 * is no different here.
 *
 * @param {SystemError} error
 * @param {number} errno
 * @param {string} code
 * @private
 */
function _isExpectedError(error, errno, code) {
  return IS_WIN32 ? error.code === code : error.code === code && error.errno === errno;
}

/**
 * Sets the graceful cleanup.
 *
 * If graceful cleanup is set, tmp will remove all controlled temporary objects on process exit, otherwise the
 * temporary objects will remain in place, waiting to be cleaned up on system restart or otherwise scheduled temporary
 * object removals.
 */
function setGracefulCleanup() {
  _gracefulCleanup = true;
}

/**
 * Returns the currently configured tmp dir from os.tmpdir().
 *
 * @private
 * @param {?Options} options
 * @returns {string} the currently configured tmp dir
 */
function _getTmpDir(options) {
  return path.resolve(_sanitizeName(options && options.tmpdir || os.tmpdir()));
}

// Install process exit listener
process.addListener(EXIT, _garbageCollector);

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {?boolean} keep the temporary object (file or dir) will not be garbage collected
 * @property {?number} tries the number of tries before give up the name generation
 * @property (?int) mode the access mode, defaults are 0o700 for directories and 0o600 for files
 * @property {?string} template the "mkstemp" like filename template
 * @property {?string} name fixed name relative to tmpdir or the specified dir option
 * @property {?string} dir tmp directory relative to the root tmp directory in use
 * @property {?string} prefix prefix for the generated name
 * @property {?string} postfix postfix for the generated name
 * @property {?string} tmpdir the root tmp directory which overrides the os tmpdir
 * @property {?boolean} unsafeCleanup recursively removes the created temporary directory, even when it's not empty
 * @property {?boolean} detachDescriptor detaches the file descriptor, caller is responsible for closing the file, tmp will no longer try closing the file during garbage collection
 * @property {?boolean} discardDescriptor discards the file descriptor (closes file, fd is -1), tmp will no longer try closing the file during garbage collection
 */

/**
 * @typedef {Object} FileSyncObject
 * @property {string} name the name of the file
 * @property {string} fd the file descriptor or -1 if the fd has been discarded
 * @property {fileCallback} removeCallback the callback function to remove the file
 */

/**
 * @typedef {Object} DirSyncObject
 * @property {string} name the name of the directory
 * @property {fileCallback} removeCallback the callback function to remove the directory
 */

/**
 * @callback tmpNameCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 */

/**
 * @callback fileCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor or -1 if the fd had been discarded
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback fileCallbackSync
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor or -1 if the fd had been discarded
 * @param {cleanupCallbackSync} fn the cleanup callback function
 */

/**
 * @callback dirCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback dirCallbackSync
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallbackSync} fn the cleanup callback function
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallback
 * @param {simpleCallback} [next] function to call whenever the tmp object needs to be removed
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallbackSync
 */

/**
 * Callback function for function composition.
 * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
 *
 * @callback simpleCallback
 */

// exporting all the needed methods

// evaluate _getTmpDir() lazily, mainly for simplifying testing but it also will
// allow users to reconfigure the temporary directory
Object.defineProperty(module.exports, "tmpdir", ({
  enumerable: true,
  configurable: false,
  get: function () {
    return _getTmpDir();
  }
}));

module.exports.dir = dir;
module.exports.dirSync = dirSync;

module.exports.file = file;
module.exports.fileSync = fileSync;

module.exports.tmpName = tmpName;
module.exports.tmpNameSync = tmpNameSync;

module.exports.setGracefulCleanup = setGracefulCleanup;


/***/ }),

/***/ "./src/Commands.ts":
/*!*************************!*\
  !*** ./src/Commands.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Commands = void 0;
const fs = __webpack_require__(/*! fs */ "fs");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const NodeType_1 = __webpack_require__(/*! ./StashNode/NodeType */ "./src/StashNode/NodeType.ts");
const StashCommands_1 = __webpack_require__(/*! ./StashCommands */ "./src/StashCommands.ts");
const StashGit_1 = __webpack_require__(/*! ./Git/StashGit */ "./src/Git/StashGit.ts");
const StashNodeFactory_1 = __webpack_require__(/*! ./StashNode/StashNodeFactory */ "./src/StashNode/StashNodeFactory.ts");
class Commands {
    constructor(workspaceGit, stashCommands, diffDisplayer, stashLabels) {
        /**
         * Creates a stash with the given resources from the scm changes list.
         *
         * @param resourceStates the list of the resources to stash
         */
        this.stashSelected = (...resourceStates) => {
            const paths = resourceStates.map((resourceState) => resourceState.resourceUri.fsPath);
            void vscode.window
                .showInputBox({
                placeHolder: 'Stash message',
                prompt: 'Optionally provide a stash message',
            })
                .then((stashMessage) => {
                if (typeof stashMessage === 'string') {
                    this.stashCommands.push(paths, stashMessage);
                }
            });
        };
        /**
         * Shows a stashed file diff document.
         *
         * @param fileNode the involved node
         */
        this.show = (fileNode) => void this.displayer.showDiff(fileNode);
        /**
         * Shows a diff document comparing the modified stashed file and the current version.
         *
         * @param fileNode the involved node
         */
        this.diffChangesCurrent = (fileNode) => void this.displayer.showDiffCurrent(fileNode, true, false);
        this.diffCurrentChanges = (fileNode) => void this.displayer.showDiffCurrent(fileNode, true, true);
        /**
         * Shows a diff document comparing the stashed file parent and the current version.
         *
         * @param fileNode the involved node
         */
        this.diffSourceCurrent = (fileNode) => void this.displayer.showDiffCurrent(fileNode, false, false);
        this.diffCurrentSource = (fileNode) => void this.displayer.showDiffCurrent(fileNode, false, true);
        /**
         * Opens the file inside an editor.
         *
         * @param repositoryNode the node with the directory to be opened
         */
        this.openFile = (fileNode) => void vscode.commands
            .executeCommand('vscode.open', vscode.Uri.parse(fileNode.path));
        /**
         * Opens the directory pointed by repository node.
         *
         * @param repositoryNode the node with the directory to be opened
         */
        this.openDir = (repositoryNode) => void vscode.env
            .openExternal(vscode.Uri.parse(repositoryNode.path));
        /**
         * Generate a stash on the active repository or selects a repository and continues.
         *
         * @param repositoryNode the involved node
         */
        this.stash = (repositoryNode) => {
            void this.runOnRepository(repositoryNode, (repositoryNode) => this.stashPerform(repositoryNode), 'Create stash');
        };
        /**
         * Clears all the stashes on the active repository or selects a repository and continues.
         *
         * @param repositoryNode the involved node
         */
        this.clear = (repositoryNode) => {
            void this.runOnRepository(repositoryNode, (repositoryNode) => this.clearPerform(repositoryNode), 'Clear stashes');
        };
        /**
         * Pops the selected stash or selects one and continue.
         *
         * @param stashNode the involved node
         */
        this.pop = (stashNode) => {
            this.runOnStash(stashNode, (stashNode) => this.popPerform(stashNode), 'Stash pop');
        };
        /**
         * Applies the selected stash or selects one and continue.
         *
         * @param stashNode the involved node
         */
        this.apply = (stashNode) => {
            this.runOnStash(stashNode, (stashNode) => this.applyPerform(stashNode), 'Stash apply');
        };
        /**
         * Branches the selected stash or selects one and continue.
         *
         * @param stashNode the involved node
         */
        this.branch = (stashNode) => {
            this.runOnStash(stashNode, (stashNode) => this.branchPerform(stashNode), 'Stash branch');
        };
        /**
         * Drops the currently selected stash or selects one and continue.
         *
         * @param stashNode the involved node
         */
        this.drop = (stashNode) => {
            this.runOnStash(stashNode, (stashNode) => this.dropPerform(stashNode), 'Stash drop');
        };
        /**
         * Generates a stash for the given repository.
         *
         * @param repositoryNode the repository node
         */
        this.stashPerform = (repositoryNode) => {
            const repositoryLabel = this.stashLabels.getName(repositoryNode);
            const opts = [
                {
                    label: 'Stash only',
                    description: 'Create a simple stash',
                    type: StashCommands_1.StashCommands.StashType.Simple,
                },
                {
                    label: 'Keep index',
                    description: 'Stash but keep all changes added to the index intact',
                    type: StashCommands_1.StashCommands.StashType.KeepIndex,
                },
                {
                    label: 'Include untracked',
                    description: 'Stash also untracked files',
                    type: StashCommands_1.StashCommands.StashType.IncludeUntracked,
                },
                {
                    label: 'Include untracked + keep index',
                    description: '',
                    type: StashCommands_1.StashCommands.StashType.IncludeUntrackedKeepIndex,
                },
                {
                    label: 'All',
                    description: 'Stash also untracked and ignored files',
                    type: StashCommands_1.StashCommands.StashType.All,
                },
                {
                    label: 'All + keep index',
                    description: '',
                    type: StashCommands_1.StashCommands.StashType.AllKeepIndex,
                },
            ];
            void vscode.window
                .showQuickPick(opts, { placeHolder: `Create stash › ${repositoryLabel} › ...` })
                .then((option) => {
                if (typeof option !== 'undefined') {
                    void vscode.window
                        .showInputBox({
                        placeHolder: `Create stash › ${repositoryLabel} › ${option.label} › ...`,
                        prompt: 'Optionally provide a stash message',
                    })
                        .then((stashMessage) => {
                        if (typeof stashMessage === 'string') {
                            this.stashCommands.stash(repositoryNode, option.type, stashMessage);
                        }
                    });
                }
            });
        };
        /**
         * Removes the stashes on the given repository.
         *
         * @param repositoryNode the involved node
         */
        this.clearPerform = (repositoryNode) => {
            const repositoryLabel = this.stashLabels.getName(repositoryNode);
            vscode.window
                .showWarningMessage(`Clear all stashes on ${repositoryLabel}?`, { modal: true }, { title: 'Proceed' })
                .then((option) => {
                if (typeof option !== 'undefined') {
                    this.stashCommands.clear(repositoryNode);
                }
            }, (e) => console.error('failure', e));
        };
        /**
         * Confirms and pops.
         *
         * @param stashNode the involved node
         */
        this.popPerform = (stashNode) => {
            const stashLabel = this.stashLabels.getName(stashNode);
            const repositoryLabel = this.stashLabels.getName(stashNode.parent);
            void vscode.window.showQuickPick([
                {
                    label: 'Pop only',
                    description: 'Perform a simple pop',
                    withIndex: false,
                },
                {
                    label: 'Pop and reindex',
                    description: 'Pop and reinstate the files added to index',
                    withIndex: true,
                },
            ], { placeHolder: `Stash pop › ${repositoryLabel} › ${stashLabel} › ...` })
                .then((option) => {
                if (typeof option !== 'undefined') {
                    this.stashCommands.pop(stashNode, option.withIndex);
                }
            });
        };
        /**
         * Confirms and applies.
         *
         * @param stashNode the involved node
         */
        this.applyPerform = (stashNode) => {
            const stashLabel = this.stashLabels.getName(stashNode);
            const repositoryLabel = this.stashLabels.getName(stashNode.parent);
            void vscode.window.showQuickPick([
                {
                    label: 'Apply only',
                    description: 'Perform a simple apply',
                    withIndex: false,
                },
                {
                    label: 'Apply and reindex',
                    description: 'Apply and reinstate the files added to index',
                    withIndex: true,
                },
            ], { placeHolder: `Stash apply › ${repositoryLabel} › ${stashLabel} › ...` })
                .then((option) => {
                if (typeof option !== 'undefined') {
                    this.stashCommands.apply(stashNode, option.withIndex);
                }
            });
        };
        /**
         * Branches a stash.
         *
         * @param stashNode the involved node
         */
        this.branchPerform = (stashNode) => {
            const stashLabel = this.stashLabels.getName(stashNode);
            const repositoryLabel = this.stashLabels.getName(stashNode.parent);
            void vscode.window
                .showInputBox({
                placeHolder: `Stash apply › ${repositoryLabel} › ${stashLabel} › ...`,
                prompt: 'Write a name',
            })
                .then((branchName) => {
                if (typeof branchName === 'string') {
                    !branchName.length
                        ? void vscode.window.showErrorMessage('A branch name is required.')
                        : this.stashCommands.branch(stashNode, branchName);
                }
            });
        };
        /**
         * Confirms and drops.
         *
         * @param stashNode the involved node
         */
        this.dropPerform = (stashNode) => {
            const repositoryLabel = this.stashLabels.getName(stashNode.parent);
            const stashLabel = this.stashLabels.getName(stashNode);
            void vscode.window.showWarningMessage(`${repositoryLabel}\n\nDrop ${stashLabel}?`, { modal: true }, { title: 'Proceed' }).then((option) => {
                if (typeof option !== 'undefined') {
                    this.stashCommands.drop(stashNode);
                }
            });
        };
        /**
         * Applies the changes on the stashed file.
         *
         * @param fileNode the involved node
         */
        this.applySingle = (fileNode) => {
            const parentLabel = this.stashLabels.getName(fileNode.parent);
            void vscode.window.showWarningMessage(`${parentLabel}\n\nApply changes on ${fileNode.name}?`, { modal: true }, { title: 'Proceed' })
                .then((option) => {
                if (typeof option !== 'undefined') {
                    this.stashCommands.applySingle(fileNode);
                }
            });
        };
        /**
         * Applies the changes on the stashed file.
         *
         * @param fileNode the involved node
         */
        this.createSingle = (fileNode) => {
            const parentLabel = this.stashLabels.getName(fileNode.parent);
            const exists = fs.existsSync(fileNode.path);
            void vscode.window
                .showWarningMessage(`${parentLabel}\n\nCreate file ${fileNode.name}?${exists ? '\n\nThis will overwrite the current file' : ''}`, { modal: true }, { title: 'Proceed' })
                .then((option) => {
                if (typeof option !== 'undefined') {
                    this.stashCommands.createSingle(fileNode);
                }
            });
        };
        /**
         * Puts the stash node text from a template to clipboard.
         *
         * @param node the involved node
         */
        this.clipboardFromTemplate = (node) => {
            void vscode.env.clipboard.writeText(this.stashLabels.clipboardTemplate(node));
        };
        /**
         * Puts the stash node text on clipboard.
         *
         * @param node the involved node
         */
        this.toClipboardFromObject = (node) => {
            void vscode.env.clipboard.writeText(this.stashLabels.clipboardNode(node));
        };
        /**
         * Executes a callback on a repository.
         *
         * @param repositoryNode    the involved node
         * @param callback          the callback to execute with the node
         * @param pickerPlaceholder a string to prepend in the place holder
         */
        this.runOnRepository = async (repositoryNode, callback, pickerPlaceholder) => {
            if (repositoryNode) {
                return callback(repositoryNode);
            }
            const nodes = (await this.workspaceGit.getRepositories())
                .map((path) => this.stashNodeFactory.createRepositoryNode(path));
            if (nodes.length === 0) {
                void vscode.window.showInformationMessage('There are no git repositories.');
                return undefined;
            }
            if (nodes.length === 1) {
                return callback(nodes[0]);
            }
            const editorPath = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.document.uri.fsPath
                : null;
            const node = editorPath
                ? nodes.sort().reverse().find((node) => editorPath.indexOf(node.path) !== -1)
                : null;
            if (node) {
                return callback(node);
            }
            const selection = await vscode.window.showQuickPick(nodes.map((node) => ({ node, label: this.stashLabels.getName(node) })), { placeHolder: `${pickerPlaceholder} › ...`, canPickMany: false });
            return selection ? callback(selection.node) : undefined;
        };
        /**
         * Executes a callback on a stash.
         *
         * @param repositoryOrStashNode the involved node
         * @param callback              the callback to execute with the node
         * @param placeholder           a string to append to the placeholder as first segment
         * @param canPickMany           indicate if multi-selection will be available
         */
        this.runOnStash = (repositoryOrStashNode, callback, placeholder, canPickMany) => {
            if (Array.isArray(repositoryOrStashNode)) {
                return repositoryOrStashNode.find((stashNode) => stashNode.type !== NodeType_1.default.Stash)
                    ? vscode.window.showErrorMessage('Selection contains invalid items.')
                    : callback(repositoryOrStashNode);
            }
            if (!repositoryOrStashNode || repositoryOrStashNode.type === NodeType_1.default.Repository) {
                return this.runOnRepository(repositoryOrStashNode, (repositoryNode) => this.showStashes(repositoryNode, callback, placeholder, canPickMany || false), placeholder);
            }
            return repositoryOrStashNode.type !== NodeType_1.default.Stash
                ? vscode.window.showErrorMessage(`Invalid item ${repositoryOrStashNode.name}.`)
                : callback(repositoryOrStashNode);
        };
        this.workspaceGit = workspaceGit;
        this.stashCommands = stashCommands;
        this.stashLabels = stashLabels;
        this.displayer = diffDisplayer;
        this.stashGit = new StashGit_1.default();
        this.stashNodeFactory = new StashNodeFactory_1.default();
    }
    /**
     * List the available stashes from a repository and executes a callback on the selected one(s).
     *
     * @param repositoryNode the parent repository
     * @param callback       the callback to execute with the selected stash(es)
     * @param placeholder    a string to append to the placeholder as first segment
     * @param canPickMany    indicate if multi-selection will be available
     */
    async showStashes(repositoryNode, callback, placeholder, canPickMany) {
        const repositoryLabel = this.stashLabels.getName(repositoryNode);
        const list = await this.stashGit.getStashes(repositoryNode.path);
        if (!list.length) {
            return vscode.window.showInformationMessage(`There are no stashed changes on ${repositoryLabel}.`);
        }
        const options = {
            placeHolder: `${placeholder} › ${repositoryLabel} › ...`,
            canPickMany,
        };
        const items = list
            .map((stash) => this.stashNodeFactory.createStashNode(stash, repositoryNode))
            .map((node) => ({
            node,
            label: this.stashLabels.getName(node),
            description: this.stashLabels.getDescription(node),
        }));
        const selection = await vscode.window.showQuickPick(items, options);
        if (selection) {
            const nodeOrNodes = Array.isArray(selection)
                ? selection.map((item) => item.node)
                : selection.node;
            return callback(nodeOrNodes);
        }
    }
}
exports.Commands = Commands;


/***/ }),

/***/ "./src/Config.ts":
/*!***********************!*\
  !*** ./src/Config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
class default_1 {
    constructor() {
        this.reload();
    }
    /**
     * Loads the plugin config.
     */
    reload() {
        this.settings = vscode_1.workspace.getConfiguration('gitstash');
    }
    get(section, defaultValue) {
        return this.settings.get(section, defaultValue);
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/DateFormat.ts":
/*!***************************!*\
  !*** ./src/DateFormat.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class default_1 {
    static toDateTimeIso(date) {
        return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())} ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())} ${this.getOffset(date)}`;
    }
    static toDateIso(date) {
        return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
    }
    static toFullyReadable(date) {
        return `${new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).format(date)} ${this.getOffset(date)}`;
    }
    static toDateTimeSmall(date) {
        return new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        }).format(date);
    }
    static toDateSmall(date) {
        return new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
        }).format(date);
    }
    static ago(date) {
        const units = {
            year: 31536000,
            month: 2630016,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };
        const { value, unit } = ((date) => {
            const secondsElapsed = (Date.now() - date.getTime()) / 1000;
            for (const [unit, secondsInUnit] of Object.entries(units)) {
                if (secondsElapsed >= secondsInUnit || unit === 'second') {
                    return { value: Math.floor(secondsElapsed / secondsInUnit) * -1, unit };
                }
            }
        })(date);
        return (new Intl.RelativeTimeFormat()).format(value, unit);
    }
    static getOffset(date) {
        const offset = date.getTimezoneOffset();
        const hrs = `0${Math.floor(Math.abs(offset) / 60)}`.slice(-2);
        const mins = `0${Math.abs(offset) % 60}`.slice(-2);
        const readableOffset = `${hrs}${mins}`;
        return offset > 0 ? `-${readableOffset}` : readableOffset;
    }
    static pad(n) {
        return n < 10 ? `0${n}` : `${n}`;
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/DiffDisplayer.ts":
/*!******************************!*\
  !*** ./src/DiffDisplayer.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

'use string';
"use strict";
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __webpack_require__(/*! fs */ "fs");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const NodeType_1 = __webpack_require__(/*! ./StashNode/NodeType */ "./src/StashNode/NodeType.ts");
class default_1 {
    constructor(uriGenerator, stashLabels) {
        this.stashLabels = stashLabels;
        this.uriGenerator = uriGenerator;
    }
    /**
     * Shows a stashed file diff document.
     *
     * @param fileNode
     */
    async showDiff(fileNode) {
        if (fileNode.type === NodeType_1.default.Modified || fileNode.type === NodeType_1.default.Renamed) {
            return this.displayDiff(await this.uriGenerator.createForDiff(fileNode, "p" /* FileStage.Parent */), await this.uriGenerator.createForDiff(fileNode, "c" /* FileStage.Change */), fileNode, true);
        }
        if (fileNode.type === NodeType_1.default.Untracked) {
            return this.displayDiff(await this.uriGenerator.createForDiff(), await this.uriGenerator.createForDiff(fileNode), fileNode, true);
        }
        if (fileNode.type === NodeType_1.default.IndexAdded) {
            return this.displayDiff(await this.uriGenerator.createForDiff(), await this.uriGenerator.createForDiff(fileNode), fileNode, true);
        }
        if (fileNode.type === NodeType_1.default.Deleted) {
            return this.displayDiff(await this.uriGenerator.createForDiff(fileNode), await this.uriGenerator.createForDiff(), fileNode, true);
        }
    }
    /**
     * Shows a stashed file diff document.
     *
     * @param fileNode        the node fot the stashed file
     * @param compareChanges  compare changes or the changes' parent
     * @param currentAsParent show current file on the left side
     */
    async showDiffCurrent(fileNode, compareChanges, currentAsParent) {
        const current = fileNode.type === NodeType_1.default.Renamed
            ? `${fileNode.parent.path}/${fileNode.oldName}`
            : fileNode.path;
        if (!fs.existsSync(current)) {
            return vscode.window.showErrorMessage(`File ${current} not found`);
        }
        const currentFileUri = vscode.Uri.file(current);
        const diffDataUri = fileNode.type === NodeType_1.default.Modified || fileNode.type === NodeType_1.default.Renamed
            ? await this.uriGenerator.createForDiff(fileNode, compareChanges ? "c" /* FileStage.Change */ : "p" /* FileStage.Parent */)
            : await this.uriGenerator.createForDiff(fileNode);
        return currentAsParent
            ? this.displayDiff(currentFileUri, diffDataUri, fileNode, false)
            : this.displayDiff(diffDataUri, currentFileUri, fileNode, false);
    }
    /**
     * Shows the diff view with the specified files.
     *
     * @param base     the resource uri of the file prior the modification
     * @param modified the resource uri of the file after the modification
     * @param fileNode the stash node that's being displayed
     * @param hint     the hint reference to know file origin
     */
    displayDiff(base, modified, fileNode, hint) {
        return vscode.commands.executeCommand('vscode.diff', base, modified, this.stashLabels.getDiffTitle(fileNode, hint), {
            preserveFocus: true,
            preview: true,
            viewColumn: vscode.ViewColumn.Active,
        });
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Document/DocumentContentProvider.ts":
/*!*************************************************!*\
  !*** ./src/Document/DocumentContentProvider.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(/*! vscode */ "vscode");
const StashGit_1 = __webpack_require__(/*! ../Git/StashGit */ "./src/Git/StashGit.ts");
const NodeType_1 = __webpack_require__(/*! ../StashNode/NodeType */ "./src/StashNode/NodeType.ts");
const url_1 = __webpack_require__(/*! url */ "url");
class default_1 {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
    }
    async provideTextDocumentContent(uri) {
        const params = new url_1.URLSearchParams(uri.query);
        const cwd = params.get('cwd');
        const index = parseInt(params.get('index'), 10);
        const path = params.get('path');
        const oldPath = params.get('oldPath');
        const type = params.get('type');
        const side = params.get('side');
        const stashGit = new StashGit_1.default();
        let contents;
        try {
            if (type === NodeType_1.default.Deleted) {
                contents = stashGit.getParentContents(cwd, index, path);
            }
            else if (type === NodeType_1.default.IndexAdded) {
                contents = stashGit.getStashContents(cwd, index, path);
            }
            else if (type === NodeType_1.default.Modified) {
                contents = side === "p" /* FileStage.Parent */
                    ? stashGit.getParentContents(cwd, index, path)
                    : stashGit.getStashContents(cwd, index, path);
            }
            else if (type === NodeType_1.default.Renamed) {
                contents = side === "p" /* FileStage.Parent */
                    ? stashGit.getParentContents(cwd, index, oldPath)
                    : stashGit.getStashContents(cwd, index, path);
            }
            else if (type === NodeType_1.default.Untracked) {
                contents = stashGit.getThirdParentContents(cwd, index, path);
            }
        }
        catch (e) {
            console.log(`provideTextDocumentContent type[${type}] side[${side}]`);
            console.log(uri.query);
            console.log(e);
        }
        return (await contents).toString();
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    update(uri) {
        this.onDidChangeEmitter.fire(uri);
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Document/EmptyDocumentContentProvider.ts":
/*!******************************************************!*\
  !*** ./src/Document/EmptyDocumentContentProvider.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(/*! vscode */ "vscode");
class default_1 {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    provideTextDocumentContent() {
        return '';
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Explorer/TreeDataProvider.ts":
/*!******************************************!*\
  !*** ./src/Explorer/TreeDataProvider.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const TreeItemFactory_1 = __webpack_require__(/*! ./TreeItemFactory */ "./src/Explorer/TreeItemFactory.ts");
class default_1 {
    constructor(config, stashNodeRepository, gitBridge, uriGenerator, stashLabels) {
        this.onDidChangeTreeDataEmitter = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;
        this.rawStashes = {};
        /**
         * Toggles the explorer tree.
         */
        this.toggle = () => {
            this.showExplorer = this.showExplorer === undefined
                ? this.config.get('explorer.enabled')
                : !this.showExplorer;
            void vscode_1.commands.executeCommand('setContext', 'gitstash.explorer.enabled', this.showExplorer);
        };
        /**
         * Reloads the explorer tree.
         */
        this.refresh = () => {
            this.reload('force');
        };
        this.config = config;
        this.stashNodeRepository = stashNodeRepository;
        this.gitBridge = gitBridge;
        this.treeItemFactory = new TreeItemFactory_1.default(config, uriGenerator, stashLabels);
    }
    /**
     * Creates a tree view.
     */
    createTreeView() {
        const treeView = vscode_1.window.createTreeView('gitstash.explorer', {
            treeDataProvider: this,
            showCollapseAll: true,
            canSelectMany: false,
        });
        return treeView;
    }
    /**
     * Gets the tree children, which may be repositories, stashes or files.
     *
     * @param node the parent node for the requested children
     */
    getChildren(node) {
        if (node && node.children) {
            return this.prepareChildren(node, node.children);
        }
        const children = !node
            ? this.stashNodeRepository.getRepositories(this.config.get('explorer.eagerLoadStashes'))
            : this.stashNodeRepository.getChildren(node);
        return children.then((children) => {
            node && node.setChildren(children);
            return this.prepareChildren(node, children);
        });
    }
    /**
     * Prepares the children to be displayed, adding default items according user settings.
     *
     * @param parent   the children's parent node
     * @param children the parent's children
     */
    prepareChildren(parent, children) {
        const itemDisplayMode = this.config.get('explorer.itemDisplayMode');
        if (!parent) {
            if (itemDisplayMode === 'hide-empty' && this.config.get('explorer.eagerLoadStashes')) {
                children = children.filter((repositoryNode) => repositoryNode.childrenCount);
            }
        }
        if (children.length) {
            return children;
        }
        if (itemDisplayMode === 'indicate-empty') {
            if (!parent) {
                return [this.stashNodeRepository.getMessageNode('No repositories found.')];
            }
            if (parent.type === 'r') {
                return [this.stashNodeRepository.getMessageNode('No stashes found.')];
            }
        }
        return [];
    }
    /**
     * Generates a tree item for the specified node.
     *
     * @param node the node to be used as base
     */
    getTreeItem(node) {
        return this.treeItemFactory.getTreeItem(node);
    }
    /**
     * Reloads the git stash tree view.
     *
     * @param type        the event type: settings, force, create, update, delete
     * @param projectPath the URI of the project with content changes
     */
    reload(type, projectPath) {
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
        this.loadTimeout = setTimeout((type, pathUri) => {
            if (['settings', 'force'].indexOf(type) !== -1) {
                this.onDidChangeTreeDataEmitter.fire();
            }
            else {
                const path = pathUri.fsPath;
                void this.gitBridge.getRawStashesList(path).then((rawStash) => {
                    const cachedRawStash = this.rawStashes[path];
                    if (!cachedRawStash || cachedRawStash !== rawStash) {
                        this.rawStashes[path] = rawStash;
                        this.onDidChangeTreeDataEmitter.fire();
                    }
                });
            }
        }, type === 'force' ? 250 : 750, type, projectPath);
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Explorer/TreeDecorationProvider.ts":
/*!************************************************!*\
  !*** ./src/Explorer/TreeDecorationProvider.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const NodeType_1 = __webpack_require__(/*! ../StashNode/NodeType */ "./src/StashNode/NodeType.ts");
const uriGenerator_1 = __webpack_require__(/*! ../uriGenerator */ "./src/uriGenerator.ts");
class default_1 {
    constructor(config) {
        this.onDidChangeDecorationEmitter = new vscode_1.EventEmitter();
        this.onDidChangeFileDecorations = this.onDidChangeDecorationEmitter.event;
        this.config = config;
        this.disposable = vscode_1.Disposable.from(vscode_1.window.registerFileDecorationProvider(this));
    }
    dispose() {
        this.disposable.dispose();
    }
    provideFileDecoration(uri) {
        if (this.config.get('explorer.items.file.decoration') === 'none') {
            return undefined;
        }
        if (uri.scheme !== uriGenerator_1.default.fileScheme) {
            return undefined;
        }
        const nodeType = uri.query.split('type=')[1].split('&')[0];
        switch (nodeType) {
            case NodeType_1.default.Untracked:
                return this.getDecorator('U', 'gitDecoration.untrackedResourceForeground');
            case NodeType_1.default.IndexAdded:
                return this.getDecorator('A', 'gitDecoration.addedResourceForeground');
            case NodeType_1.default.Deleted:
                return this.getDecorator('D', 'gitDecoration.deletedResourceForeground');
            case NodeType_1.default.Modified:
                return this.getDecorator('M', 'gitDecoration.modifiedResourceForeground');
            case NodeType_1.default.Renamed:
                return this.getDecorator('R', 'gitDecoration.renamedResourceForeground');
        }
        return undefined;
    }
    /**
     * Create a decorator.
     *
     * @param badge the string with the badge content
     * @param color the string with the theme color key
     */
    getDecorator(badge, color) {
        return {
            badge: this.config.get('explorer.items.file.decoration').indexOf('badge') > -1 ? badge : undefined,
            color: this.config.get('explorer.items.file.decoration').indexOf('color') > -1 ? new vscode_1.ThemeColor(color) : undefined,
            propagate: false,
        };
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Explorer/TreeItemFactory.ts":
/*!*****************************************!*\
  !*** ./src/Explorer/TreeItemFactory.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const NodeType_1 = __webpack_require__(/*! ../StashNode/NodeType */ "./src/StashNode/NodeType.ts");
const path_1 = __webpack_require__(/*! path */ "path");
class default_1 {
    constructor(config, uriGenerator, stashLabels) {
        this.config = config;
        this.uriGenerator = uriGenerator;
        this.stashLabels = stashLabels;
    }
    /**
     * Generates a tree item for the specified node.
     *
     * @param node the node to be used as base
     */
    getTreeItem(node) {
        switch (node.type) {
            case NodeType_1.default.Repository: return this.getRepositoryItem(node);
            case NodeType_1.default.Stash: return this.getStashItem(node);
            case NodeType_1.default.Message: return this.getMessageItem(node);
            default: return this.getFileItem(node);
        }
    }
    /**
     * Generates an repository tree item.
     *
     * @param node the node to be used as base
     */
    getRepositoryItem(node) {
        return {
            id: `${node.type}.${node.path}`,
            label: this.stashLabels.getName(node),
            description: this.stashLabels.getDescription(node),
            tooltip: this.stashLabels.getTooltip(node),
            iconPath: new vscode_1.ThemeIcon('repo'),
            contextValue: 'repository',
            collapsibleState: vscode_1.TreeItemCollapsibleState.Collapsed,
            resourceUri: this.uriGenerator.createForTreeItem(node),
        };
    }
    /**
     * Generates an stash tree item.
     *
     * @param node the node to be used as base
     */
    getStashItem(node) {
        return {
            id: `${node.type}.${node.parent.path}.${node.hash}`,
            label: this.stashLabels.getName(node),
            description: this.stashLabels.getDescription(node),
            tooltip: this.stashLabels.getTooltip(node),
            iconPath: new vscode_1.ThemeIcon('archive'),
            contextValue: 'stash',
            collapsibleState: vscode_1.TreeItemCollapsibleState.Collapsed,
            resourceUri: this.uriGenerator.createForTreeItem(node),
        };
    }
    /**
     * Generates a stashed file tree item.
     *
     * @param node the node to be used as base
     */
    getFileItem(node) {
        let context = 'file';
        switch (node.type) {
            case (NodeType_1.default.Deleted):
                context += ':deleted';
                break;
            case (NodeType_1.default.IndexAdded):
                context += ':indexAdded';
                break;
            case (NodeType_1.default.Modified):
                context += ':modified';
                break;
            case (NodeType_1.default.Renamed):
                context += ':renamed';
                break;
            case (NodeType_1.default.Untracked):
                context += ':untracked';
                break;
        }
        return {
            id: `${node.type}.${node.parent.parent.path}.${node.parent.hash}.${node.name}`,
            label: this.stashLabels.getName(node),
            description: this.stashLabels.getDescription(node),
            tooltip: this.stashLabels.getTooltip(node),
            iconPath: this.getFileIcon(node.type),
            contextValue: context,
            collapsibleState: vscode_1.TreeItemCollapsibleState.None,
            resourceUri: this.uriGenerator.createForTreeItem(node),
            command: {
                title: 'Show stash diff',
                command: 'gitstash.show',
                arguments: [node],
            },
        };
    }
    getMessageItem(node) {
        return {
            id: `${node.type}.${node.name}`,
            label: node.name,
            description: undefined,
            tooltip: undefined,
            iconPath: undefined,
            contextValue: 'message',
            collapsibleState: vscode_1.TreeItemCollapsibleState.None,
        };
    }
    /**
     * Builds a file icon path.
     *
     * @param filename the filename of the icon
     */
    getFileIcon(type) {
        if (this.config.get('explorer.items.file.icons') === 'file') {
            return vscode_1.ThemeIcon.File;
        }
        switch (type) {
            case NodeType_1.default.Deleted: return this.getIcon('status-deleted.svg');
            case NodeType_1.default.IndexAdded: return this.getIcon('status-added.svg');
            case NodeType_1.default.Modified: return this.getIcon('status-modified.svg');
            case NodeType_1.default.Renamed: return this.getIcon('status-renamed.svg');
            case NodeType_1.default.Untracked: return this.getIcon('status-untracked.svg');
            default: return new vscode_1.ThemeIcon('file-text');
        }
    }
    /**
     * Builds an icon path.
     *
     * @param filename the filename of the icon
     */
    getIcon(filename) {
        return {
            light: (0, path_1.join)(__dirname, '..', 'resources', 'icons', 'light', 'files', this.config.get('explorer.items.file.icons'), filename),
            dark: (0, path_1.join)(__dirname, '..', 'resources', 'icons', 'dark', 'files', this.config.get('explorer.items.file.icons'), filename),
        };
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/FileSystemWatcherManager.ts":
/*!*****************************************!*\
  !*** ./src/FileSystemWatcherManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const path_1 = __webpack_require__(/*! path */ "path");
// https://github.com/Microsoft/vscode/issues/3025
class default_1 {
    /**
     * Creates a new watcher.
     *
     * @param repositories the open repositories when starting the extension
     * @param callback     the callback to run when identifying changes
     */
    constructor(repositories, callback) {
        this.watchers = new Map();
        this.callback = callback;
        void repositories.then((directories) => {
            directories.forEach((directory) => this.registerProjectWatcher(directory));
        });
    }
    /**
     * Adds or removes listeners according the workspace directory changes.
     *
     * @param directoryChanges the workspace directory changes description
     */
    configure(directoryChanges) {
        directoryChanges.added.forEach((changedDirectory) => {
            const directory = changedDirectory.uri.fsPath;
            this.registerProjectWatcher(directory);
        });
        directoryChanges.removed.forEach((changedDirectory) => {
            const directory = changedDirectory.uri.fsPath;
            this.removeProjectWatcher(directory);
        });
    }
    /**
     * Disposes this object.
     */
    dispose() {
        for (const path of this.watchers.keys()) {
            this.removeProjectWatcher(path);
        }
    }
    /**
     * Registers a new project directory watcher.
     *
     * @param projectPath the directory path
     */
    registerProjectWatcher(projectPath) {
        if (this.watchers.has(projectPath)) {
            return;
        }
        const pathToMonitor = (0, path_1.join)(projectPath, '.git', 'refs');
        if (!(0, fs_1.existsSync)(pathToMonitor)) {
            return;
        }
        try {
            const watcher = (0, fs_1.watch)(pathToMonitor, (event, filename) => {
                if (filename.indexOf('stash') > -1) {
                    if (filename && filename.indexOf('stash') > -1) {
                        this.callback(vscode_1.Uri.file(projectPath));
                    }
                }
            });
            this.watchers.set(projectPath, watcher);
        }
        catch (error) {
            void vscode_1.window.showErrorMessage(`Unable to a create a stashes monitor for
            ${projectPath}. This may happen on NFS or if the path is a link`);
        }
    }
    /**
     * Removes an active project directory watcher.
     *
     * @param path the directory path
     */
    removeProjectWatcher(path) {
        if (this.watchers.has(path)) {
            this.watchers.get(path).close();
            this.watchers.delete(path);
        }
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Git/Git.ts":
/*!************************!*\
  !*** ./src/Git/Git.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
class Git {
    /**
     * Executes a git command.
     *
     * @param args the string array with the argument list
     * @param cwd  the string with the current working directory
     */
    async call(args, cwd) {
        const response = [];
        const errors = [];
        const cmd = (0, child_process_1.spawn)('git', args, { cwd });
        cmd.stderr.setEncoding('utf8');
        return new Promise((resolve, reject) => {
            cmd.stdout.on('data', (chunk) => response.push(chunk));
            cmd.stdout.on('error', (err) => errors.push(err.message));
            cmd.stderr.on('data', (chunk) => errors.push(chunk));
            cmd.stderr.on('error', (err) => errors.push(err.message));
            cmd.on('close', (code) => {
                const bufferResponse = response.length
                    ? Buffer.concat(response)
                    : Buffer.from(new ArrayBuffer(0));
                if (code === 0) {
                    errors.length === 0
                        ? resolve(bufferResponse)
                        : resolve(`${errors.join(' ')}\n${bufferResponse.toString('utf8')}`.trim());
                }
                else {
                    reject(`${errors.join(' ')}\n${bufferResponse.toString('utf8')}`.trim());
                }
            });
        });
    }
    /**
     * Executes a git command.
     *
     * @param args     the string array with the argument list
     * @param cwd      the string with the current working directory
     * @param encoding the BufferEncoding string with the optional encoding to replace utf8
     */
    async exec(args, cwd, encoding) {
        return this
            .call(args, cwd)
            .then((data) => data instanceof Buffer ? data.toString(encoding || 'utf8') : data);
    }
}
exports["default"] = Git;


/***/ }),

/***/ "./src/Git/StashGit.ts":
/*!*****************************!*\
  !*** ./src/Git/StashGit.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Git_1 = __webpack_require__(/*! ./Git */ "./src/Git/Git.ts");
class StashGit extends Git_1.default {
    /**
     * Gets the raw git stash command data.
     *
     * @param cwd the current working directory
     */
    async getRawStash(cwd) {
        const params = [
            'stash',
            'list',
        ];
        return (await this.exec(params, cwd)).trim() || null;
    }
    /**
     * Gets the stashes list.
     *
     * @param cwd the current working directory
     */
    async getStashes(cwd) {
        const params = [
            'stash',
            'list',
            '--format="%ci %h %s"',
        ];
        const stashList = (await this.exec(params, cwd)).trim();
        const sep1 = 26; // date length
        const sep2 = 34; // date length + (1) space + (7) hash length
        const list = !stashList.length ? [] : stashList
            .split(/\r?\n/g)
            .map((stash, index) => ({
            index,
            date: stash.substring(1, sep1),
            hash: stash.substring(sep1 + 1, sep2),
            description: stash.substring(sep2 + 1).slice(0, -1).trim(),
        }));
        return list;
    }
    /**
     * Gets the stash files.
     *
     * @param cwd   the current working directory
     * @param index the int with the stash index
     */
    async getStashedFiles(cwd, index) {
        const files = {
            untracked: await this.getStashUntracked(cwd, index),
            indexAdded: [],
            modified: [],
            deleted: [],
            renamed: [],
        };
        const params = [
            'stash',
            'show',
            '--name-status',
            `stash@{${index}}`,
        ];
        try {
            const stashData = (await this.exec(params, cwd)).trim();
            if (stashData.length > 0) {
                const stashedFiles = stashData.split(/\r?\n/g);
                stashedFiles.forEach((line) => {
                    const status = line.substring(0, 1);
                    const file = line.substring(1).trim();
                    if (status === 'A') {
                        files.indexAdded.push(file);
                    }
                    else if (status === 'D') {
                        files.deleted.push(file);
                    }
                    else if (status === 'M') {
                        files.modified.push(file);
                    }
                    else if (status === 'R') {
                        const fileNames = /^\d+\s+([^\t]+)\t(.+)$/.exec(file);
                        files.renamed.push({
                            new: fileNames[2],
                            old: fileNames[1],
                        });
                    }
                });
            }
        }
        catch (e) {
            console.log('StashGit.getStashedFiles');
            console.log(e);
        }
        return files;
    }
    /**
     * Gets the stash untracked files.
     *
     * @param cwd   the current working directory
     * @param index the int with the stash index
     */
    async getStashUntracked(cwd, index) {
        const params = [
            'ls-tree',
            '-r',
            '--name-only',
            `stash@{${index}}^3`,
        ];
        const list = [];
        try {
            const stashData = (await this.exec(params, cwd)).trim();
            if (stashData.length > 0) {
                const stashedFiles = stashData.split(/\r?\n/g);
                stashedFiles.forEach((file) => {
                    list.push(file);
                });
            }
        }
        catch (e) { /* we may get an error if there aren't untracked files */ }
        return list;
    }
    /**
     * Gets the file contents from the stash commit.
     *
     * This gets the changed contents for:
     *  - index-added
     *  - modified
     *  - renamed
     *
     * @param cwd   the current working directory
     * @param index the int with the index of the parent stash
     * @param file  the string with the stashed file name
     */
    async getStashContents(cwd, index, file) {
        const params = [
            'show',
            `stash@{${index}}:${file}`,
        ];
        return await this.call(params, cwd);
    }
    /**
     * Gets the file contents from the parent stash commit.
     *
     * This gets the original contents for:
     *  - deleted
     *  - modified
     *  - renamed
     *
     * @param cwd   the current working directory
     * @param index the int with the index of the parent stash
     * @param file  the string with the stashed file name
     */
    async getParentContents(cwd, index, file) {
        const params = [
            'show',
            `stash@{${index}}^1:${file}`,
        ];
        return await this.call(params, cwd);
    }
    /**
     * Gets the file contents from the third (untracked) stash commit.
     *
     * @param cwd   the current working directory
     * @param index the int with the index of the parent stash
     * @param file  the string with the stashed file name
     */
    async getThirdParentContents(cwd, index, file) {
        const params = [
            'show',
            `stash@{${index}}^3:${file}`,
        ];
        return await this.call(params, cwd);
    }
}
exports["default"] = StashGit;


/***/ }),

/***/ "./src/Git/WorkspaceGit.ts":
/*!*********************************!*\
  !*** ./src/Git/WorkspaceGit.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Git_1 = __webpack_require__(/*! ./Git */ "./src/Git/Git.ts");
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const Workspace_1 = __webpack_require__(/*! ../Workspace */ "./src/Workspace.ts");
class WorkspaceGit extends Git_1.default {
    constructor(config) {
        super();
        this.config = config;
    }
    /**
     * Indicates if there's at least one repository available.
     */
    async hasGitRepository() {
        const repository = await this.getRepositories(true);
        return repository && repository.length > 0;
    }
    /**
     * Gets the directories for git repositories on the workspace.
     *
     * @param firstOnly indicates if return only the first repository
     */
    async getRepositories(firstOnly) {
        const depth = this.config.get('advanced.repositorySearchDepth');
        const params = [
            'rev-parse',
            '--show-toplevel',
        ];
        const paths = [];
        for (const cwd of Workspace_1.default.getRootPaths(depth)) {
            try {
                let gitPath = (await this.exec(params, cwd)).trim();
                if (gitPath.length < 1) {
                    continue;
                }
                gitPath = vscode_1.Uri.file(gitPath).fsPath;
                if (paths.indexOf(gitPath) === -1) {
                    paths.push(gitPath);
                    if (firstOnly) {
                        break;
                    }
                }
            }
            catch (e) {
                continue;
            }
        }
        paths.sort();
        return paths;
    }
}
exports["default"] = WorkspaceGit;


/***/ }),

/***/ "./src/GitBridge.ts":
/*!**************************!*\
  !*** ./src/GitBridge.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const StashGit_1 = __webpack_require__(/*! ./Git/StashGit */ "./src/Git/StashGit.ts");
const NodeType_1 = __webpack_require__(/*! ./StashNode/NodeType */ "./src/StashNode/NodeType.ts");
class GitBridge {
    constructor() {
        this.stashGit = new StashGit_1.default();
    }
    /**
     * Gets the raw git stashes list.
     */
    async getRawStashesList(cwd) {
        return this.stashGit.getRawStash(cwd);
    }
    /**
     * Gets the file contents of the untracked file.
     *
     * @param fileNode the stashed node file
     * @param stage    the file stash stage
     */
    getFileContents(fileNode, stage) {
        switch (fileNode.type) {
            case NodeType_1.default.Deleted:
                return this.stashGit.getParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.IndexAdded:
                return this.stashGit.getStashContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.Modified:
                return stage === "p" /* FileStage.Parent */
                    ? this.stashGit.getParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.name)
                    : this.stashGit.getStashContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.Renamed:
                return stage === "p" /* FileStage.Parent */
                    ? this.stashGit.getParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.oldName)
                    : this.stashGit.getStashContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
            case NodeType_1.default.Untracked:
                return this.stashGit.getThirdParentContents(fileNode.parent.path, fileNode.parent.index, fileNode.name);
        }
    }
}
exports["default"] = GitBridge;


/***/ }),

/***/ "./src/StashCommands.ts":
/*!******************************!*\
  !*** ./src/StashCommands.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

'use string';
"use strict";
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StashCommands = void 0;
const vscode = __webpack_require__(/*! vscode */ "vscode");
const StashGit_1 = __webpack_require__(/*! ./Git/StashGit */ "./src/Git/StashGit.ts");
var StashType;
(function (StashType) {
    StashType[StashType["Simple"] = 0] = "Simple";
    StashType[StashType["KeepIndex"] = 1] = "KeepIndex";
    StashType[StashType["IncludeUntracked"] = 2] = "IncludeUntracked";
    StashType[StashType["IncludeUntrackedKeepIndex"] = 3] = "IncludeUntrackedKeepIndex";
    StashType[StashType["All"] = 4] = "All";
    StashType[StashType["AllKeepIndex"] = 5] = "AllKeepIndex";
})(StashType || (StashType = {}));
class StashCommands {
    constructor(config, workspaceGit, channel, stashLabels) {
        /**
         * Generates a stash.
         */
        this.stash = (repositoryNode, type, message) => {
            const params = ['stash', 'save'];
            switch (type) {
                case StashType.KeepIndex:
                    params.push('--keep-index');
                    break;
                case StashType.IncludeUntracked:
                    params.push('--include-untracked');
                    break;
                case StashType.IncludeUntrackedKeepIndex:
                    params.push('--include-untracked');
                    params.push('--keep-index');
                    break;
                case StashType.All:
                    params.push('--all');
                    break;
                case StashType.AllKeepIndex:
                    params.push('--all');
                    params.push('--keep-index');
                    break;
            }
            if (message.length > 0) {
                params.push(message);
            }
            this.exec(repositoryNode.path, params, 'Stash created', repositoryNode);
        };
        /**
         * Creates stashes for the given files across multiple repositories.
         *
         * @param filePaths    an array with the list of the file paths to stash
         * @param stashMessage an optional message to set on the stash
         */
        this.push = (filePaths, stashMessage) => {
            const params = ['stash', 'push'];
            if (stashMessage) {
                params.push('-m', stashMessage);
            }
            void this.workspaceGit.getRepositories().then((repositoryPaths) => {
                const repositories = {};
                repositoryPaths
                    .sort()
                    .reverse()
                    .forEach((repoPath) => {
                    for (let i = 0; i < filePaths.length; i += 1) {
                        const filePath = filePaths[i];
                        if (filePath && filePath.indexOf(repoPath) === 0) {
                            repositories[repoPath] = [filePath].concat(repositories[repoPath] || []);
                            filePaths[i] = null;
                        }
                    }
                });
                Object.keys(repositories).forEach((repoPath) => {
                    this.exec(repoPath, params.concat(repositories[repoPath]), 'Selected files stashed');
                });
            });
        };
        /**
         * Removes the stashes list.
         */
        this.clear = (repositoryNode) => {
            const params = ['stash', 'clear'];
            this.exec(repositoryNode.path, params, 'Stash list cleared', repositoryNode);
        };
        /**
         * Pops a stash.
         */
        this.pop = (stashNode, withIndex) => {
            const params = ['stash', 'pop'];
            if (withIndex) {
                params.push('--index');
            }
            params.push(`stash@{${stashNode.index}}`);
            this.exec(stashNode.path, params, 'Stash popped', stashNode);
        };
        /**
         * Applies a stash.
         */
        this.apply = (stashNode, withIndex) => {
            const params = ['stash', 'apply'];
            if (withIndex) {
                params.push('--index');
            }
            params.push(`stash@{${stashNode.index}}`);
            this.exec(stashNode.path, params, 'Stash applied', stashNode);
        };
        /**
         * Branches a stash.
         */
        this.branch = (stashNode, name) => {
            const params = [
                'stash',
                'branch',
                name,
                `stash@{${stashNode.index}}`,
            ];
            this.exec(stashNode.path, params, 'Stash branched', stashNode);
        };
        /**
         * Drops a stash.
         */
        this.drop = (stashNode) => {
            const params = [
                'stash',
                'drop',
                `stash@{${stashNode.index}}`,
            ];
            this.exec(stashNode.path, params, 'Stash dropped', stashNode);
        };
        /**
         * Applies changes from a file.
         */
        this.applySingle = (fileNode) => {
            const params = [
                'checkout',
                `stash@{${fileNode.parent.index}}`,
                fileNode.name,
            ];
            this.exec(fileNode.parent.path, params, 'Changes from file applied', fileNode);
        };
        /**
         * Applies changes from a file.
         */
        this.createSingle = (fileNode) => {
            const params = [
                'checkout',
                `stash@{${fileNode.parent.index}}^3`,
                fileNode.name,
            ];
            this.exec(fileNode.parent.path, params, 'File created', fileNode);
        };
        this.config = config;
        this.workspaceGit = workspaceGit;
        this.channel = channel;
        this.stashLabels = stashLabels;
        this.stashGit = new StashGit_1.default();
    }
    /**
     * Executes the git command.
     *
     * @param cwd            the current working directory
     * @param params         the array of command parameters
     * @param successMessage the string message to show on success
     * @param node           the involved node
     */
    exec(cwd, params, successMessage, node) {
        this.stashGit.exec(params, cwd)
            .then((result) => {
            const issueType = this.findResultIssues(result);
            if (issueType === 'conflict') {
                this.logResult(params, 'warning', result, `${successMessage} with conflicts`, node);
            }
            else if (issueType === 'empty') {
                this.logResult(params, 'message', result, 'No local changes to save', node);
            }
            else {
                this.logResult(params, 'message', result, successMessage, node);
            }
        }, (error) => {
            const excerpt = error.substring(error.indexOf(':') + 1).trim();
            this.logResult(params, 'error', error, excerpt, node);
        })
            .catch((error) => {
            this.logResult(params, 'error', error.toString());
        });
    }
    /**
     * Parses the result searching for possible issues / errors.
     *
     * @param result the operation result
     */
    findResultIssues(result) {
        for (const line of result.split('\n')) {
            if (line.startsWith('CONFLICT (content): ')) {
                return 'conflict';
            }
            if (line.startsWith('No local changes to save')) {
                return 'empty';
            }
        }
        return null;
    }
    /**
     * Logs the command to the extension channel.
     *
     * @param params           the git command params
     * @param type             the message type
     * @param result           the result content
     * @param notificationText the optional notification message
     */
    logResult(params, type, result, notificationText, node) {
        this.prepareLogChannel();
        this.performLogging(params, result, node);
        this.showNotification(notificationText || result, type);
    }
    /**
     * Prepares the log channel to before using it.
     */
    prepareLogChannel() {
        if (this.config.settings.get('log.autoclear')) {
            this.channel.clear();
        }
        const currentTime = new Date();
        this.channel.appendLine(`> ${currentTime.toLocaleString()}`);
    }
    /**
     * Logs the command to the extension channel.
     *
     * @param params      the git command params
     * @param type        the string message type
     * @param result      the string result message
     * @param description the optional string alert description
     */
    performLogging(params, result, node) {
        if (node) {
            const cwd = node.isFile ? node.parent.path : node.path;
            this.channel.appendLine(cwd
                ? `  ${cwd} - ${this.stashLabels.getName(node)}`
                : `  ${this.stashLabels.getName(node)}`);
        }
        this.channel.appendLine(`  git ${params.join(' ')}`);
        this.channel.appendLine(`${result.trim()}\n`);
    }
    /**
     * Shows a notification with the given summary message.
     *
     * @param information the text to be displayed
     * @param type        the the message type
     */
    showNotification(information, type) {
        const summary = information.substr(0, 300);
        const actions = [{ title: 'Show log' }];
        const callback = (value) => {
            if (typeof value !== 'undefined') {
                this.channel.show(true);
            }
        };
        if (type === 'warning') {
            void vscode.window.showWarningMessage(summary, ...actions).then(callback);
        }
        else if (type === 'error') {
            void vscode.window.showErrorMessage(summary, ...actions).then(callback);
        }
        else {
            void vscode.window.showInformationMessage(summary, ...actions).then(callback);
        }
    }
}
StashCommands.StashType = StashType;
exports.StashCommands = StashCommands;


/***/ }),

/***/ "./src/StashLabels.ts":
/*!****************************!*\
  !*** ./src/StashLabels.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __webpack_require__(/*! path */ "path");
const DateFormat_1 = __webpack_require__(/*! ./DateFormat */ "./src/DateFormat.ts");
const NodeType_1 = __webpack_require__(/*! ./StashNode/NodeType */ "./src/StashNode/NodeType.ts");
class default_1 {
    constructor(config) {
        this.config = config;
    }
    /**
     * Generates a node label.
     *
     * @param node The node to be used as base
     */
    getName(node) {
        return this.getContent(node, 'label');
    }
    /**
     * Generates a node description.
     *
     * @param node The node to be used as base
     */
    getDescription(node) {
        return this.getContent(node, 'description');
    }
    /**
     * Generates a node tooltip.
     *
     * @param node The node to be used as base
     */
    getTooltip(node) {
        return this.getContent(node, 'tooltip');
    }
    /**
     * Generates clipboard text for the stash node.
     *
     * @param stashNode The node to be used as base
     */
    clipboardTemplate(node) {
        return this.getContent(node, 'to-clipboard');
    }
    /**
     * Generates clipboard text for the stash node.
     *
     * @param stashNode The node to be used as base
     */
    clipboardNode(node) {
        switch (node.type) {
            case NodeType_1.default.Repository:
                return node.path;
            case NodeType_1.default.Stash:
                return node.name;
            case NodeType_1.default.Deleted:
            case NodeType_1.default.IndexAdded:
            case NodeType_1.default.Modified:
            case NodeType_1.default.Untracked:
            case NodeType_1.default.Renamed:
                return node.path;
        }
    }
    /**
     * Generates a node label.
     *
     * @param node The node to be used as base
     * @param property The string with the property prefix for setting keys
     */
    getContent(node, property) {
        switch (node.type) {
            case NodeType_1.default.Repository:
                return this.parseRepositoryLabel(node, this.config.get(`explorer.items.repository.${property}Content`));
            case NodeType_1.default.Stash:
                return this.parseStashLabel(node, this.config.get(`explorer.items.stash.${property}Content`));
            case NodeType_1.default.Deleted:
            case NodeType_1.default.IndexAdded:
            case NodeType_1.default.Modified:
            case NodeType_1.default.Untracked:
                return this.parseFileLabel(node, this.config.get(`explorer.items.file.${property}Content`));
            case NodeType_1.default.Renamed:
                return this.parseFileLabel(node, this.config.get(`explorer.items.renamedFile.${property}Content`));
        }
    }
    /**
     * Generates a repository label.
     *
     * @param repositoryNode The node to be used as base
     */
    parseRepositoryLabel(repositoryNode, template) {
        return template
            .replace('${path}', `${path.dirname(repositoryNode.path)}/`)
            .replace('${directory}', path.basename(repositoryNode.path))
            .replace('${name}', repositoryNode.name)
            .replace('${stashesCount}', this.getChildrenCount(repositoryNode));
    }
    /**
     * Generates a stash item label.
     *
     * @param stashNode The node to be used as base
     */
    parseStashLabel(stashNode, template) {
        return template
            .replace('${index}', stashNode.index.toString())
            .replace('${branch}', this.getStashBranch(stashNode))
            .replace('${description}', this.getStashDescription(stashNode))
            .replace('${dateTimeLong}', DateFormat_1.default.toFullyReadable(new Date(Date.parse(stashNode.date))))
            .replace('${dateTimeSmall}', DateFormat_1.default.toDateTimeSmall(new Date(Date.parse(stashNode.date))))
            .replace('${dateSmall}', DateFormat_1.default.toDateSmall(new Date(Date.parse(stashNode.date))))
            .replace('${dateTimeIso}', DateFormat_1.default.toDateTimeIso(new Date(Date.parse(stashNode.date))))
            .replace('${dateIso}', DateFormat_1.default.toDateIso(new Date(Date.parse(stashNode.date))))
            .replace('${ago}', DateFormat_1.default.ago(new Date(Date.parse(stashNode.date))));
    }
    /**
     * Generates a stashed file label.
     *
     * @param fileNode The node to be used as base
     */
    parseFileLabel(fileNode, template) {
        return template
            .replace('${filename}', path.basename(fileNode.name))
            .replace('${oldFilename}', fileNode.oldName ? path.basename(fileNode.oldName) : '')
            .replace('${filepath}', `${path.dirname(fileNode.name)}/`)
            .replace('${type}', this.getTypeLabel(fileNode));
    }
    /**
     * Generates the diff document title name.
     *
     * @param fileNode the file node to be shown
     * @param hint     the hint reference to know file origin
     */
    getDiffTitle(fileNode, hint) {
        return this.config.settings
            .get('editor.diffTitleFormat', '')
            .replace('${filename}', path.basename(fileNode.name))
            .replace('${filepath}', `${path.dirname(fileNode.name)}/`)
            .replace('${dateTimeLong}', DateFormat_1.default.toFullyReadable(new Date(Date.parse(fileNode.date))))
            .replace('${dateTimeSmall}', DateFormat_1.default.toDateTimeSmall(new Date(Date.parse(fileNode.date))))
            .replace('${dateSmall}', DateFormat_1.default.toDateSmall(new Date(Date.parse(fileNode.date))))
            .replace('${dateTimeIso}', DateFormat_1.default.toDateTimeIso(new Date(Date.parse(fileNode.date))))
            .replace('${dateIso}', DateFormat_1.default.toDateIso(new Date(Date.parse(fileNode.date))))
            .replace('${ago}', DateFormat_1.default.ago(new Date(Date.parse(fileNode.date))))
            .replace('${stashIndex}', `${fileNode.parent.index}`)
            .replace('${description}', this.getStashDescription(fileNode.parent))
            .replace('${branch}', this.getStashBranch(fileNode.parent))
            .replace('${type}', this.getTypeLabel(fileNode))
            .replace('${hint}', this.getHint(fileNode, hint));
    }
    /**
     * Gets the stash description.
     *
     * @param stashNode the source node
     */
    getStashDescription(stashNode) {
        return stashNode.name.substring(stashNode.name.indexOf(':') + 2);
    }
    /**
     * Gets the stash branch.
     *
     * @param stashNode the source node
     */
    getStashBranch(stashNode) {
        return stashNode.name.indexOf('WIP on ') === 0
            ? stashNode.name.substring(7, stashNode.name.indexOf(':'))
            : stashNode.name.substring(3, stashNode.name.indexOf(':'));
    }
    /**
     * Gets the node children count.
     *
     * @param stashNode the source node
     */
    getChildrenCount(repositoryNode) {
        const count = repositoryNode.childrenCount;
        return !isNaN(count) ? count.toString() : '-';
    }
    /**
     * Gets a label for the file node type.
     *
     * @param fileNode the source node
     */
    getTypeLabel(fileNode) {
        switch (fileNode.type) {
            case NodeType_1.default.Deleted: return 'Deleted';
            case NodeType_1.default.IndexAdded: return 'Added';
            case NodeType_1.default.Modified: return 'Modified';
            case NodeType_1.default.Renamed: return 'Renamed';
            case NodeType_1.default.Untracked: return 'Untracked';
            default: return 'Other';
        }
    }
    /**
     * Generates a hint for the file node title.
     *
     * @param fileNode the source node
     */
    getHint(fileNode, fromStash) {
        const type = this.getTypeLabel(fileNode).toLowerCase();
        const reference = fromStash ? 'original' : 'current';
        const values = fromStash
            ? { l: reference, r: type }
            : { l: type, r: reference };
        return `${values.l} ⟷ ${values.r}`;
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/StashNode/NodeType.ts":
/*!***********************************!*\
  !*** ./src/StashNode/NodeType.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var NodeType;
(function (NodeType) {
    NodeType["Repository"] = "r";
    NodeType["Stash"] = "s";
    NodeType["Deleted"] = "d";
    NodeType["IndexAdded"] = "a";
    NodeType["Modified"] = "m";
    NodeType["Renamed"] = "n";
    NodeType["Untracked"] = "u";
    NodeType["Message"] = "i";
})(NodeType || (NodeType = {}));
exports["default"] = NodeType;


/***/ }),

/***/ "./src/StashNode/StashNode.ts":
/*!************************************!*\
  !*** ./src/StashNode/StashNode.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const NodeType_1 = __webpack_require__(/*! ./NodeType */ "./src/StashNode/NodeType.ts");
class StashNode {
    constructor(source) {
        this.source = source;
        this.childrenCache = null;
    }
    /**
     * Gets the node type.
     */
    get type() {
        return this.source.type;
    }
    /**
     * Gets the node name.
     */
    get name() {
        return this.source.name;
    }
    /**
     * Gets the node old name.
     */
    get oldName() {
        return this.source.oldName;
    }
    /**
     * Gets the node index.
     */
    get index() {
        return this.source.index;
    }
    /**
     * Gets the node parent index.
     */
    get parent() {
        return this.source.parent;
    }
    /**
     * Gets the node generation date.
     */
    get date() {
        return this.source.date;
    }
    /**
     * Gets the node commit hash.
     */
    get hash() {
        return this.source.hash;
    }
    /**
     * Gets the loaded children.
     */
    get children() {
        return this.childrenCache;
    }
    /**
     * Indicates if the node represents a stashed file or not.
     */
    get isFile() {
        return [
            NodeType_1.default.Deleted,
            NodeType_1.default.IndexAdded,
            NodeType_1.default.Modified,
            NodeType_1.default.Untracked,
        ].indexOf(this.type) > -1;
    }
    /**
     * Gets the file path of the stashed file.
     */
    get path() {
        if (this.type === NodeType_1.default.Repository) {
            return this.source.path;
        }
        if (this.type === NodeType_1.default.Stash) {
            return this.source.parent.path;
        }
        if (this.isFile) {
            return `${this.source.path}/${this.name}`;
        }
        return null;
    }
    /**
     * Gets the children count if available.
     */
    get childrenCount() {
        return this.childrenCache !== null
            ? this.childrenCache.length
            : undefined;
    }
    /**
     * Sets the node children.
     */
    setChildren(children) {
        this.childrenCache = children;
        return this;
    }
}
exports["default"] = StashNode;


/***/ }),

/***/ "./src/StashNode/StashNodeFactory.ts":
/*!*******************************************!*\
  !*** ./src/StashNode/StashNodeFactory.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const NodeType_1 = __webpack_require__(/*! ./NodeType */ "./src/StashNode/NodeType.ts");
const StashNode_1 = __webpack_require__(/*! ./StashNode */ "./src/StashNode/StashNode.ts");
const path_1 = __webpack_require__(/*! path */ "path");
class default_1 {
    /**
     * Generates a repository node.
     *
     * @param path the repository path
     */
    createRepositoryNode(path) {
        // may be undefined if the directory is not part of the workspace
        // this happens on upper directories by negative search depth setting
        const workspaceFolder = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.file(path));
        return new StashNode_1.default({
            type: NodeType_1.default.Repository,
            name: workspaceFolder ? workspaceFolder.name : (0, path_1.basename)(path),
            index: undefined,
            parent: undefined,
            date: undefined,
            path: path,
        });
    }
    /**
     * Generates a stash node.
     *
     * @param stash the stash to use as base
     */
    createStashNode(stash, parentNode) {
        return new StashNode_1.default({
            type: NodeType_1.default.Stash,
            name: stash.description,
            index: stash.index,
            parent: parentNode,
            date: stash.date,
            hash: stash.hash,
        });
    }
    /**
     * Generates a file node.
     *
     * @param path       the file path
     * @param file       the file name or the new and old name on renamed file
     * @param parentNode the parent node
     * @param type       the stash type
     */
    createFileNode(path, file, parentNode, type) {
        return new StashNode_1.default({
            type: type,
            name: type === NodeType_1.default.Renamed ? file.new : file,
            oldName: type === NodeType_1.default.Renamed ? file.old : undefined,
            path: path,
            index: undefined,
            parent: parentNode,
            date: parentNode.date,
        });
    }
    /**
     * Generates a message node.
     *
     * @param message    the message to display
     * @param parentNode the parent node
     */
    createMessageNode(message, parentNode) {
        return new StashNode_1.default({
            type: NodeType_1.default.Message,
            name: message,
            oldName: undefined,
            index: undefined,
            parent: parentNode,
            date: parentNode ? parentNode.date : undefined,
        });
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/StashNode/StashNodeRepository.ts":
/*!**********************************************!*\
  !*** ./src/StashNode/StashNodeRepository.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const StashGit_1 = __webpack_require__(/*! ../Git/StashGit */ "./src/Git/StashGit.ts");
const NodeType_1 = __webpack_require__(/*! ./NodeType */ "./src/StashNode/NodeType.ts");
const StashNodeFactory_1 = __webpack_require__(/*! ./StashNodeFactory */ "./src/StashNode/StashNodeFactory.ts");
class default_1 {
    constructor(workspaceGit) {
        this.workspaceGit = workspaceGit;
        this.stashGit = new StashGit_1.default();
        this.stashNodeFactory = new StashNodeFactory_1.default();
    }
    /**
     * Gets the repositories list.
     *
     * @param eagerLoadStashes indicates if children should be preloaded
     */
    async getRepositories(eagerLoadStashes) {
        return this.workspaceGit.getRepositories().then(async (rawList) => {
            const repositoryNodes = [];
            for (const repositoryPath of rawList) {
                const repositoryNode = this.stashNodeFactory.createRepositoryNode(repositoryPath);
                repositoryNodes.push(repositoryNode);
                if (eagerLoadStashes) {
                    repositoryNode.setChildren(await this.getChildren(repositoryNode));
                }
            }
            return repositoryNodes;
        });
    }
    /**
     * Gets the node's children.
     */
    async getChildren(node) {
        if (node.type === NodeType_1.default.Repository) {
            return this.getStashes(node);
        }
        if (node.type === NodeType_1.default.Stash) {
            return this.getFiles(node);
        }
        return Promise.resolve([]);
    }
    /**
     * Gets the stashes list.
     */
    async getStashes(repositoryNode) {
        return (await this.stashGit.getStashes(repositoryNode.path))
            .map((stash) => this.stashNodeFactory.createStashNode(stash, repositoryNode));
    }
    /**
     * Gets the stash files.
     *
     * @param stashNode the parent stash
     */
    async getFiles(stashNode) {
        return this.stashGit.getStashedFiles(stashNode.path, stashNode.index).then((stashedFiles) => {
            const fileNodes = [];
            const path = stashNode.path;
            stashedFiles.indexAdded.forEach((stashFile) => {
                fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.IndexAdded));
            });
            stashedFiles.modified.forEach((stashFile) => {
                fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Modified));
            });
            stashedFiles.renamed.forEach((stashFile) => {
                fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Renamed));
            });
            stashedFiles.untracked.forEach((stashFile) => {
                fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Untracked));
            });
            stashedFiles.deleted.forEach((stashFile) => {
                fileNodes.push(this.stashNodeFactory.createFileNode(path, stashFile, stashNode, NodeType_1.default.Deleted));
            });
            return fileNodes;
        });
    }
    /**
     * Creates a message node.
     */
    getMessageNode(message) {
        return this.stashNodeFactory.createMessageNode(message);
    }
}
exports["default"] = default_1;


/***/ }),

/***/ "./src/Workspace.ts":
/*!**************************!*\
  !*** ./src/Workspace.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
class Workspace {
    /**
     * Gets a list of directories starting from the workspace paths.
     *
     * @param searchLevels the number of sub- or upper- levels to search for directories.
     */
    static getRootPaths(searchLevels) {
        const workspacePaths = this.getWorkspacePaths();
        if (searchLevels < 0) {
            return Workspace.getUpperRootPaths(workspacePaths, searchLevels);
        }
        if (searchLevels > 0) {
            return Workspace.getSubRootPaths(workspacePaths, searchLevels);
        }
        return workspacePaths;
    }
    /**
     * Gets a list of parent directories paths starting from the workspace paths.
     *
     * @param workspacePaths the base workspace paths.
     * @param searchLevels   the number of upper-levels to search for parent directories.
     */
    static getUpperRootPaths(workspacePaths, searchLevels) {
        const roots = [];
        workspacePaths.forEach((workspacePath) => {
            const dirsList = [workspacePath];
            for (let i = searchLevels; i < 0; i += 1) {
                const parentPath = path.dirname(workspacePath);
                if (parentPath === workspacePath) {
                    break;
                }
                dirsList.unshift(parentPath);
                workspacePath = parentPath;
            }
            dirsList.forEach((workspacePath) => {
                if (roots.indexOf(workspacePath) === -1) {
                    roots.push(workspacePath);
                }
            });
        });
        return roots;
    }
    /**
     * Gets a list of subdirectories paths starting from the workspace paths.
     *
     * @param workspacePaths the base workspace paths.
     * @param searchLevels   the number of sub-levels to search for subdirectories.
     */
    static getSubRootPaths(workspacePaths, searchLevels) {
        const roots = [];
        workspacePaths.forEach((workspacePath) => {
            const subDirectories = Workspace.getSubdirectoriesTree(workspacePath, searchLevels, [workspacePath]);
            roots.push(...subDirectories);
        });
        return roots;
    }
    /**
     * Gets the workspace directory paths.
     */
    static getWorkspacePaths() {
        const folders = vscode_1.workspace.workspaceFolders || [];
        const paths = [];
        folders.forEach((folder) => {
            if (fs.existsSync(folder.uri.fsPath)) {
                paths.push(folder.uri.fsPath);
            }
        });
        return paths;
    }
    /**
     * Gets the flattened subdirectories tree till the given subdirectory level.
     *
     * @param rootPath the root path to use to get the subdirectories tree list
     * @param levels   the number of levels to use for searching subdirectories
     * @param list     the directories list accumulator
     */
    static getSubdirectoriesTree(rootPath, levels, list) {
        list = list || [];
        levels -= 1;
        if (levels >= 0) {
            fs.readdirSync(rootPath).forEach((subPath) => {
                if (subPath !== '.git') {
                    const subDirectoryPath = path.join(rootPath, subPath);
                    if (fs.statSync(subDirectoryPath).isDirectory()) {
                        list.push(subDirectoryPath);
                        Workspace.getSubdirectoriesTree(subDirectoryPath, levels, list);
                    }
                }
            });
        }
        return list;
    }
}
exports["default"] = Workspace;


/***/ }),

/***/ "./src/uriGenerator.ts":
/*!*****************************!*\
  !*** ./src/uriGenerator.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const tmp = __webpack_require__(/*! tmp */ "./node_modules/tmp/lib/tmp.js");
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
class UriGenerator {
    constructor(gitBridge) {
        this.supportedBinaryFiles = [
            '.bmp',
            '.gif',
            '.jpe',
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
        ];
        this.gitBridge = gitBridge;
        tmp.setGracefulCleanup();
    }
    /**
     * Creates a node Uri to be used on Tree items.
     *
     * @param node  the node to be used as base for the URI
     */
    createForTreeItem(node) {
        return vscode_1.Uri.parse(`${UriGenerator.fileScheme}:${node.path}?type=${node.type}&t=${new Date().getTime()}`);
    }
    /**
     * Creates a node Uri to be used on the diff view.
     *
     * @param node  the node to be used as base for the URI
     * @param stage the file stash stage
     */
    async createForDiff(node, stage) {
        if (!node) {
            return vscode_1.Uri.parse(`${UriGenerator.emptyFileScheme}:`);
        }
        if (this.supportedBinaryFiles.indexOf(path.extname(node.name)) > -1) {
            return vscode_1.Uri.file(this.createTmpFile(await this.gitBridge.getFileContents(node, stage), node.name).name);
        }
        return this.generateUri(node, stage);
    }
    /**
     * Generates an Uri representing the stash file.
     *
     * @param node the node to be used as base for the URI
     * @param side the editor side
     */
    generateUri(node, side) {
        const timestamp = new Date().getTime();
        const query = `cwd=${node.parent.path}`
            + `&index=${node.parent.index}`
            + `&path=${node.name}`
            + `&oldPath=${node.oldName || ''}`
            + `&type=${node.type}`
            + `&side=${side || ''}`
            + `&t=${timestamp}`;
        return vscode_1.Uri.parse(`${UriGenerator.fileScheme}:${node.path}?${query}`);
    }
    /**
     * Generates a tmp file with the given content.
     *
     * @param content  the buffer with the content
     * @param filename the string with the filename
     */
    createTmpFile(content, filename) {
        const file = tmp.fileSync({
            prefix: 'vscode-gitstash-',
            postfix: path.extname(filename),
        });
        fs.writeFileSync(file.name, content);
        return file;
    }
}
UriGenerator.emptyFileScheme = 'gitdiff-no-contents';
UriGenerator.fileScheme = 'gitdiff-stashed-contents';
exports["default"] = UriGenerator;


/***/ }),

/***/ "./node_modules/wrappy/wrappy.js":
/*!***************************************!*\
  !*** ./node_modules/wrappy/wrappy.js ***!
  \***************************************/
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const Commands_1 = __webpack_require__(/*! ./Commands */ "./src/Commands.ts");
const Config_1 = __webpack_require__(/*! ./Config */ "./src/Config.ts");
const DiffDisplayer_1 = __webpack_require__(/*! ./DiffDisplayer */ "./src/DiffDisplayer.ts");
const DocumentContentProvider_1 = __webpack_require__(/*! ./Document/DocumentContentProvider */ "./src/Document/DocumentContentProvider.ts");
const EmptyDocumentContentProvider_1 = __webpack_require__(/*! ./Document/EmptyDocumentContentProvider */ "./src/Document/EmptyDocumentContentProvider.ts");
const FileSystemWatcherManager_1 = __webpack_require__(/*! ./FileSystemWatcherManager */ "./src/FileSystemWatcherManager.ts");
const GitBridge_1 = __webpack_require__(/*! ./GitBridge */ "./src/GitBridge.ts");
const StashCommands_1 = __webpack_require__(/*! ./StashCommands */ "./src/StashCommands.ts");
const StashLabels_1 = __webpack_require__(/*! ./StashLabels */ "./src/StashLabels.ts");
const StashNodeRepository_1 = __webpack_require__(/*! ./StashNode/StashNodeRepository */ "./src/StashNode/StashNodeRepository.ts");
const TreeDataProvider_1 = __webpack_require__(/*! ./Explorer/TreeDataProvider */ "./src/Explorer/TreeDataProvider.ts");
const TreeDecorationProvider_1 = __webpack_require__(/*! ./Explorer/TreeDecorationProvider */ "./src/Explorer/TreeDecorationProvider.ts");
const uriGenerator_1 = __webpack_require__(/*! ./uriGenerator */ "./src/uriGenerator.ts");
const WorkspaceGit_1 = __webpack_require__(/*! ./Git/WorkspaceGit */ "./src/Git/WorkspaceGit.ts");
function activate(context) {
    const channelName = 'GitStash';
    const config = new Config_1.default();
    const gitBridge = new GitBridge_1.default();
    const nodeRepository = new StashNodeRepository_1.default(new WorkspaceGit_1.default(config));
    const stashLabels = new StashLabels_1.default(config);
    const uriGenerator = new uriGenerator_1.default(gitBridge);
    const treeProvider = new TreeDataProvider_1.default(config, nodeRepository, gitBridge, uriGenerator, stashLabels);
    const wsGit = new WorkspaceGit_1.default(config);
    const stashCommands = new Commands_1.Commands(wsGit, new StashCommands_1.StashCommands(config, wsGit, vscode_1.window.createOutputChannel(channelName), stashLabels), new DiffDisplayer_1.default(uriGenerator, stashLabels), stashLabels);
    const workspaceGit = new WorkspaceGit_1.default(config);
    notifyHasRepository(workspaceGit);
    const watcherManager = new FileSystemWatcherManager_1.default(workspaceGit.getRepositories(), (projectDirectory) => treeProvider.reload('update', projectDirectory));
    context.subscriptions.push(new TreeDecorationProvider_1.default(config), treeProvider.createTreeView(), vscode_1.workspace.registerTextDocumentContentProvider(uriGenerator_1.default.fileScheme, new DocumentContentProvider_1.default()), vscode_1.workspace.registerTextDocumentContentProvider(uriGenerator_1.default.emptyFileScheme, new EmptyDocumentContentProvider_1.default()), vscode_1.commands.registerCommand('gitstash.explorer.toggle', treeProvider.toggle), vscode_1.commands.registerCommand('gitstash.explorer.refresh', treeProvider.refresh), vscode_1.commands.registerCommand('gitstash.stash', stashCommands.stash), vscode_1.commands.registerCommand('gitstash.clear', stashCommands.clear), vscode_1.commands.registerCommand('gitstash.openDir', stashCommands.openDir), vscode_1.commands.registerCommand('gitstash.show', stashCommands.show), vscode_1.commands.registerCommand('gitstash.diffChangesCurrent', stashCommands.diffChangesCurrent), vscode_1.commands.registerCommand('gitstash.diffCurrentChanges', stashCommands.diffCurrentChanges), vscode_1.commands.registerCommand('gitstash.diffSourceCurrent', stashCommands.diffSourceCurrent), vscode_1.commands.registerCommand('gitstash.diffCurrentSource', stashCommands.diffCurrentSource), vscode_1.commands.registerCommand('gitstash.pop', stashCommands.pop), vscode_1.commands.registerCommand('gitstash.apply', stashCommands.apply), vscode_1.commands.registerCommand('gitstash.branch', stashCommands.branch), vscode_1.commands.registerCommand('gitstash.drop', stashCommands.drop), vscode_1.commands.registerCommand('gitstash.applySingle', stashCommands.applySingle), vscode_1.commands.registerCommand('gitstash.createSingle', stashCommands.createSingle), vscode_1.commands.registerCommand('gitstash.openCurrent', stashCommands.openFile), vscode_1.commands.registerCommand('gitstash.stashSelected', stashCommands.stashSelected), vscode_1.commands.registerCommand('gitstash.clipboardRepositoryPath', stashCommands.toClipboardFromObject), vscode_1.commands.registerCommand('gitstash.clipboardStashMessage', stashCommands.toClipboardFromObject), vscode_1.commands.registerCommand('gitstash.clipboardFilePath', stashCommands.toClipboardFromObject), vscode_1.commands.registerCommand('gitstash.clipboardInfo', stashCommands.clipboardFromTemplate), vscode_1.workspace.onDidChangeWorkspaceFolders((e) => {
        notifyHasRepository(workspaceGit);
        watcherManager.configure(e);
        treeProvider.reload('settings');
    }), vscode_1.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('gitstash')) {
            config.reload();
            treeProvider.reload('settings');
        }
    }), watcherManager);
    treeProvider.toggle();
}
exports.activate = activate;
/**
 * Checks if there is at least one git repository open and notifies it to vsc.
 */
function notifyHasRepository(workspaceGit) {
    void workspaceGit
        .hasGitRepository()
        .then((has) => vscode_1.commands.executeCommand('setContext', 'hasGitRepository', has));
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map