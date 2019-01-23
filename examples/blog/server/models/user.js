import xss from 'sanitizer';
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV1,
    },
    username: {
      unique: true,
      type: DataTypes.STRING,
      set(val) { this.setDataValue('username', xss.sanitize(val)); },
    },
    password: {
      unique: true,
      type: DataTypes.STRING,
      set(val) { this.setDataValue('password', bcrypt.hashSync(val || '', 10)); },
    },
    name: {
      unique: true,
      type: DataTypes.STRING,
      set(val) { this.setDataValue('name', xss.sanitize(val)); },
    },
    role: {
      defaultValue: 'user',
      type: DataTypes.ENUM('user', 'admin'),
    },
  }, {

  });

  const permitFields = ['username', 'password', 'name', 'role'];
  const requiredField = ['username', 'password', 'name'];
  const publicFields = ['username', 'name', 'role', 'createdAt', 'updatedAt'];

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'authorId' });
  };

  User.prototype.toJson = function (extra = {}) {
    return [...publicFields].reduce((obj, key) => Object.assign(obj, { [key]: this[key] }), { ...extra });
  };

  User.createData = (params = {}) => new Promise((resolve, reject) => {
    try {
      const permitParams = permitFields.reduce((obj, key) => [undefined, null].includes(params[key]) ? obj : ({ ...obj, [key]: params[key] }), {});
      const emptries = [...requiredField].filter((key) => [undefined].includes(params[key]));

      if (emptries.length) {
        throw (emptries.reduce((obj, key) => ({ ...obj, [key]: `${key} can't be blank`}), {}));
      }

      User.create(permitParams)
        .then((user) => resolve(user.toJson()))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });

  User.updateData = (uuid, params = {}) => {
    const permitParams = permitFields.reduce((obj, key) => [undefined, null].includes(params[key]) ? obj : ({ ...obj, [key]: params[key] }), {});

    return User.create(permitParams);
  };

  User.updateData = (uuid, params = {}) => new Promise((resolve, reject) => {
    try {
      User
        .findOne({
          where: { uuid },
        })
        .then((user) => {
          if (!user) {
            throw new Error('User not found');
          }

          Object.entries(params).forEach(([key, value]) => {
            if (permitFields.includes(key)) {
              user[key] = value;
            }
          })

          return user.save();
        })
        .then((user) => resolve(user.toJson()))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });

  return User;
};
