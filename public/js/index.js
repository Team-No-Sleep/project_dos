// Get references to page elements
var $jobText = $("#job-text");
var $jobDescription = $("#job-description");
var $submitBtn = $("#submit");
var $jobList = $("#job-list");

// The API object contains methods for each kind of request we'll make
var API = {
  savejob: function(job) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/jobs",
      data: JSON.stringify(job)
    });
  },
  getjobs: function() {
    return $.ajax({
      url: "api/jobs",
      type: "GET"
    });
  },
  deletejob: function(id) {
    return $.ajax({
      url: "api/jobs/" + id,
      type: "DELETE"
    });
  }
};

// refreshjobs gets new jobs from the db and repopulates the list

// Need to write to handlebars all the jobs to the card here
var refreshjobs = function() {
  API.getjobs().then(function(data) {
    var $jobs = data.map(function(job) {
      var $a = $("<a>")
        .text(job.text)
        .attr("href", "/job/" + job.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": job.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $jobList.empty();
    $jobList.append($jobs);
  });
};

// handleFormSubmit is called whenever we submit a new job
// Save the new job to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var job = {
    text: $jobText.val().trim(),
    description: $jobDescription.val().trim()
  };

  if (!(job.text && job.description)) {
    alert("You must enter an job text and description!");
    return;
  }

  API.savejob(job).then(function() {
    refreshjobs();
  });

  $jobText.val("");
  $jobDescription.val("");
};

// handleDeleteBtnClick is called when an job's delete button is clicked
// Remove the job from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deletejob(idToDelete).then(function() {
    refreshjobs();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$jobList.on("click", ".delete", handleDeleteBtnClick);

/***************** Grabbing data from Indeed API *********************/
// When the user tells the chatbot all the necessary information
// Placeholder queries
var query = "full+stack+developer";
var publisherId = "123456789";
var location = "seattle%2C+wa";
var limit = "10";
var radius = "25";
var fullTime = true;

// Grabbing results
var indeedQueryURL =
  "http://api.indeed.com/ads/apisearch?publisher=" +
  publisherId +
  "&q=" +
  job +
  "&l=" +
  location +
  "&sort=&radius=" +
  radius +
  "&st=&jt=&start=&limit=" +
  limit +
  "&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";

var gitHubQueryURL =
  "https://jobs.github.com/positions.json?description=" +
  query +
  "&full_time=" +
  fullTime +
  "&location=" +
  location +
  "";
$.ajax({
  url: indeedQueryURL,
  method: "GET"
}).then(function(response) {
  // Add jobs to the database that shows up on the screen in the results?

  for (var job in response) {
    API.saveExample(job);
  }
});

$.ajax({
  url: gitHubQueryURL,
  method: "GET"
}).then(function(response) {
  // Add jobs to the database that shows up on the screen in the results?

  for (var job in response) {
    API.saveExample(job);
  }
});

// once all job apis are added to database, then repopulate results of all 

refreshExamples();

// When a save button gets clicked
// I don't think this will work
$(".save").on("click", function(event) {
  var saveStatus = {
    saved: true
  };

  $.ajax("/api/jobs/" + this.id, {
    type: "PUT",
    data: saveStatus
  }).then(function(res) {
    res.json();
    location.reload(); // ?
  });
});
