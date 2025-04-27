import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@models/index';

// Интерфейсы для типов
interface RegisterUserBody {
  email: string;
  password: string;
  name: string;
}

interface LoginUserBody {
  email: string;
  password: string;
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}

// Эндпоинт для регистрации
const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
) => {
  const { email, password, name } = req.body;

  // Проверка на заполнение всех полей
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Неверный формат email' });
  }

  try {
    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email уже используется' });
    }

    // Создание пользователя
    const user = await User.create({
      email,
      password,
      name,
      failed_attempts: 0,
      is_locked: false,
      lock_until: null,
    });

    res.status(201).json({
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors
        .map((err: { message: string }) => err.message)
        .join(', ');
      return res.status(400).json({ message: `Ошибка валидации: ${messages}` });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email уже существует' });
    }

    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Эндпоинт для авторизации
const loginUser = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  try {
    const user = await User.findOne({ where: { email: trimmedEmail } });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка блокировки аккаунта
    const now = new Date();
    if (user.is_locked && user.lock_until && now < user.lock_until) {
      const remainingMinutes = Math.ceil(
        (user.lock_until.getTime() - now.getTime()) / (60 * 1000),
      );
      return res.status(403).json({
        message: `Аккаунт заблокирован. Попробуйте через ${remainingMinutes} минут.`,
      });
    }

    // Сброс блокировки
    if (user.is_locked && user.lock_until && now >= user.lock_until) {
      await user.update({
        is_locked: false,
        failed_attempts: 0,
        lock_until: null,
      });
    }

    // Проверка пароля
    const isMatch = await user.validPassword(trimmedPassword);
    if (!isMatch) {
      const newAttempts = user.failed_attempts + 1;
      const shouldLock = newAttempts >= 5;

      await user.update({
        failed_attempts: newAttempts,
        ...(shouldLock && {
          is_locked: true,
          lock_until: new Date(Date.now() + 30 * 60 * 1000), // 30 минут
        }),
      });

      if (shouldLock) {
        return res.status(403).json({
          message: 'Аккаунт заблокирован. Попробуйте через 30 минут.',
        });
      }

      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Успешная аутентификация
    await user.update({ failed_attempts: 0 });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET не настроен');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export { registerUser, loginUser };
