import xss from 'sanitizer';

export default (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    uuid: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV1,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      set(val) { this.setDataValue('title', xss.sanitize(val)); },
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING,
      set(val) { this.setDataValue('content', xss.sanitize(val)); },
    },
    authorId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {

  });

  const permitFields = ['title', 'content', 'authorId'];
  const requiredField = [...permitFields];
  const publicFields = [...requiredField, 'createdAt', 'updatedAt'];

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'authorId', as: 'auhtor' });
  };

  Post.prototype.toJson = function (extra = {}) {
    return [...publicFields].reduce((obj, key) => Object.assign(obj, { [key]: this[key] }), { ...extra });
  };

  Post.createData = (params = {}) => new Promise((resolve, reject) => {
    try {
      const permitParams = permitFields.reduce((obj, key) => [undefined, null].includes(params[key]) ? obj : ({ ...obj, [key]: params[key] }), {});
      const emptries = [...requiredField].filter((key) => [undefined].includes(params[key]));

      if (emptries.length) {
        throw (emptries.reduce((obj, key) => ({ ...obj, [key]: `${key} can't be blank`}), {}));
      }

      Post.create(permitParams)
        .then((post) => resolve(post.toJson()))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });


  Post.updateData = (uuid, params = {}) => new Promise((resolve, reject) => {
    try {
      Post
        .findOne({
          where: { uuid },
        })
        .then((post) => {
          if (!post) {
            throw new Error('Post not found');
          }

          Object.entries(params).forEach(([key, value]) => {
            if (permitFields.includes(key)) {
              post[key] = value;
            }
          })

          return post.save();
        })
        .then((post) => resolve(post.toJson()))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });

  return Post;
};
