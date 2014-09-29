// crude functions for representing time of day as integer
// time is represented as number of minutes after midnight
// unparse: string -> int
// parse: int -> string

exports.unparse = function (time) {
  var hours = Math.floor(time / 60);
  var minutes = Math.floor(time % 60);
  var minuteString = ("0" + minutes.toString()).slice(-2);
  return (hours < 12) ?  hours + ":" + minuteString + "am" : hours-12 + ":" + minuteString + "pm";
}

// will throw exceptions if given bad time
exports.parse = function (timeStr) {
  var parts = timeStr.match(/([1-9]|1[0-2]):([0-5][0-9])(am|pm)/);
  var hours = parseInt(parts[1]) + ((parts[3] === "pm") ? 12 : 0);
  var minutes = parseInt(parts[2]);
  return hours * 60 + minutes;  
}
