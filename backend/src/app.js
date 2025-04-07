import express, { json } from 'express';
import cors from 'cors';
import { serve, setup } from 'swagger-ui-express';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import morganLogger from './middlewares/morganLogger.js';
import rateLimit from 'express-rate-limit';

const app = express();

// Swagger
const swaggerDocument = load(readFileSync('./src/docs/swagger.yaml', 'utf8'));
app.use('/api-docs', serve, setup(swaggerDocument));

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    max: 100, // 100 запросов в минуту
    message: 'Слишком много запросов с этого IP, пожалуйста, попробуйте позже.',
    headers: true, //Включает заголовки `RateLimit-*` в ответе.
    statusCode: 429, // код статуса HTTP, используемый при ограничении запросов (по умолчанию 429)
});

// Middleware
app.use(json());
app.use(cors());
app.use(morganLogger);
app.use(limiter);
app.use('/api', routes);
app.use(errorHandler);




export default app;