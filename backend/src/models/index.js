const { sequelize } = require('../config/db');
const User = require('./user.model');
const Event = require('./event.model');

// Определяем отношения-связи
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'user' });

// Экспортируем модели и sequelize
module.exports = { sequelize, User, Event };
