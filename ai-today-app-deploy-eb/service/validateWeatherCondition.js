module.exports = {
  
  validateWeatherCondition : function(cdt){

    var con = cdt.toLowerCase();

    var validation = con.includes(
      'rain', 
      'drizzle', 
      'light', 
      'thunder', 
      'showers', 
      'heavy', 
      'ice', 
      'snow', 
      'Patchy', 
      'extreme', 
      'freezing', 
      'intensity', 
      'shower', 
      'sleet', 
      'mist', 
      'fog', 
      'sand', 
      'dust', 
      'volcanic', 
      'ash', 
      'squalls', 
      'tornado', 
      'whirls', 
      'haze', 
      'smoke', 
      'tropical', 
      'ragged', 
      'storm', 
      'hurricane', 
      'cold', 
      'hot', 
      'windy', 
      'hail', 
      'severe', 
      'violent', 
      'thunderstorm', 
      'smoky', 
      'blustery', 
      'blowing', 
      'flurries',
    )
    ? false
    : true

    return validation;
  },
}
