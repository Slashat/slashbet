var lpad = exports.lpad = function lpad (str, length) {
  while (str.length < length)
      str = "0" + str;
  return str;
}

var ipToHex = exports.ipToHex = function ipToHex (ip) {
  var parts = ip.split('.');
  var hex = '';
  hex = hex + lpad(parseInt(parts[0]).toString(16), 2);
  hex = hex + lpad(parseInt(parts[1]).toString(16), 2);
  hex = hex + lpad(parseInt(parts[2]).toString(16), 2);
  return hex;
}

var getClientAddress = exports.getClientAddress = function getClientAddress(request){
  with(request) {
    return (headers['x-forwarded-for'] || '').split(',')[0] || connection.remoteAddress;
  }
}