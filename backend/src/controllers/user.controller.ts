import { Request, Response, NextFunction } from 'express';
import { User } from '@models/index';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
}

const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  const { firstName, lastName, gender, birthDate, email, password } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: 'email, имя и пароль обязательны' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Такой email уже есть' });
    }

    // Создаем пользователя со всеми обязательными полями
    const newUser = await User.create({
      firstName,
      lastName,
      gender,
      birthDate,
      email,
      password,
      failed_attempts: 0, // Добавляем обязательные поля
      is_locked: false, // из вашей модели
      lock_until: null,
    });

    res.status(201).json({
      message: 'Пользователь успешно создан',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: newUser.firstName + ' ' + newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Получение пользователя по ID (остается без изменений)
const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({
      id: user.id,
      name: user.firstName,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};


export { createUser, getUserById };
