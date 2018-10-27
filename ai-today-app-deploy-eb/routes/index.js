// 'use strict';

var express = require('express')
var router = express.Router();
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var https = require('https');
var request = require('request');
var fs = require('fs');
var uc = require('upper-case')
var capitalize = require('capitalize')
var lowerCase = require('lower-case')

// Local imports
var results_json = require('../data/results.json');
const API = require('../config/API_key.json')
var newsParser = require('../parseRSS');
var sg = require('../service/sentiment_generator')
var vwc = require('../service/validateWeatherCondition')



//Science Daily
var url = "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml";
var news_intro = "According to an A.I. article published today by Science Daily, "


// WEATHER HISTORY API KEY
var apiKey = API.weather_api_key;

var currentCity;



// WEATHER VARIABLES
var today = new Date();
var years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
var dateString = today.toISOString().slice(4, 10);
var currentTime = today.getHours();
var todaysDate = today.toISOString().slice(0, 10);
var timeFrame, timeFrame_detail;
var daytime, nighttime;


// TIMEFRAME
if (currentTime < 3) {
  timeFrame = 0;
  timeFrame_detail = '12:00 am - 2:59 am'

} else if (currentTime < 6) {
  timeFrame = 1;
  timeFrame_detail = '3:00 am - 5:59 am'

} else if (currentTime < 9) {
  timeFrame = 2;
  timeFrame_detail = '6:00 am - 8:59 am'

} else if (currentTime < 12) {
  timeFrame = 3;
  timeFrame_detail = '9:00 am - 11:59 am'

} else if (currentTime < 15) {
  timeFrame = 4;
  timeFrame_detail = '12:00 pm - 2:59 pm'

} else if (currentTime < 18) {
  timeFrame = 5;
  timeFrame_detail = '3:00 pm - 5:59 pm'

} else if (currentTime < 21) {
  timeFrame = 6;
  timeFrame_detail = '6:00 pm - 8:59 pm'

} else if (currentTime >= 21) {
  timeFrame = 7;
  timeFrame_detail = '9:00 pm - 11:59 pm'
}

// DEFINE DAYTIME OR NIGHTTIME
if (timeFrame < 2 || timeFrame > 6) {
  daytime = true;
  nighttime = false;
} else {
  daytime = false;
  nighttime = true;
}


// Variables
var sentiment1, sentiment2, sentiment3;
// AI NEWS RSS FEED
var AI_News;
var results = [];
var allTemperatures = []; // no need to export
var total = 0; // no need to export
var averageTemp;
var weatherSentiment;
var condition_new;
var currentTemp_new;
var celsius;
var weatherIcon;
var news_isPositive, weather_isPositive;
var searched_location;
var weather, temperture;


console.log('\nCurrent Time is: ' + today.getHours(), '\n');
console.log('Time frame is: ' + timeFrame, ' ( ' + timeFrame_detail + ' ) ' + '\n');


// //////////////////
// MAIN FUNCTION 1 //
/////////////////////
// RSS FEED AND SENTIMENT ANALYSIS
var getSentiment__1 = () => {

  newsParser(url, (err, feedItems) => {
    err 
    ? console.log(err)
    : null
    
    if (!err) {

      AI_News = feedItems[sg.getRandom(0, 30)];

      console.log('Article Total: ', feedItems.length);
      console.log('Article Index: ', feedItems.indexOf(AI_News));

      console.log('\n', AI_News.title, '\n');
      console.log(AI_News.description, '\n');
      console.log('Title Score: ', sentiment.analyze(AI_News.title).score, '\n');
      console.log('Body Score: ', sentiment.analyze(AI_News.description).score, '\n');


      var titleScore = sentiment.analyze(AI_News.title).score;
      var descScore = sentiment.analyze(AI_News.description).score;

      var totalScore = (titleScore + descScore) / 2;
      console.log('Sentiment Analysis Score : ' + totalScore, '\n');

      if (totalScore > 0) {

        sentiment1 = "The future is great! ";
        news_isPositive = true;

      } else if (totalScore == 0) {

        sentiment1 = "It's a mixed bag. ";
        news_isPositive = null;

      } else if (totalScore < 0) {

        sentiment1 = "Outlook not so good. ";
        news_isPositive = false;

      }
      console.log('Sentiment 1: ', sentiment1, '\n');

    }
  });
}
// ACTIVATE RSS FEED AND GET SENTIMENT
// getSentiment__1();





