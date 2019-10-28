const { Op } = require('sequelize');
const { Movie, Sentence, Music } = require('./classic');

class Art {
  static async getData(art_id, type, useScope) {
    const finder = {
      where: { id: art_id },
    };
    let art = null;
    const scope = useScope ? 'bh' : null;
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder);
        break;
      case 200:
        art = await Music.scope(scope).findOne(finder);
        break;
      case 300:
        art = await Sentence.scope(scope).findOne(finder);
        break;
      default:
        break;
    }
    // if (art && art.image) {
    //     let imgUrl = art.dataValues.image
    //     art.dataValues.image = global.config.host + imgUrl
    // }
    return art;
  }

  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    };
    let arts = [];
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    for (let key in artInfoObj) {
      if (Object.prototype.hasOwnProperty.call(artInfoObj, key)) {
        const ids = artInfoObj[key];
        if (!ids.length) continue;
        arts.push(await Art._getListByType(ids, parseInt(key, 10)));
      }
    }
  }

  // 根据type获取list
  static async _getListByType(ids, type) {
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    };
    let arts = null;
    const scope = 'bh';
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder);
        break;
      case 200:
        arts = await Music.scope(scope).findAll(finder);
        break;
      case 300:
        arts = await Sentence.scope(scope).findAll(finder);
        break;
      case 400:
        break;
      default:
        break;
    }
    return arts;
  }
}

module.exports = { Art };
