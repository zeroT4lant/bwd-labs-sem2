import { Event, User } from '../models/index.js';
import jwt from 'jsonwebtoken';


// Получить все мероприятия с пагинацией
const getAllEvents = async (req, res, next) => {
  try {
    // Получаем параметры page и limit из запроса
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // Валидация для параметров пагинации
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      throw res.status(400).json({message: 'Значение page или limit не валидно'});
    }

    // Вычисляем offset (смещение) для пагинации
    const offset = (page - 1) * limit;

    // Запрашиваем мероприятия с пагинацией
    const { count, rows: events } = await Event.findAndCountAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
      limit,
      offset,
    });

    // Отправляем ответ с данными и информацией о пагинации
    res.status(200).json({
      totalEvents: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Получение мероприятия по ID
const getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    });
    if (!event) {
      throw res.status(404).json({message: 'Мероприятие не найдено'});
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Создать мероприятие
const createEvent = async (req, res, next) => {
  const { title, description, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: 'Обязательные данные не переданы' });
  }

  try {
    // Получаем токен из заголовка
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    // Проверяем и расшифровываем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Расшифрованный токен:', decoded); // Выводим расшифрованный токен
    
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Неверный формат токена' });
    }
    
    const userId = decoded.id;

    const event = await Event.create({ 
      title, 
      description, 
      date, 
      createdBy: userId
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Токен истек' });
    }
    next(error);
  }
};

// Обновление мероприятия
const updateEvent = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, date, createdBy } = req.body;

  if (!title || !date || !createdBy) {
    throw res.status(400).json({message: 'Обязательные данные не переданы'});
  }

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      throw res.status(404).json({message: 'Мероприятие не найдено'});
    }
    await event.update({ title, description, date, createdBy });
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Удаление мероприятия
const deleteEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      throw res.status(404).json({message: 'Мероприятие не найдено'});
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};