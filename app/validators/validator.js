const { LinValidator, Rule } = require('lin-mizar');
const { User } = require('../models/user');
const { LoginType, ArtType } = require('../lib/enum');

class Checker {
  constructor(type) {
    this.enumType = type;
  }

  check(val) {
    const type = val.body.type || val.path.type;
    if (!type) {
      throw new Error('type是必须参数');
    }
    if (!this.enumType.isThisType(type)) {
      throw new Error('type参数不合法');
    }
  }
}

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', '需要是正整数', { min: 1 })];
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super();
    this.account = [new Rule('isLength', '不符合账号规则', { min: 4, max: 32 })];
    this.secret = [new Rule('isOptional'), new Rule('isLength', '至少6个字符', { min: 6, max: 128 })];
    const checker = new Checker(LoginType);
    this.validateLoginType = checker.check.bind(checker);
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [new Rule('isEmail', '不符合Email规范')];
    this.password1 = [
      new Rule('isLength', '密码至少6个字符、最多32个字符', {
        min: 6,
        max: 32,
      }),
    ];
    this.password2 = this.password1;
    this.nickname = [
      new Rule('isLength', '昵称不符合长度规范', {
        min: 4,
        max: 32,
      }),
    ];
  }

  validatePassword(val) {
    const psw1 = val.body.password1;
    const psw2 = val.body.password2;
    if (psw1 !== psw2) {
      throw new Error('两个密码必须相同');
    }
  }

  async validateEmail(val) {
    const email = val.body.email;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw new Error('Email 已经存在');
    }
  }
}

class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = [new Rule('isLength', '不允许为空', { min: 1 })];
  }
}

class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    const checker = new Checker(ArtType);
    this.validateType = checker.check.bind(checker);
  }
}

class SearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = [new Rule('isLength', '搜索关键词不能为空', { min: 1, max: 16 })];
    this.start = [new Rule('isInt', 'start不符合规范', { min: 0, max: 1000 }), new Rule('isOptional', '', 0)];
    this.count = [new Rule('isInt', 'count不符合规范', { min: 1, max: 20 })];
  }
}

// 短评校验
class ShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.content = [new Rule('isLength', '必须在1~12个字之间', { min: 1, max: 12 })];
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  SearchValidator,
  ShortCommentValidator,
};
