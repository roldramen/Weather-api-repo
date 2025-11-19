const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/weatherController');
const validateRequest = require('../middleware/validateRequest');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Apply API key protection to write routes (optional bonus)
router.post(
  '/',
  apiKeyAuth,
  [
    body('locationName').isString().notEmpty(),
    body('lat').isFloat({ min: -90, max: 90 }),
    body('lon').isFloat({ min: -180, max: 180 }),
    body('tempC').isNumeric(),
    body('humidity').isNumeric()
  ],
  validateRequest,
  ctrl.createReading
);

router.get('/', ctrl.getAll);

router.get('/search', [ query('q').optional().isString() ], validateRequest, ctrl.search);

router.get('/:id', [ param('id').isMongoId() ], validateRequest, ctrl.getOne);

router.put('/:id',
  apiKeyAuth,
  [ param('id').isMongoId(), body('locationName').isString().notEmpty(), body('lat').isFloat(), body('lon').isFloat(), body('tempC').isNumeric(), body('humidity').isNumeric() ],
  validateRequest,
  ctrl.replace
);

router.patch('/:id',
  apiKeyAuth,
  [ param('id').isMongoId(), body().isObject().notEmpty() ],
  validateRequest,
  ctrl.update
);

router.delete('/:id',
  apiKeyAuth,
  [ param('id').isMongoId() ],
  validateRequest,
  ctrl.remove
);

module.exports = router;
