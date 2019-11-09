const Router = require('koa-router');
const { HotBook } = require('../../models/hot-book');
const { Success } = require('../../../core/http-exception');
const { Book } = require('../../models/book');
const { Favor } = require('../../models/favor');
const { Comment } = require('../../models/book-comment');
const { Auth } = require('../../../middlewares/auth');
const { PositiveIntegerValidator, SearchValidator, ShortCommentValidator } = require('../../validators/validator');

const router = new Router({
  prefix: '/v1/book',
});

router.get('/hot_list', async ctx => {
  const books = await HotBook.findAll();
  ctx.body = { books };
});

router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const bookId = v.get('path.id');
  ctx.body = await Book.getDetail(bookId);
});

router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx);
  const result = await Book.searchFromYushu(v.get('query.q'), v.get('query.start'), v.get('query.count'));
  ctx.body = result;
});

/**
 * @route   GET /favor/count
 * @desc    获取我喜欢的书籍的数量
 * @access  private
 */
router.get('/favor/count', new Auth().m, async (ctx, next) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid);

  ctx.body = {
    count,
  };
});

/**
 * @route   GET /:book_id/favor
 * @desc    书籍点赞情况
 * @access  private
 */
router.get('/:book_id/favor', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
  const favor = await Favor.getMyFavorBook(v.get('path.book_id'), ctx.auth.uid);
  ctx.body = favor;
});

/**
 * @route   POST /add/short_comment
 * @desc    增加书籍短评
 * @access  private
 */
router.post('/add/short_comment', new Auth().m, async (ctx, next) => {
  const v = await new ShortCommentValidator().validate(ctx, { id: 'book_id' });
  const result = await Comment.addComment(v.get('body.book_id'), v.get('body.content'));
  const msg = result ? '有相同评论，评论数+1' : '新增成功！';
  throw new Success(msg);
});

/**
 * @route GET /:book_id/short_comment
 * @desc    获取书籍短评
 * @access  public
 */
router.get('/:book_id/short_comment', async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
  const bookId = v.get('path.book_id');
  const comments = await Comment.getComment(bookId);
  if (!comments) {
    throw new global.errs.NotFound();
  }
  ctx.body = {
    comments,
    book_id: bookId,
  };
});

/**
 * @route   GET /hot_keyword
 * @desc    获取书籍搜索的热门关键字
 * @access  public
 */
router.get('/hot_keyword', async (ctx, next) => {
  ctx.body = ['PDD', '卢姥爷', '芜湖大司马', '正方形打野'];
});

module.exports = router;
