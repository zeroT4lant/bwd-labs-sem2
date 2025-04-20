import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { Dialect } from 'sequelize';

// Загружаем переменные окружения
config();

// Интерфейс для конфигурации базы данных
interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
  port: number;
}

// Получаем и проверяем переменные окружения
const getDbConfig = (): DatabaseConfig => {
  const dbPort = parseInt(process.env.DB_PORT || '5432');

  if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_HOST) {
    throw new Error(
      'Необходимые переменные окружения для базы данных не установлены',
    );
  }

  return {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: dbPort,
  };
};

// Создаем экземпляр Sequelize
const sequelize = new Sequelize(
  getDbConfig().database,
  getDbConfig().username,
  getDbConfig().password,
  {
    host: getDbConfig().host,
    dialect: getDbConfig().dialect,
    port: getDbConfig().port,
    logging: false,
  },
);

// Функция для тестирования подключения
const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    process.exit(1); // Завершаем процесс с ошибкой
  }
};

export { sequelize, testConnection };
