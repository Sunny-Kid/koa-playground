const Koa = require('koa');
const axios = require('axios');
const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  console.log(ctx.r);
});

app.use(async (ctx, next) => {
  console.log(3);
  const res = await axios.get('http://7yue.pro');
  ctx.r = res;
  await next();
});

app.listen(8080);
