const { LinValidator, Rule } = require('lin-mizar');

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', '需要是正整数', { min: 1 })];
  }
}

module.exports = { PositiveIntegerValidator };