/////////////////////
// MAIN FUNCTION 2 //
/////////////////////

// LOOP THRU PAST YEAR'S TEMPERaTURE AND GET AVERAGE TEMP
var getAverage = function () {

  // SET 'averageTemp' variable to 0 for next results
  averageTemp = 0;
  total = 0;

  var count = 0;

  years.forEach(function (year, index) {

    var currentUrl = 'https://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=' + encodeURIComponent(currentCity) + '&tp=3&format=json&key=' + apiKey + '&date=' + year + dateString;
    
    request(currentUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);

        // console.log(result.data.weather[0]);
        // console.log(result.data.weather[0]);

        // GET AVERAGE TEMPERaTURE OF THE SAME DAY IN A SPAN OF LAST 9 YEARS
        total = total + parseInt(result.data.weather[0].hourly[timeFrame].tempF); //27
        console.log('year count is: ', count);
        
        // averageTemp = total / years.length;
        averageTemp = total / (count + 1);

        // GET AVERAGE TEMPERaTURE -- ANOTHER WAY
        allTemperatures.push(parseInt(result.data.weather[0].hourly[timeFrame].tempF))

        results[index] = result.data.weather[0];

        console.log('Average temp for last 9 years: ' + averageTemp);

        count++;

        if (count == years.length) {
          console.log(`Average: ${averageTemp}`);
          // todaysWeather();
        }

      } else {
        console.log(error, response);
      }
    });
  });
  return averageTemp;
}
// GET AVERAGE TEMPERTURE FOR LAST 9 YEARS
// getAverage();





//////////////////////////
// MAIN FUNCTION 3 /////
////////////////////////

