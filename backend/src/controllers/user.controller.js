const { User } = require('../models');

// Создание пользователя
const createUser = async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({message: 'email и имя обязательны'});
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({message: 'Такой email уже есть'});
    }

    const newUser = await User.create({ name, email });
    res.status(201).json({ message: 'Пользователь успешно создан', user: newUser });
  } catch (error) {
    next(error);
  }
};

// Получение пользователя по ID
const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({message: 'Пользователь не найден'});
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUserById,
};
