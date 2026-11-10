import dotenv from 'dotenv';
import app from './app.js';
import { conectarMongoDB } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await conectarMongoDB();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
};

iniciarServidor();
