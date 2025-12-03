const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  locationName: { type: String, required: true, index: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  timestamp: { type: Date, required: true, default: Date.now, index: true },
  tempC: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeedKph: { type: Number, default: 0 },
  conditions: { type: String, default: 'Unknown' },
  source: { type: String, default: 'manual' }
}, { timestamps: true });

module.exports = mongoose.model('Weather', WeatherSchema);

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Get all weather data
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: List of all weather data
 */

/**
 * @swagger
 * /weather:
 *   post:
 *     summary: Add new weather data
 *     tags: [Weather]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationName:
 *                 type: string
 *               lat:
 *                 type: number
 *               lon:
 *                 type: number
 *               tempC:
 *                 type: number
 *               humidity:
 *                 type: number
 *               condition:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
