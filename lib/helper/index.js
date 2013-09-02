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


var yyyymmdd = exports.yyyymmdd = function yyyymmdd(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};