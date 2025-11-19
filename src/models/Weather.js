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
