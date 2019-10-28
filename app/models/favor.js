const { sequelize } = require('../../core/db');
const { Sequelize, Model, Op } = require('sequelize');
const { Art } = require('./art');
const { ArtType } = require('../lib/enum');

const favorFields = {
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
};

class Favor extends Model {
  // 点赞
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    });
    if (favor) {
      throw new global.errs.LikeError();
    }
    // 事务
    return sequelize.transaction(async t => {
      await Favor.create(
        {
          art_id,
          type,
          uid,
        },
        { transaction: t },
      );
      const art = await Art.getData(art_id, type);
      await art.increment('fav_nums', { by: 1, transaction: t });
    });
  }

  // 取消点赞
  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    });
    if (!favor) {
      throw new global.errs.DisLikeError();
    }
    return sequelize.transaction(async t => {
      await favor.destroy({
        force: true,
        transaction: t,
      });
      const art = await Art.getData(art_id, type);
      await art.decrement('fav_nums', { by: 1, transaction: t });
    });
  }

  // 判断是否点赞过
  static async isLike(artId, type, uid) {
    const favor = await Favor.findOne({
      where: { art_id: artId, type, uid },
    });
    const result = Boolean(favor);
    return result;
  }

  // 获取我喜欢的期刊
  static async getMyFavorClassic(uid) {
    const favors = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: ArtType.BOOK,
        },
      },
    });
    if (!favors) {
      throw new global.errs.NotFound();
    }
    const result = await Art.getList(favors);
    return result;
  }

  // 获取图书的点赞数量
  static async getMyFavorBook(id, uid) {
    const favorNum = await Favor.count({
      where: {
        type: ArtType.BOOK,
        art_id: id,
      },
    });
    const myFavor = await Favor.findOne({
      where: {
        art_id: id,
        uid,
        type: ArtType.BOOK,
      },
    });
    return {
      fav_nums: favorNum,
      like_status: myFavor ? 1 : 0,
    };
  }
}

Favor.init(favorFields, {
  sequelize,
  tableName: 'favor',
});

module.exports = { Favor };
