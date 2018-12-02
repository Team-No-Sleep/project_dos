module.exports = function(sequelize, DataTypes) {
  var Job = sequelize.define("Job", {
    jobtitle: DataTypes.STRING,
    company: DataTypes.STRING,
    location: DataTypes.STRING,
    date: DataTypes.STRING,
    snippet: DataTypes.TEXT,
    url: DataTypes.TEXT,
    type: DataTypes.STRING,
    saved: DataTypes.BOOLEAN,
    applied: DataTypes.BOOLEAN
  });
  return Job;
};
