require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const weatherRoutes = require('./src/routes/weatherRoutes');
const swaggerSpec = require('./src/docs/swagger'); // loads openapi.yaml → JSON
const errorHandler = require('./src/middleware/errorHandler');
const path = require('path');

const app = express();
connectDB();

// Security + middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files (CSS, YAML)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Weather API routes
app.use('/weather', weatherRoutes);

// ---- CUSTOM SWAGGER UI PAGE ----
app.get('/api-docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Weather API Documentation</title>

  <link rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">

  <link rel="stylesheet"
        href="/static/swagger-custom.css"> <!-- Your custom styles -->
</head>

<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = function () {
      SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    }
  </script>
</body>
</html>
  `);
});

// Root endpoint
app.get('/', (req, res) =>
  res.json({ message: 'Weather Data API — running', uptime: process.uptime() })
);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
