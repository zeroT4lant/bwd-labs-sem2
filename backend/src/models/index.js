import { sequelize } from '../config/db.js';
import User from './user.model.js';
import Event from './event.model.js';

// Определяем отношения-связи
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'user' });

// Экспортируем модели и sequelize
export { sequelize, User, Event };
