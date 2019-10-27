module.exports = {
  environment: 'dev',
  database: {
    dbName: 'playground',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 123456,
  },
  security: {
    secretKey: '\x88W\xf09\x91\x07\x98\x89\x87\x96\xa0A\xc68\xf9\xecJJU\x17\xc5V\xbe\x8b\xef\xd7\xd8\xd3\xe6\x95*4',
    expiresIn: 60 * 60 * 24 * 30,
  },
  wx: {
    appId: '',
    appSecret: '',
    loginUrl:
      'https://api.weixin.qq.com/sns/jscode2session?appid=s%&secret=s%&js_code=s%&grant_type=authorization_code',
  },
};
