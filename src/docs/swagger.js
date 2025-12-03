const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather Data API',
      version: '1.0.0',
      description: 'API for creating and reading weather observations'
    },
    servers: [{ url: process.env.BASE_URL || 'http://localhost:3000', description: 'Local server' }]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

// You can add examples programmatically
swaggerSpec.components = swaggerSpec.components || {};
swaggerSpec.components.schemas = {
  Weather: {
    type: 'object',
    properties: {
      locationName: { type: 'string', example: 'Puerto Princesa' },
      lat: { type: 'number', example: 9.742 },
      lon: { type: 'number', example: 118.754 },
      timestamp: { type: 'string', format: 'date-time', example: '2025-11-19T10:00:00Z' },
      tempC: { type: 'number', example: 30 },
      humidity: { type: 'number', example: 78 },
      windSpeedKph: { type: 'number', example: 12.3 },
      conditions: { type: 'string', example: 'Partly cloudy' },
      source: { type: 'string', example: 'openweather' }
    }
  }
};

module.exports = swaggerSpec;
