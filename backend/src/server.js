import './config/env.js';
import app from './app.js';
import { sequelize, testConnection } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();
  await sequelize.sync({ alter: true });
  
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
app.get('/', (res) => {
  res.json({ message: 'Server is running!' });
});
startServer();
