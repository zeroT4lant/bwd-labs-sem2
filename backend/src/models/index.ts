import { sequelize } from '@config/db';
import User from './user.model';
import Event from './event.model';

// Определяем отношения-связи
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });

// Экспортируем модели и sequelize
export { sequelize, User, Event };
