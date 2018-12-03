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

  // Job.associate = function(models) {
  //   Job.belongsTo(models.User, {
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };
  return Job;
};
