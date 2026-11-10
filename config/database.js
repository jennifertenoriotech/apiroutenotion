import mongoose from 'mongoose';

const conectarMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI no esta configurado');
    }

    await mongoose.connect(mongoUri);

    console.log('Conexion a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

export { conectarMongoDB };
