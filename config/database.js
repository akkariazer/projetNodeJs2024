const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion à MongoDB établie');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;