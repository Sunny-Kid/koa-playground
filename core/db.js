const { Sequelize, Model } = require('Sequelize');
const { unset, clone, isArray } = require('lodash');
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

// 删除返回字段
Model.prototype.toJSON = function() {
  let data = clone(this.dataValues);
  unset(data, 'created_at');
  unset(data, 'updated_at');
  unset(data, 'deleted_at');

  for (let key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http')) {
        data[key] = global.config.host + data[key];
      }
    }
  }

  // 自定义删除字段
  if (isArray(this.exclude)) {
    this.exclude.forEach(value => {
      unset(data, value);
    });
  }
  return data;
};

module.exports = { sequelize };
