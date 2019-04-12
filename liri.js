//DotEnv
require("dotenv").config();
//Grabs Axios package
var axios = require('axios');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var moment = require("moment");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

// Store the second argument in a variable and convert it to a string
let argOne = String(process.argv[2]);
let argTwo = '';
function createSearch() {
    for (i = 3; i < process.argv.length; i++) {
        argTwo = argTwo + String(process.argv[i]) + ' ';
    }
}
createSearch();

function runSwitch() {
    switch (argOne) {
        case 'spotify-this-song':
            if (argTwo === '') {
                argTwo = 'The Sign';
            }
            spotifyRun(argTwo);
            break;
        case 'movie-this':
            if (argTwo === '') {
                argTwo = 'Mr. Nobody';
            }
            omdbRun(argTwo);
            break;
        case 'concert-this':
            bandsInTown(argTwo);
            break;
        case 'do-what-it-says':
            readRandom();
            break;
    }
}
runSwitch();

//Spotify API

function spotifyRun(argTwo) {
    spotify.search(
        {
            type: 'track',
            query: argTwo,
            limit: 1
        }
    )
        .then(function (response) {
            console.log('-------------------------------');
            //Artist name
            console.log(response.tracks.items[0].name)
            console.log('Artist name: ' + response.tracks.items[0].artists[0].name);
            // Song name
            console.log('Track name: ' + '"' + response.tracks.items[0].name + '"');
            // //preview link
            console.log('Preview this track: ' + response.tracks.items[0].external_urls.spotify);
            // //Album
            console.log('Album name: ' + response.tracks.items[0].album.name);
            console.log('-------------------------------');
            //logging song to log.txt file
            var logSong = "\nSong name: " + response.tracks.items[0].name;

            fs.appendFile('log.txt', logSong, function (err) {
                if (err) throw err;
            })

        })
        .catch(function (err) {
            console.log(err);
        });
}

//OMDB API
// The axios.get function takes in a URL and returns a promise (just like $.ajax)
function omdbRun(argTwo) {
    axios.get("http://www.omdbapi.com/?t=" + argTwo + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            // If the axios was successful...
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            //movie title
            console.log('Movie title: ' + response.data.Title);
            //Year
            console.log('Year: ' + response.data.Year);
            // ImDB rating
            console.log('IMDB rating : ' + response.data.imdbRating);
            // //Rotten Tomatoes Rating
            console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
            //Country
            console.log('Country: ' + response.data.Country);
            // //Language
            console.log('Language: ' + response.data.Language);
            // //Plot
            console.log('Plot: ' + response.data.Plot);
            // //Actors
            console.log('Actors: ' + response.data.Actors);

            var logMovie = "\nMovie Name: " + response.data.Title;

            fs.appendFile("log.txt", logMovie, function (err) {
                if (err) throw err;
            })

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

//BandsInTown API 
function bandsInTown(argTwo) {
    var argTwo = argTwo.trim();

    axios.get("https://rest.bandsintown.com/artists/" + argTwo + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // If the axios was successful...
            //response
            console.log("Venue name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city);
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY"));

            //Append text into log.txt file
            var logConcert = "\nArtist Name: " + argTwo + "\nName of Venue: " + response.data[0].venue.name;

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            })

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function readRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // We will then print the contents of data
        // Then split it by commas (to make it more readable)
        var text = (data.split(","));
        argOne = text[0];
        argTwo = text[1];
        runSwitch();
    });
}







