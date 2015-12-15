var router = require('koa-router')();

router.get('/', function* () {
    yield this.render('index');
});

module.exports = router;
