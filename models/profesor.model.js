import mongoose from 'mongoose'

const profesorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

export const Profesor = mongoose.model('Profesor', profesorSchema, 'profesores')
