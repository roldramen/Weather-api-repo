require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const weatherRoutes = require('./src/routes/weatherRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger UI with custom styling
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar {
        background-color: #0d1117 !important;
        border-bottom: 2px solid #30363d !important;
      }

      .swagger-ui .topbar .download-url-wrapper {
        display: none !important;
      }

      .swagger-ui .opblock-summary {
        background: #f7f7f7 !important;
        border-radius: 8px !important;
      }

      .swagger-ui .opblock.opblock-get {
        border-color: #61affe !important;
      }

      .swagger-ui .opblock.opblock-post {
        border-color: #49cc90 !important;
      }

      body {
        background: #fafafa !important;
      }
    `
  })
);

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Routes
app.use('/weather', weatherRoutes);

// Root
app.get('/', (req, res) =>
  res.json({ message: 'Weather Data API — running', uptime: process.uptime() })
);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
