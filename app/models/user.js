const bcrypt = require('bcryptjs');
const { sequelize } = require('../../core/db');

const { Sequelize, Model } = require('sequelize');

const userFields = {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128),
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    set(val) {
      const salt = bcrypt.genSaltSync(10);
      const psw = bcrypt.hashSync(val, salt);
      this.setDataValue('password', psw);
    },
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true,
  },
};

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在');
    }
    const isCorrect = bcrypt.compareSync(plainPassword, user.password);
    if (!isCorrect) {
      throw new global.errs.AuthFailed('密码不正确');
    }
    return user;
  }

  static async getUserByOpenId(openid) {
    const user = await User.findOne({
      where: {
        openid,
      },
    });
    return user;
  }

  static async registerByOpenId(openid) {
    const user = await User.create({
      openid,
    });
    return user;
  }
}

User.init(userFields, {
  sequelize,
  tableName: 'user',
});

module.exports = { User };
