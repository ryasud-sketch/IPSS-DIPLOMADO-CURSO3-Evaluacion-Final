import { Curso } from '../models/curso.model.js'

// ---------------------------------------------------------------------------
// SERVICE — cursos. Habla con la base de datos.
// Las REGLAS DE NEGOCIO (validar estado, propiedad, etc.) pueden ir aquí o en
// el controller: tú decides, pero que estén en el servidor, no en el cliente.
// ---------------------------------------------------------------------------

export const listarCursos = async () => {
  return await Curso.find()
    .populate('profesor', '-password')
    .populate('alumnos', '-password')
}

export const crearCurso = async (datos) => {
  const curso = await Curso.create({
    nombre: datos.nombre,
    fechaInicio: datos.fechaInicio,
    fechaTermino: datos.fechaTermino,
    estado: 'EN_MATRICULA',
  })
  return await curso.populate('alumnos', '-password')
}

export const buscarCurso = async (id) => {
  return await Curso.findById(id)
    .populate('profesor', '-password')
    .populate('alumnos', '-password')
}

export const editarCurso = async (id, datos) => {
  const curso = await Curso.findByIdAndUpdate(id, datos, { new: true })
    .populate('profesor', '-password')
    .populate('alumnos', '-password')
  if (!curso) throw new Error('Curso no encontrado')
  return curso
}

export const borrarCurso = async (id) => {
  const curso = await Curso.findByIdAndDelete(id)
  if (!curso) throw new Error('Curso no encontrado')
  return curso
}

export const cursosDelProfesor = async (profesorId) => {
  return await Curso.find({ profesor: profesorId })
    .populate('profesor', '-password')
    .populate('alumnos', '-password')
}

export const asignarProfesor = async (cursoId, profesorId) => {
  const curso = await Curso.findById(cursoId)
  if (!curso) throw new Error('Curso no encontrado')
  if (curso.profesor) throw new Error('El curso ya tiene profesor asignado')
  curso.profesor = profesorId
  await curso.save()
  return await curso.populate('profesor', '-password')
}

export const alumnosDelCurso = async (cursoId, profesorId) => {
  const curso = await Curso.findById(cursoId).populate('alumnos', '-password')
  if (!curso) throw new Error('Curso no encontrado')
  if (String(curso.profesor) !== String(profesorId))
    throw new Error('No tienes permiso para ver los alumnos de este curso')
  return curso.alumnos
}

export const matricularAlumno = async (cursoId, alumnoId) => {
  const curso = await Curso.findById(cursoId)
  if (!curso) throw new Error('Curso no encontrado')
  if (curso.estado !== 'EN_MATRICULA') throw new Error('El curso está cerrado')
  if (curso.alumnos.includes(alumnoId)) throw new Error('Ya estás matriculado en este curso')
  curso.alumnos.push(alumnoId)
  await curso.save()
  return await curso.populate('profesor', '-password').populate('alumnos', '-password')
}

export const desmatricularAlumno = async (cursoId, alumnoId) => {
  const curso = await Curso.findById(cursoId)
  if (!curso) throw new Error('Curso no encontrado')
  if (curso.estado !== 'EN_MATRICULA') throw new Error('El curso está cerrado')
  curso.alumnos = curso.alumnos.filter((id) => String(id) !== String(alumnoId))
  await curso.save()
  return await curso.populate('profesor', '-password').populate('alumnos', '-password')
}

export const cursosDelAlumno = async (alumnoId) => {
  return await Curso.find({ alumnos: alumnoId })
    .populate('profesor', '-password')
    .populate('alumnos', '-password')
}
