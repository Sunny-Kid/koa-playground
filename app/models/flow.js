const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

const flowFields = {
  index: Sequelize.INTEGER,
  artId: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
};

class Flow extends Model {}

Flow.init(flowFields, { sequelize, tableName: 'flow' });
