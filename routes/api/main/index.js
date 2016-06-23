// routes/api/main/index.js

var router = require('express').Router();

router.get('/getavatar:username', require('./getavatar.js'));
router.get('/getmessages', require('./getmessages.js'));

module.exports = router;