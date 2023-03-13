const express = require('express');

const router = express.Router();

// importing controller
const gameController = require('../Controllers/gameController');

router.route('/').post(gameController.change);
router.route('/new').get(gameController.createNewGame);
router.route('/:gc').get(gameController.getProgress);

module.exports = router;