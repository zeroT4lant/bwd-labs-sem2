const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const morganLogger = require('./middlewares/morganLogger');
const rateLimit = require('express-rate-limit');

const app = express();

// Swagger
const swaggerDocument = yaml.load(fs.readFileSync('./src/docs/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    max: 100, // 100 запросов в минуту
    message: 'Слишком много запросов с этого IP, пожалуйста, попробуйте позже.',
    headers: true, //Включает заголовки `RateLimit-*` в ответе.
    statusCode: 429, // код статуса HTTP, используемый при ограничении запросов (по умолчанию 429)
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(morganLogger);
app.use(limiter);
app.use('/api', routes);
app.use(errorHandler);




module.exports = app;
