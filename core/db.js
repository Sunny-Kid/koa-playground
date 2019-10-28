const Sequelize = require('Sequelize');
const { dbName, host, port, user, password } = require('../config/config').database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  /**
   * Default options for model definitions
   * The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
   */
  define: {
    timestamp: true,
    /**
     * 进行软删除，需要配合 timestamp: true
     * @see https://sequelize.org/master/manual/models-definition.html#configuration
     */
    paranoid: true,
    underscored: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      },
    },
  },
});

/**
 * Synchronizing all models at once
 * Note: using `force: true` will drop the table if it already exists
 * @see https://sequelize.org/master/manual/getting-started.html#synchronizing-the-model-with-the-database
 */
sequelize.sync({ force: true });

module.exports = { sequelize };
