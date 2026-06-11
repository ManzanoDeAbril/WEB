// rq-08: Panel principal
const express         = require('express');
const router          = express.Router();
const panelController = require('../controllers/panelController');
const authenticate    = require('../middlewares/authenticate');

router.get('/', authenticate, panelController.obtenerPanel);

module.exports = router;