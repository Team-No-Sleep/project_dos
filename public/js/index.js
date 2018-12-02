// The API object contains methods for each kind of request we'll make
// testing
var API = {
  saveExample: function(example, apiName) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/jobs/" + apiName,
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "/api/jobs",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "/api/jobs/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
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
var limit = "10";
var radius = "25";
var fullTime = true;

$.ajax({
  url: "/api/jobs/github/" + job + "/" + geoLocation + "/" + fullTime,
  method: "GET"
}).then(function(response) {
  //console.log(response);
  for (var i = 0; i < response.length; i++) {
    //console.log("hi");
    console.log(response[i]);
    API.saveExample(response[i], "github");
  }
});

$.ajax({
  url: "/api/jobs/authentic/" + job + "/" + geoLocation + "/" + true,
  method: "GET"
}).then(function(response) {
  //console.log(response);
  for (var i = 0; i < response.length; i++) {
    // console.log("hi");
    console.log(response[i]);
    API.saveExample(response[i], "authentic");
  }
});

//API.getExamples()

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
