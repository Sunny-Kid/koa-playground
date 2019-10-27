const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');
const { Art } = require('./art');

const favorFields = {
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
};

class Favor extends Model {
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
}

Favor.init(favorFields, {
  sequelize,
  tableName: 'favor',
});

module.exports = { Favor };
