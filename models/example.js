module.exports = function(sequelize, DataTypes) {
  var Job = sequelize.define("Job", {
    jobtitle: DataTypes.STRING,
    company: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    date: DataTypes.STRING,
    snippet: DataTypes.STRING,
    url: DataTypes.STRING
  });
  return Job;
};