// GET TODAY'S TEMP
var todaysWeather = function () {

  var currentUrl = 'http://api.worldweatheronline.com/premium/v1/weather.ashx?q=' + encodeURIComponent(currentCity) + '&tp=3&format=json&key=' + apiKey + '&date=' + todaysDate;

  request(currentUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);

      currentTemp_new = result.data.weather[0].hourly[timeFrame].tempF;
      condition_new = result.data.weather[0].hourly[timeFrame].weatherDesc[0].value;
      celsius = result.data.weather[0].hourly[timeFrame].tempC;
      searched_location = result.data.request[0].query;

      console.log(`Today: ${todaysDate}`);
      console.log(`Location: ${result.data.request[0].query}`);
      console.log('current temperature: ' + currentTemp_new);
      console.log('Celcius: ', result.data.weather[0].hourly[timeFrame].tempC);

      console.log(`Weather Condition: ${condition_new}`);





      // VALIDATE TODAY'S WEATHER
      if (!vwc.validateWeatherCondition(condition_new)) {
        // if validate comes out negative/false
        weatherSentiment = 'bad';
        console.log('Bad weather!');
        sentiment3 = sg.negativeSentiment3()

      } else if (vwc.validateWeatherCondition(condition_new) && currentTemp_new > 62 && currentTemp_new < 87) {
        // Ideal temperature
        weatherSentiment = 'good';
        sentiment3 = sg.positiveSentiment3()
        console.log('Good weather! because current temperature is between 62 F and 87 F.');

      } else if (vwc.validateWeatherCondition(condition_new) && averageTemp <= 50 && currentTemp_new >= averageTemp + 10) {
        // Winter Time
        weatherSentiment = 'good';
        sentiment3 = sg.positiveSentiment3()
        console.log('Good weather! because current temperature is warmer than usual.');

      } else if (vwc.validateWeatherCondition(condition_new) && averageTemp >= 100 && currentTemp_new <= averageTemp - 10) {
        // Summer Time
        weatherSentiment = 'good';
        sentiment3 = sg.positiveSentiment3()
        console.log('Good weather! because current temperature is cooler than usual.');

      } else if (vwc.validateWeatherCondition(condition_new) && averageTemp <= 62 && currentTemp_new <= averageTemp - 10) {
        // Winter Time
        weatherSentiment = 'bad';
        sentiment3 = sg.negativeSentiment3()
        console.log('Bad weather! because current temperature is colder than usual.');

      } else if (vwc.validateWeatherCondition(condition_new) && averageTemp >= 87 && currentTemp_new >= averageTemp + 10) {
        // Summer Time
        weatherSentiment = 'bad';
        sentiment3 = sg.negativeSentiment3()
        console.log('Bad weather! because current temperature is hotter than usual.');

      } else {
        weatherSentiment = 'so so';
        sentiment3 = 'so so.'
        console.log('Weather is so so');
      }


      // WEATHER ICON GENERATE
      var con = lowerCase(condition_new)

      weatherIcon = con.includes('sun') ? 'wi-day-sunny' 
        : con.includes('rain') && daytime ? 'wi-day-rain'
        : con.includes('rain') && nighttime ? 'wi-night-rain'
        : con.includes('drizz') ? 'wi-rain'
        : con.includes('snow') && daytime ? 'wi-day-snow'
        : con.includes('snow') && nighttime ? 'wi-night-snow'
        : con.includes('cloud') && daytime ? 'wi-day-cloudy'
        : con.includes('cloud') && nighttime ? 'wi-night-cloudy'
        : con.includes('cloud') && con.includes('wind') ? 'wi-cloudy-windy'
        : con.includes('shower') && daytime ? 'wi-day-showers'
        : con.includes('shower') && nighttime ? 'wi-night-showers'
        : con.includes('fog') && daytime ? 'wi-day-fog'
        : con.includes('fog') && nighttime ? 'wi-night-fog'
        : con.includes('thunderstorm') && daytime ? 'wi-day-thunderstorm'
        : con.includes('thunderstorm') && nighttime ? 'wi-night-thunderstorm'
        : con.includes('hail') && daytime ? 'wi-day-hail'
        : con.includes('hail') && nighttime ? 'wi-night-hail'
        : con.includes('lightning') ? 'wi-lightning'
        : con.includes('sprinkle') && daytime ? 'wi-day-sprinkle'
        : con.includes('sprinkle') && nighttime ? 'wi-night-sprinkle'
        : con.includes('eclipse') && daytime ? 'wi-solar-eclipse'
        : con.includes('eclipse') && nighttime ? 'wi-lunar-eclipse'
        : con.includes('star') ? 'wi-stars'
        : con.includes('raindrop') ? 'wi-raindrops'
        : con.includes('sleet') && daytime ? 'wi-day-sleet'
        : con.includes('sleet') && nighttim ? 'wi-night-sleet'
        : con.includes('fire') ? 'wi-fire'
        : con.includes('volcano') ? 'wi-volcano'
        : con.includes('smog') ? 'wi-smog'
        : con.includes('flood') ? 'wi-flood'
        : con.includes('hurricane') ? 'wi-hurricane'
        : con.includes('gust') ? 'wi-cloudy-gusts'
        : con.includes('smoke') ? 'wi-smoke'
        : con.includes('dust') ? 'wi-dust'
        : con.includes('sandstorm') ? 'wi-sandstorm'
        : con.includes('meteor') ? 'wi-meteor'
        : con.includes('tornado') ? 'wi-tornado'
        : con.includes('snowflake') ? 'wi-snowflake-cold'
        : con.includes('quake') ? 'wi-earthquake'
        : con.includes('tsunami') ? 'wi-tsunami'
        : con.includes('advisor') ? 'wi-small-craft-advisory'
        : con.includes('warn') ? 'wi-storm-warning'
        : con.includes('sandstorm') ? 'wi-sandstorm'
        : con.includes('meteor') ? 'wi-meteor'
        : con.includes('humid') ? 'wi-humidity'
        : con.includes('sunrise') ? 'wi-sunrise'
        : con.includes('sunset') ? 'wi-sunset'
        : 'wi-na'  

      


      // GET SENTIMENT 2
      sentiment2 = news_isPositive && weatherSentiment == 'good' 
        ? sg.positiveSentiment2()
        : news_isPositive && weatherSentiment == 'bad' 
        ? sg.goodToBadSentiment2()
        : !news_isPositive && weatherSentiment == 'good' 
        ? sg.badToGoodSentiment2()
        : !news_isPositive && weatherSentiment == 'bad' 
        ? sg.negativeSentiment2()
        : news_isPositive == null && weatherSentiment == 'good' 
        ? sg.positiveSentiment2()
        : news_isPositive == null && weatherSentiment == 'bad' 
        ? sg.negativeSentiment2()
        : news_isPositive == null && weatherSentiment == 'so so' 
        ? sg.neutralSentiment2()
        : news_isPositive && weatherSentiment == 'so so' 
        ? sg.badToGoodSentiment2()
        : !news_isPositive && weatherSentiment == 'so so' 
        ? sg.negativeSentiment2()
        : ''

      console.log('Sentiment 2: ', sentiment2);

    } else {
      console.log(error, response);
    }
  });
}




