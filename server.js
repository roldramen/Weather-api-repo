require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./src/config/db');
const weatherRoutes = require('./src/routes/weatherRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');

const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Connect database
connectDB();

// Security & utilities
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files (CSS, YAML)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: '/static/swagger-custom.css',
    customSiteTitle: 'Weather Data API Docs',
    customfavIcon: '/static/favicon.png' // optional
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/weather', weatherRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Weather Data API — running',
    uptime: process.uptime(),
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
