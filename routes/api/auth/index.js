// routes/api/auth/index.js

var router = require('express').Router();

router.post('/create', require('./create.js'));
router.get('/get', require('./get.js'));
router.post('/login', require('./login.js'));
router.get('/logout', require('./logout.js'));

module.exports = router;