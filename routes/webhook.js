// dependencies
const API_KEY = 'trilogy';
const request = require('request');

module.exports = function(app) {
app.get('/webhook', function (req, res) {
    res.json({
        "fulfillment": {
            "speech": 'We are happy to see you using Chat Bot Webhook'
            }
    });
});

app.post('/webhook', function(req,res) {
    movieName = "The Matrix";
    url = "http://www.omdbapi.com/?t=" + movieName + "&apikey=" + API_KEY;
    request(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
        var data = {
          "Title:": jsonData.Title,
          "Website:": jsonData.Website,
          "Poster:": jsonData.Poster,
          "Plot:": jsonData.Plot,
        };
        var title = data["Title:"]
        var poster = data["Poster:"]
        var url = data["Website:"]
        var plot = data["Plot:"]

    } else {
        console.log(error);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        "messages": [
            {
              "buttons": [
                {
                  "postback": url,
                  "text": "FOLLOW THE WHITE RABBIT"
                }
              ],
              "imageUrl": poster,
              "title": title,
              "type": 1
            }
          ]
    })); 
    })
})
}

// app.get('/webhook', function(req,res) {
//     movieName = "The Matrix";
//     url = "http://www.omdbapi.com/?t=" + movieName + "&apikey=" + API_KEY;
//     request(url, function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         var jsonData = JSON.parse(body);
//         var data = {
//           "Title:": jsonData.Title,
//           "Year:": jsonData.Year,
//           "IMDB Rating:": jsonData.imdbRating,
//           "Director:": jsonData.Director,
//         };
//     } else {
//         console.log(error);
//     }
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify({
//         "speech" : data["Title:"],
//         "displayText" : "The movie, " + data["Title:"]
//     })); 
//     })
// })




// function getMovie() {
//     movieName = "The Matrix";
//     url = "http://www.omdbapi.com/?t=" + movieName + "&apikey=" + API_KEY;
//     request(url, function (err, res, body) {
//         if (!err && res.statusCode === 200) {
//             var jsonData = JSON.parse(body);
//             var data = {
//                 "Title:": jsonData.Title,
//                 "Year:": jsonData.Year,
//                 "Director:": jsonData.Director,
//             };
//             // return data;
//         }
//         var title = data["Title:"]
//         var year = data["Year:"]
//         var director = data["Director:"]
//         var result = "The movie, " + title +
//             "(" + year + ")" +
//             ", was directed by " +
//             director

//         var responseObj = {
//             "speech": result,
//         };
//         console.log(responseObj)
//     })
// }

// var responseObj;
// app.post('/webhook', function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//     res.setHeader('Content-Type', 'application/json');
//     res.json(responseObj)
// });