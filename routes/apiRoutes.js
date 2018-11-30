var db = require("../models");

module.exports = function(app) {
  // Get all Jobs
  app.get("/api/jobs", function(req, res) {
    db.Job.findAll({}).then(function(dbJobs) {
      res.json(dbJobs);
    });
  });

  app.post("/api/jobs", function(req, res) {
    db.Job.create({
      jobtitle: req.body.jobtitle,
      company: req.body.company,
      city: req.body.city,
      state: req.body.state,
      date: req.body.date,
      snippet: req.body.snippet,
      url: req.body.url,
      saved: false,
      applied: false
    }).then(function(dbJob) {
      res.json(dbJob);
    });
  });

  // Delete an Job by id
  app.delete("/api/jobs/:id", function(req, res) {
    db.Job.destroy({ where: { id: req.params.id } }).then(function(dbJob) {
      res.json(dbJob);
    });
  });

  app.put("/api/jobs/:id", function(req, res) {
    db.Job.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
      .then(function(dbPost) {
        res.json(dbPost);
      });
};
