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

// Connect to DB
connectDB();

/* ---------------------------------------------
   GLOBAL MIDDLEWARE
---------------------------------------------- */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files (ensures swagger-custom.css loads correctly)
app.use('/static', express.static(path.join(__dirname, 'public')));

/* ---------------------------------------------
   SWAGGER UI (with Custom CSS Theme)
---------------------------------------------- */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: '/static/swagger-custom.css', // Load from /public folder
    customSiteTitle: 'Weather Data API Docs',
    customfavIcon: '/static/favicon.png' // optional
  })
);

/* ---------------------------------------------
   RATE LIMITER
---------------------------------------------- */
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

/* ---------------------------------------------
   ROUTES
---------------------------------------------- */
app.use('/weather', weatherRoutes);

app.get('/', (req, res) =>
  res.json({
    message: 'Weather Data API — running',
    uptime: process.uptime()
  })
);

/* ---------------------------------------------
   ERROR HANDLER
---------------------------------------------- */
app.use(errorHandler);

/* ---------------------------------------------
   SERVER START
---------------------------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
