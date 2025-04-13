import { User } from '../models/index.js';

// Создание пользователя
const createUser = async (req, res, next) => {
  const { name, email,password } = req.body;

  if (!name || !email || !password)  {
    return res.status(400).json({message: 'email, имя и пароль обязательны'});
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({message: 'Такой email уже есть'});
    }

    const newUser = await User.create({ name, email, password });
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

export {
  createUser,
  getUserById,
};

