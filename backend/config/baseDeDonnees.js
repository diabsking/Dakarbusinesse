import mongoose from "mongoose";

const connecterBaseDeDonnees = async () => {
  try {
    const connexion = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🟢 MongoDB connecté : ${connexion.connection.host}`);
  } catch (erreur) {
    console.error("🔴 Erreur connexion MongoDB :", erreur.message);
    process.exit(1); // Stop serveur si DB échoue
  }
};

export default connecterBaseDeDonnees;
