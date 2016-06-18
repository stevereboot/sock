// routes/api/main/index.js

var router = require('express').Router();

router.get('/getavatar:username', require('./getavatar.js'));

module.exports = router;