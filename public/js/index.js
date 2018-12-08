$(document).ready(function() {
  console.log("here");
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
      console.log(data[0]);
      console.log(data[1]);
      console.log(data[2]);
      console.log(data[3]);
      console.log(data[4]);

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
        var cardSubtitle1 = $("<h6 class='card-subtitle mb-2'>");
        cardSubtitle1.text(job.company);
        var cardSubtitle2 = $("<h6 class='card-subtitle mb-2 text muted'>");
        cardSubtitle2.text(job.location);
        var cardText = $("<p class='card-text'>");
        cardText.html(job.snippet);
        var apply = $("<a class='btn btn-primary'>");
        apply.text("Apply");
        var save = $("<div class = 'btn btn-primary save'></div>");
        save.text("Save Job");
        save.attr("id", job.id);

        apply.append(save);
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
      console.log(data);
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
      getSavedJobs();
    });

    // When a save button gets clicked then do a PUT operation to
    // make saved true. This doesn't work yet
    $(".save").on("click", function() {
      $.ajax("/api/jobs/" + this.id, {
        type: "PUT",
        data: true
      }).then(function(res) {
        res.json();
      });
    });
  }
});
