const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const os = require('os');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : fs.existsSync(os.tmpdir())
    ? path.join(os.tmpdir(), 'uploads')
    : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Root message
app.get('/', (req, res) => {
  res.json({
    message: 'Sportify TN backend is running',
    docs: '/api-docs',
  });
});

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sportify TN API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/stars', require('./routes/stars'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sportify-tn')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;

// Export app for serverless platforms (e.g., Vercel)
module.exports = app;

// Only start a listener when this file is executed directly.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}