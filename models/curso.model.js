import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// MODELO — Curso. El más importante: aquí viven las RELACIONES.
// ---------------------------------------------------------------------------
const cursoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaTermino: { type: Date, required: true },
    estado: { type: String, enum: ['EN_MATRICULA', 'CERRADO'], default: 'EN_MATRICULA' },
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', default: null },
    alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' }],
  },
  { timestamps: true },
)

export const Curso = mongoose.model('Curso', cursoSchema, 'cursos')
