$(document).ready(function() {
  $(document).on("click", ".save", saveJob);
  $(document).on("click", ".apply", applyJob);
  $(document).on("click", ".deleteSaved", deleteSaved);
  var userTableId;
  registerSocketListener();
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
      for (var i = 0; i < data.length; i++) {
        var job = data[i];
        console.log("here");
        console.log(data.length);
        var col = $("<div class='col-md-4'></div>");
        var card = $("<div class = 'card'></div>");
        var cardBody = $("<div class = 'card-body'></div>");
        var cardTitle = $("<h4 class = 'card-title'>");

        cardTitle.text(job.jobtitle);
        cardTitle.css("margin-bottom", "5px");
        var cardSubtitle1 = $("<h6 class='card-subtitle mb-2'>");
        cardSubtitle1.text(job.company);
        cardSubtitle1.css("margin-bottom", "5px");
        var cardSubtitle2 = $("<h6 class='card-subtitle mb-2 text muted'>");
        cardSubtitle2.text(job.location);
        cardSubtitle2.css("margin-bottom", "5px");

        var cardText = $("<p class='card-text'>");
        cardText.html(job.snippet.substr(0, 140));
        cardText.css("margin-bottom", "5px");

        var apply = $("<button class='btn btn-primary apply'>");
        apply.text("Apply");
        apply.attr("link", job.url);
        var save = $("<div class = 'btn btn-primary save'></div>");
        save.text("Save Job");
        save.attr("id", job.id);

        cardText.append(save);
        cardText.append(apply);
        cardSubtitle2.append(cardText);
        cardSubtitle1.append(cardSubtitle2);
        cardTitle.append(cardSubtitle1);
        cardBody.append(cardTitle);
        card.append(cardBody);
        col.append(card);
        //item.append(col);
        $("#cards").append(col);
      }
      // console.log(data);
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

  //makes call to dialogFlow using socket.io
  function registerSocketListener() {
    socket.on("jobSearch", function(data) {
      console.log("hello");
      console.log("job search event received");
      afterChatBot(data.city.stringValue, data.jobPosition.stringValue);
    });
  }
  /***************** Grabbing data from Indeed API *********************/

  function afterChatBot(geoLocation, job) {
    var jobTemp;
    var jobArray;
    if (job.includes(" ")) {
      jobArray = job.splice(" ");
      for (var i = 0; i < jobArray.length; i++) {
        jobTemp += jobArray[i] + "+";
      }
      job = jobTemp.substring(0, jobTemp.length - 1);
      console.log(job);
    }
    // var geoLocation = "seattle%2C+wa";
    var state = "wa";
    var fullTime = true;

    
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
