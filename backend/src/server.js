require('dotenv').config();
const app = require('./app');
const { sequelize, testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();
  await sequelize.sync({ alter: true });
  
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});
startServer();
