import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema({
  stage_name: { type: String, required: true }, // Nombre artístico
  full_name: { type: String, required: true },  // Nombre real
  specialty: { type: String, required: true },  // Ej: Teatro, Cine, Comedia cordobesa
  neighborhood: { type: String, default: 'Centro' }, // Barrio de Córdoba Capital
  contact_email: { type: String, required: true }
});

export const Actor = mongoose.model('Actor', actorSchema);