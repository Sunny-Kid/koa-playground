const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {
  static initCore(app) {
    InitManager.app = app;
    InitManager.initLoaderRouters();
  }

  static initLoaderRouters() {
    requireDirectory(module, `${process.cwd()}/app/api/v1`, { visit: whenModuleLoaded });

    function whenModuleLoaded(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }
}

module.exports = InitManager;