// HOME : LANDING PAGE
router.get('/', (req, res, next) => {

  res.render('index', 
  {
    app_title: 'AI TODAY',
    welcome: `Welcome to<br/>
    < <span class="aitoday">A.I. Today</span> />`,
  })
})




// CREATE
router.post('/', (req, res, next) => {

  // RESET CURRENT TEMP;
  currentTemp_new = 0;
  weatherIcon = '';

  currentCity = req.body.location;

  getSentiment__1();

  var results = {
    location: currentCity
  };

  var renderer = async () => {

    var _averageTemp = await getAverage();
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    todaysWeather();
    return _averageTemp;

  }

  renderer().then( _averageTemp => {

    console.log('_averageTemp', _averageTemp);


    var checkTimer = setInterval(function () {

      if (currentTemp_new != '0' && weatherIcon != '') {

        
          var weatherPhrase = `
            weather in ${searched_location} will be ${sentiment3} It'll be ${currentTemp_new}\u2109 / ${celsius}\u2103 and ${lowerCase(condition_new)}.
          `

          console.log(weatherPhrase);
          console.log('new temperature received from', currentCity);

          clearInterval(checkTimer);

          var result = {
            location: currentCity
          };

          results_json.unshift(result);

          fs.writeFile('data/results.json', JSON.stringify(results_json), 'utf8', function (err) {
            err 
            ? console.log(err)
            : null
          });

          res.render('index', 
          {
            app_title: 'A.I. Today',
            welcome: `Welcome to<br/>
            <&nbsp;<span class="aitoday">A.I.&nbsp;Today</span>&nbsp;/>`,
            sentiment1: sentiment1,
            news_intro: news_intro,
            AI_News: AI_News,
            sentiment2 : sentiment2,
            weatherPhrase: weatherPhrase,
            message: " name and message has been posted to MongoDB. Here is the POSTed results!",
            results: results,
            results_json: results_json,
            iconCSS: weatherIcon
          })

          return true;


      } else {
        console.log('Waiting for getAverage() to finish...');
      }
    }, 1000);

  })


});





///////////////////////  HELPER FUNCTION ////////////////////////////////////

// models/user.js
// var DB = appRequire('config/db');
// DB.model('User', ...);

// module.exports = function() {
//   var db = new DatabaseConnection();
//   // do something to initialize your database settings
//   return db;
// }();


module.exports = router;