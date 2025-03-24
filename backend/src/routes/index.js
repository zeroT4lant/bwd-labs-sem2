// routes/index.js
const express = require('express');
const userRoutes = require('./user.routes');
const eventRoutes = require('./event.routes');

const router = express.Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/users', userRoutes);
router.use('/events', eventRoutes);

module.exports = router;
