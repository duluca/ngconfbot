var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var twitter = require('twitter');

var config = require('./config.js')

var twit = new twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});


var ambient = ambientlib.use(tessel.port['B']);

var loudest = 0.19921875;

var lightsOffCeiling = 0.22

var clappingFloor = 0.17
var rowdyFloor = 0.22 

ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, lightdata) {
      if (err) throw err;
      
      var currentLight = lightdata.toFixed(8)
      
      ambient.getSoundLevel( function(err, sounddata) {
        if (err) throw err;
        
        var currentSound = sounddata.toFixed(8)
        var recordSet = false
        
        if(currentSound > loudest) {
          loudest = currentSound
          recordSet = true
        }
        
        console.log("Light level:", currentLight, " ", "Sound Level:", currentSound, "Loudest:", loudest);
        if(currentLight <= lightsOffCeiling) {
          var status = null
          
          if(currentSound > clappingFloor) {
            //status = "#ngconf crowd is clapping hard #ngconfbot"
          } else if (currentSound > rowdyFloor) {
            //status = "#ngconf crowd is getting rowdy #ngconfbot"
          }
          
          if(recordSet) {
            status = "#ngconf crowd has set a new loudness record. Level: " + loudest.toFixed(4) + " #ngconfbot"
          }
          
          if(status !== null) {
            console.log(status)
            twit.post('statuses/update', {status: status}, function(error, tweet, response){
              if (error) {
                console.log('error sending tweet:', error);
              } else {
                console.log('Successfully tweeted! Tweet text:', tweet.text);
              }
            });
          }
        }
        
      });
    });
  }, 500); // The readings will happen every .5 seconds
});

ambient.on('error', function (err) {
  console.log(err);
});