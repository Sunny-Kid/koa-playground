const { sequelize } = require('../../core/db');
const { Favor } = require('./favor');
const { Sequelize, Model } = require('sequelize');
const axios = require('axios');
const util = require('util');

const bookFields = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0,
  },
};

class Book extends Model {
  static async getDetail(id) {
    const url = util.format(global.config.yushu.detailUrl, id);
    const detail = await axios.get(url);
    return detail.data;
  }

  // 喜欢的书籍数量
  static async getMyFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        uid,
        type: 400,
      },
    });
    return count;
  }

  // 搜索书籍
  static async searchFromYushu(q, start, count, summary = 1) {
    const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), start, count, summary);
    console.log(url);
    const list = await axios.get(url);
    return list.data;
  }
}

Book.init(bookFields, {
  sequelize,
  tableName: 'book',
});

module.exports = { Book };
