module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    linkedInId: DataTypes.STRING
  });
  User.associate = function(models) {
    User.hasMany(models.Job, {
      onDelete: "cascade"
    });
  };

  return User;
};
