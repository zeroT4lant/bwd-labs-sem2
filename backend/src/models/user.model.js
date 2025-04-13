import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  failed_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
  },
  is_locked: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false
  },
  lock_until: {
      type: DataTypes.DATE,
      allowNull: true
  },
  createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW // Дата создания по умолчанию
  }
}, {
  tableName: "users",
  timestamps: true,
});

User.beforeCreate(async (user) => {
  console.log('User data before creation:', user);

  if (!user.password || typeof user.password !== 'string') {
    throw new Error('Password is required and must be a string');
  }

  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
});

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


export default User;
