var __toString = {}.toString;
module.exports = function(flags, args, options){
  var MULTI, name, desc, arg, abbr, FLAG, unknowns, i, literals, flag, value, _res, _ref, _len, _i, _len2, _key;
  args || (args = process.argv.slice(2));
  options || (options = {});
  if (__toString.call(flags).slice(8, -1) !== 'Array') {
    MULTI = /[*+]/;
    _res = [];
    for (name in flags) {
      _ref = [].concat(flags[name]), desc = _ref[0], arg = _ref[1], abbr = _ref[2];
      _res.push({
        name: name,
        desc: desc,
        arg: arg,
        abbr: abbr,
        long: '--' + name,
        short: abbr != 0 && ("-" + (abbr || name)).slice(0, 2),
        multi: !!arg && MULTI.test(arg)
      });
    }
    flags = _res;
  }
  args = Array.prototype.concat.apply([], args.map(function(it){
    if (/^-\w{2,}/.test(it)) {
      return it.slice(1).split('').map(function(it){
        return '-' + it;
      });
    } else {
      return it;
    }
  }));
  FLAG = /^-[-\w]+$/;
  unknowns = [];
  ARGS: for (i = 0, _len = args.length; i < _len; ++i) {
    arg = args[i];
    if (arg === '--') {
      literals = args.slice(i + 1);
      break;
    }
    for (_i = 0, _len2 = flags.length; _i < _len2; ++_i) {
      flag = flags[_i];
      if (arg !== flag.short && arg !== flag.long) {
        continue;
      }
      value = flag.arg ? args[++i] : true;
      if (flag.multi) {
        (options[_key = flag.name] || (options[_key] = [])).push(value);
      } else {
        options[flag.name] = value;
      }
      continue ARGS;
    }
    if (FLAG.test(arg)) {
      unknowns.push(arg);
    } else {
      break;
    }
  }
  return options.$flags = flags, options.$args = args.slice(i), options.$literals = literals || [], options.$unknowns = unknowns, options.toString = help, options;
};
function help(){
  var longs, width, pad;
  longs = this.$flags.map(function(it){
    var that;
    return it.long + ((that = it.arg) ? ' ' + that : '');
  });
  width = Math.max.apply(Math, longs.map(function(it){
    return it.length;
  }));
  pad = __repeatString(' ', width);
  return this.$flags.map(function(flag, i){
    var that, sf, lf;
    sf = (that = flag.short) ? that + ',' : '   ';
    lf = (longs[i] + pad).slice(0, width);
    return "  " + sf + " " + lf + "  " + flag.desc;
  }).join('\n');
}
function __repeatString(str, n){
  for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
  return r;
}