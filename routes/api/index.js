// routes/api/index.js

var router = require('express').Router();

router.use('/auth/', require('./auth/index.js'));
router.use('/main/', require('./main/index.js'));

module.exports = router;