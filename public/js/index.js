$(document).ready(function() {
  $(document).on("click", ".save", saveJob);
  $(document).on("click", ".apply", applyJob);
  $(document).on("click", ".deleteSaved", deleteSaved);
  var userTableId;
  registerSocketListener();
  // This function allows the front end to use the user's LinkedIn id to grab
  // the associative value of the user in the job's table
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
    // Sends a request to the back-end to save the retrieved
    // into the jobs table
    putJob: function(Job, apiName) {
      console.log(userTableId);
      //console.log("save Job start");
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "/api/jobs/" + apiName + "/" + userTableId,
        data: JSON.stringify(Job)
      }).then(function(response) {
        //console.log("save Job done");
      });
    },
    // Sends a request to the back-end to retrieve all jobs the user searched for
    getJobs: function() {
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
      return $.ajax({
        url: "/api/jobs",
        type: "DELETE"
      }).then(function(response) {
        console.log("delete unsave done");
      });
    },

    // Deletes the saved job from the jobs table
    deleteSaved: function(id) {
      $.ajax("/api/jobs/" + id, {
        type: "DELETE"
      });
    },

    // Sends a request to the back-end to return all jobs the user has saved
    getSavedJobs: function() {
      return $.ajax({
        url: "/api/jobs/saved/" + userTableId,
        type: "GET"
      });
    },

    saveJob: function(id) {
      $.ajax("/api/jobs/" + id, {
        type: "PUT"
      });
    }
  };

  // Gets all new jobs and populates them into the carousel cards
  var refreshJobs = function() {
    console.log("refresh Jobs start");
    API.getJobs().then(function(data) {
      console.log("refresh Jobs end");
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var job = data[i];
        var cardTemplate = {
          jobTitle: $("<h4 class='job-title'>"),
          company: $("<h6 class='company-subtitle mb-2'>"),
          location: $("<h6 class='card-subtitle mb-2 text muted'>"),
          snippet: $("<p class='job-snippet'>"),
          saveButton: $("<a class ='btn btn-primary save'>Save Job</a>"),
          applyButton: $("<button class='btn btn-primary apply'>")
        };
        var jobInfo = {
          jobTitle: cardTemplate.jobTitle.text(job.jobtitle),
          company: cardTemplate.company.text(job.company),
          location: cardTemplate.location.text(job.location),
          saveButton: cardTemplate.saveButton.attr("id", job.id),
          applyButton: cardTemplate.applyButton.attr(
            "link",
            $(job.url)
              .find("a:first")
              .attr("href")
          )
        };
        cardTemplate.applyButton.text("Apply");

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
          saveButton: $("<a class ='btn btn-primary save'>Save Job</a>"),
          applyButton: $("<button class='btn btn-primary apply'>")
        };
        var save = $("<div class = 'btn btn-primary save'></div>");
        save.text("Save Job");
        save.attr("id", job.id);
        var jobInfo = {
          jobTitle: cardTemplate.jobTitle.text(job.jobtitle),
          company: cardTemplate.company.text(job.company),
          location: cardTemplate.location.text(job.location),
          saveButton: cardTemplate.saveButton.attr("id", job.id),
          applyButton: cardTemplate.applyButton.attr(
            "link",
            $(job.url)
              .find("a:first")
              .attr("href")
          )
        };
        cardTemplate.applyButton.text("Apply");
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
      $(".controls").attr("class", "controls clearfix");
    });
  };

  // Gets the user's saved jobs from the jobs table and then populates
  // a modal with the user's saved jobs
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

        applyButton.attr(
          "link",
          $(savedJob.url)
            .find("a:first")
            .attr("href")
        );
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

  // Makes call to dialogFlow using socket.io
  // and then calls afterChatBot with the user's responses
  function registerSocketListener() {
    socket.on("jobSearch", function(data) {
      console.log(data);
      console.log("job search event received");
      afterChatBot(data.city.stringValue, data.jobPosition.stringValue);
    });
  }

  // This checks if the user has successfully logged in using LinkedIn and gets
  // the id of the user in the user table
  if (user.id) {
    getId();
  }
  // 
  function afterChatBot(geoLocation, job) {
    var fullTime = true;
    var jobTemp = "";
    var jobArray;
    if (job.includes(" ")) {
      jobArray = job.split(" ");
      console.log(jobArray);
      for (var i = 0; i < jobArray.length; i++) {
        jobTemp += jobArray[i] + "+";
      }
      job = jobTemp.substring(0, jobTemp.length - 1);
      console.log(job);
    }
    console.log(geoLocation);
    console.log(job);

    deleteUnsaved();

    // gov api call
    // $.ajax({
    //   url: "/api/jobs/gov/" + job + "/" + state + "/" + fullTime,
    //   method: "GET"
    // }).then(function(response) {
    //   for (var i = 0; i < response.length; i++) {
    //     // console.log(response[i]);
    //     API.saveExample(response[i], "gov");
    //   }
    // });

    $.ajax({
      url: "/api/jobs/github/" + job + "/" + geoLocation + "/" + fullTime,
      method: "GET"
    }).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        API.putJob(response[i], "github");
      }
    });

    $.ajax({
      url: "/api/jobs/authentic/" + job + "/" + geoLocation + "/" + true,
      method: "GET"
    }).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        // Will add new jobs to the db
        API.putJob(response[i], "authentic");
      }
      refreshJobs();
    });
  }
  // When a save button gets clicked then do a PUT operation to
  // make saved true.
  function saveJob() {
    console.log("saving");
    API.saveJob(this.id);
  }

  // When apply button is clicked the window changes to the job posting's apply page
  function applyJob() {
    console.log("redirecting to apply website");
    window.open(this.getAttribute("link"));
  }

  // When delete saved job button is clicked this calls on the API
  // to delete the job
  function deleteSaved() {
    console.log(this.id);
    $("#savedDiv" + this.id).empty();
    API.deleteSaved(this.id);
  }

  // When the saved jobs button gets clicked it displays the saved jobs
  $("#getSavedJobs").on("click", function() {
    getSavedJobs();
  });
});
