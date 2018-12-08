$(document).ready(function() {
  $(document).on("click", ".save", saveJob);
  $(document).on("click", ".apply", applyJob);
  $(document).on("click", ".deleteSaved", deleteSaved);
  var userTableId;
  function getId() {
    console.log("getid start");
    $.ajax({
      type: "GET",
      url: "/api/user/" + user.id
    }).then(function(response) {
      console.log("getid done");
      console.log(response);
      userTableId = response[0].id;
    });
  }

  var API = {
    saveExample: function(example, apiName) {
      console.log(userTableId);
      //console.log("save example start");
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "/api/jobs/" + apiName + "/" + userTableId,
        data: JSON.stringify(example)
      }).then(function(response) {
        //console.log("save example done");
      });
    },
    getExamples: function() {
      console.log(userTableId);
      return $.ajax({
        url: "/api/jobs" + "/" + userTableId,
        type: "GET"
      });
    },
    // When the user loads the page, recommended jobs that aren't saved
    // are deleted from the database
    deleteUnsaved: function() {
      console.log("DELETING");
      console.log(userTableId);
      return $.ajax({
        url: "/api/jobs",
        type: "DELETE"
      }).then(function(response) {
        console.log("delete unsave done");
      });
    },

    deleteExample: function(id) {
      return $.ajax({
        url: "/api/jobs/" + id,
        type: "DELETE"
      });
    },

    getSavedJobs: function() {
      return $.ajax({
        url: "/api/jobs/saved/" + userTableId,
        type: "GET"
      });
    }
  };

  // refreshExamples gets new examples from the db and repopulates the list
  var refreshExamples = function() {
    console.log("refresh examples start");
    API.getExamples().then(function(data) {
      // THIS IS WHERE WE WOULD SEND THE DATA TO THE CARDS??
      console.log("refresh examples end");
      for (var i = 0; i < 3; i++) {
        var job = data[i];

        var cardTemplate = {
          jobTitle: $("<h4 class='job-title'>"),
          company: $("<h6 class='company-subtitle mb-2'>"),
          location: $("<h6 class='card-subtitle mb-2 text muted'>"),
          snippet: $("<p class='job-snippet'>"),
          applyButton: $("<a class='btn btn-primary'>Apply</a>"),
          saveButton: $("<a class ='btn btn-primary save'>Save Job</a>")
        };

        var jobInfo = {
          jobTitle: cardTemplate.jobTitle.text(job.jobtitle),
          company: cardTemplate.company.text(job.company),
          location: cardTemplate.location.text(job.location),
          saveButton: cardTemplate.saveButton.attr("id", job.id)
        };

        function generateCard(carouselItem) {
          var col = $("<div class='col-md-4'></div>");
          var card = $("<div class='card'></div>");
          var cardBody = $("<div class='card-body'></div>");
          col.append(card);
          card.append(cardBody);
          jobInfo; //fills in relevant data
          Object.keys(cardTemplate).forEach(function(item) {
            cardBody.append(cardTemplate[item]);
          });
          $(carouselItem).append(col);
        }
        generateCard("#item1");
      }
      for (var i = 3; i < data.length; i++) {
        var job = data[i];

        var cardTemplate = {
          jobTitle: $("<h4 class='job-title'>"),
          company: $("<h6 class='company-subtitle mb-2'>"),
          location: $("<h6 class='card-subtitle mb-2 text muted'>"),
          snippet: $("<p class='job-snippet'>"),
          applyButton: $("<a class='btn btn-primary'>Apply</a>"),
          saveButton: $("<a class ='btn btn-primary save'>Save Job</a>")
        };

        var jobInfo = {
          jobTitle: cardTemplate.jobTitle.text(job.jobtitle),
          company: cardTemplate.company.text(job.company),
          location: cardTemplate.location.text(job.location),
          saveButton: cardTemplate.saveButton.attr("id", job.id)
        };

        function generateCard(carouselItem) {
          var col = $("<div class='col-md-4'></div>");
          var card = $("<div class='card'></div>");
          var cardBody = $("<div class='card-body'></div>");
          col.append(card);
          card.append(cardBody);
          jobInfo; //fills in relevant data
          Object.keys(cardTemplate).forEach(function(item) {
            cardBody.append(cardTemplate[item]);
          });
          $(carouselItem).append(col);
        }
        generateCard("#item2");
      }
      console.log(data);
    });
  };

  var getSavedJobs = function() {
    API.getSavedJobs().then(function(data) {
      $("#saved").empty();

      // put saved jobs into modal
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var savedJob = data[i];
        var jobTitle = $("<h2>");
        jobTitle.text(savedJob.jobtitle);
        jobTitle.css("color", "black");
        jobTitle.attr("id", "savedDiv" + savedJob.id);
        jobTitle.css("float", "left");
        jobTitle.css("text-align", "center");
        jobTitle.css("width", "100%");

        var company = $("<h3>");
        company.text(savedJob.company);
        company.css("color", "black");
        company.css("float", "left");
        company.css("text-align", "center");
        company.css("width", "100%");

        var applyButton = $(
          "<button type='button' class='btn btn-primary apply'>"
        );

        applyButton.attr("link", savedJob.url);
        applyButton.text("Apply");
        applyButton.css("margin-bottom", "20px");
        applyButton.css("margin-top", "50px");

        applyButton.css("margin-right", "20px");
        applyButton.css("position", "relative");
        applyButton.css("left", "150px");
        applyButton.css("float", "left");

        var deleteSaved = $(
          "<button type='button' class='btn btn-primary deleteSaved'>"
        );

        deleteSaved.text("Delete");
        deleteSaved.css("margin-bottom", "20px");
        deleteSaved.css("margin-top", "50px");
        deleteSaved.css("position", "relative");
        deleteSaved.css("left", "150px");
        deleteSaved.css("float", "left");

        deleteSaved.attr("id", savedJob.id);
        // deleteSaved.css("float", "right");
        applyButton.append(deleteSaved);

        company.append(applyButton);
        company.append(deleteSaved);

        jobTitle.append(company);
        $("#saved").append(jobTitle);
      }
    });
  };

  var deleteUnsaved = function() {
    API.deleteUnsaved().then(function(data) {
      console.log(data);
    });
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function(event) {
    event.preventDefault();

    var example = {
      text: $exampleText.val().trim(),
      description: $exampleDescription.val().trim()
    };

    if (!(example.text && example.description)) {
      alert("You must enter an example text and description!");
      return;
    }

    API.saveExample(example).then(function() {
      refreshExamples();
    });

    $exampleText.val("");
    $exampleDescription.val("");
  };

  // handleDeleteBtnClick is called when an example's delete button is clicked
  // Remove the example from the db and refresh the list
  var handleDeleteBtnClick = function() {
    var idToDelete = $(this)
      .parent()
      .attr("data-id");

    API.deleteExample(idToDelete).then(function() {
      refreshExamples();
    });
  };

  // Add event listeners to the submit and delete buttons

  /***************** Grabbing data from Indeed API *********************/

  //Placeholder queries
  var job = "software+engineer";
  var publisherId = "123456789";
  var geoLocation = "seattle%2C+wa";
  var state = geoLocation.slice(-2);
  var limit = "10";
  var radius = "25";
  var fullTime = true;
  // if ($("#userId").text() !== "") {
  //   getId();
  // }
  if (user.id) {
    registerSocketListener();
    deleteUnsaved();
    getId();
    console.log("here2");
    $.ajax({
      url: "/api/jobs/gov/" + job + "/" + state + "/" + fullTime,
      method: "GET"
    }).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        // console.log(response[i]);
        API.saveExample(response[i], "gov");
      }
    });

    $.ajax({
      url: "/api/jobs/github/" + job + "/" + geoLocation + "/" + fullTime,
      method: "GET"
    }).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        API.saveExample(response[i], "github");
      }
    });

    $.ajax({
      url: "/api/jobs/authentic/" + job + "/" + geoLocation + "/" + true,
      method: "GET"
    }).then(function(response) {
      // console.log(response);
      for (var i = 0; i < response.length; i++) {
        // Will add new jobs to the db without saving them
        API.saveExample(response[i], "authentic");
      }
      // Will console.log all newly added jobs that aren't saved
      // expect 6
      refreshExamples();
      // Will console.log all saved jobs
      // expect 3
    });
  }
  // When a save button gets clicked then do a PUT operation to
  // make saved true. This doesn't work yet
  function saveJob() {
    console.log("hey");
    $.ajax("/api/jobs/" + this.id, {
      type: "PUT"
    });
  }

  function applyJob() {
    console.log("redirecting to apply website");
    window.open(this.getAttribute("link"));
  }

  function deleteSaved() {
    console.log(this.id);
    $("#savedDiv" + this.id).empty();
    $.ajax("/api/jobs/" + this.id, {
      type: "DELETE"
    });
  }

  $("#getSavedJobs").on("click", function() {
    getSavedJobs();
  });
});
//makes call to dialogFlow using socket.io
function registerSocketListener() {
  socket.on("jobSearch", function(data) {
    console.log("job search event received");
    console.log(data);
  });
}
