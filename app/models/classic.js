const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0,
  },
  title: Sequelize.STRING,
  /**
   * A 8 bit integer
   * @see https://sequelize.org/master/class/lib/data-types.js~TINYINT.html
   */
  type: Sequelize.TINYINT,
};

class Movie extends Model {}

Movie.init(classicFields, {
  sequelize,
  tableName: 'movie',
});

class Sentence extends Model {}

Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence',
});

class Music extends Model {}

const musicFields = Object.assign({ url: Sequelize.STRING }, classicFields);

Music.init(musicFields, {
  sequelize,
  tableName: 'music',
});

module.exports = { Movie, Sentence, Music };
