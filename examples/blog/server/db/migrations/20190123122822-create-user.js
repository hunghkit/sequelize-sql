module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
      },
      username: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        defaultValue: 'user',
        type: Sequelize.ENUM('user', 'admin'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
