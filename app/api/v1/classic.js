const Router = require('koa-router');
const router = new Router({
  prefix: '/v1/classic',
});
const { PositiveIntegerValidator } = require('../../../validators/validator');
const { Flow } = require('../../models/flow');
const { Art } = require('../../models/art');
const { HttpException } = require('../../../core/http-exception');
const { Auth } = require('../../../middlewares/auth');

router.get('/latest', new Auth(9).m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [['index', 'DESC']],
  });
  const art = await Art.getData(flow.art_id, flow.type);
  art.setDataValue('index', flow.index);
  ctx.body = flow;
});

module.exports = router;
