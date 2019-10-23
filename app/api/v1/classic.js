const Router = require('koa-router');
const router = new Router();
const { PositiveIntegerValidator } = require('../../../validators/validator');

const { HttpException } = require('../../../core/http-exception');

router.get('/v1/classic/latest', (ctx, next) => {
  ctx.body = { key: 'classic' };
  throw new Error('API Exception');
});

router.post('/v1/:id/classic/latest', (ctx, next) => {
  const path = ctx.params;
  const query = ctx.request.query;
  const headers = ctx.request.headers;
  const body = ctx.request.body;

  const v = new PositiveIntegerValidator().validate(ctx);
  const id = v.get('path.id');

  ctx.body = { key: 'classic' };
});

module.exports = router;
