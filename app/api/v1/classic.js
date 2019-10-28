const Router = require('koa-router');
const { PositiveIntegerValidator, LikeValidator } = require('../../../validators/validator');
const { Flow } = require('../../models/flow');
const { Art } = require('../../models/art');
const { Favor } = require('../../models/favor');
const { Auth } = require('../../../middlewares/auth');

const router = new Router({
  prefix: '/v1/classic',
});

/**
 * @route   GET /latest
 * @desc    获取最新一期的期刊
 * @access  private
 */
router.get('/latest', new Auth(9).m, async (ctx, next) => {
  const latest = await Flow.findOne({
    order: [['index', 'DESC']],
  });
  const art = await Art.getData(latest.art_id, latest.type);
  const status = await Favor.isLike(latest.art_id, latest.type);
  art.setDataValue('index', latest.index);
  art.setDataValue('like_status', status);
  ctx.body = art;
});

/**
 * @route   GET /:type/:id
 * @desc    获取期刊详情
 * @access  private
 */
router.get('/:type/:id', new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx);
  const id = v.get('path.id');
  const type = parseInt(v.get('path.type'));
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);

  artDetail.art.setDataValue('like_status', artDetail.like_status);
  ctx.body = artDetail.art;
});

/**
 * @route GET /:type/:id/favor
 * @desc 获取期刊点赞信息
 * @access private
 */
router.get('/:type/:id/favor', new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx);
  const id = v.get('path.id');
  const type = parseInt(v.get('path.type'), 10);
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);

  ctx.body = {
    fav_nums: artDetail.fav_nums,
    like_status: artDetail.like_status,
  };
});

/**
 * @route   GET /favor
 * @desc    获取我喜欢的期刊
 * @access  private
 */
router.get('/favor', new Auth().m, async ctx => {
  const uid = ctx.auth.uid;
  ctx.body = await Favor.getMyFavorClassic(uid);
});

module.exports = router;
