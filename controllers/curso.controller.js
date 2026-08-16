import * as service from '../services/curso.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — cursos. Aquí viven las reglas de negocio.
// El id y el rol del usuario que hace la petición vienen en req.usuario
// (lo puso el middleware `proteger` desde el token).
// ---------------------------------------------------------------------------

// GET /api/cursos — todos los cursos (con populate de profesor y alumnos).
export const listar = async (req, res) => {
  try {
    const cursos = await service.listarCursos()
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos — crea un curso (nace EN_MATRICULA, sin profesor).
export const crear = async (req, res) => {
  try {
    const curso = await service.crearCurso(req.body)
    res.status(201).json(curso)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// PUT /api/cursos/:id — edita un curso.
export const editar = async (req, res) => {
  try {
    const curso = await service.editarCurso(req.params.id, req.body)
    res.json(curso)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id — borra un curso.
export const borrar = async (req, res) => {
  try {
    await service.borrarCurso(req.params.id)
    res.json({ ok: true })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/mis-cursos — los cursos que dicta ESTE profesor.
export const misCursos = async (req, res) => {
  try {
    const cursos = await service.cursosDelProfesor(req.usuario.id)
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/asignarme — el profesor se asigna un curso libre.
export const asignarme = async (req, res) => {
  try {
    const curso = await service.asignarProfesor(req.params.id, req.usuario.id)
    res.json(curso)
  } catch (error) {
    if (error.message.includes('ya tiene profesor'))
      return res.status(409).json({ error: error.message })
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/:id/alumnos — solo el profesor que dicta el curso.
export const alumnosDelCurso = async (req, res) => {
  try {
    const alumnos = await service.alumnosDelCurso(req.params.id, req.usuario.id)
    res.json(alumnos)
  } catch (error) {
    if (error.message.includes('No tienes permiso'))
      return res.status(403).json({ error: error.message })
    res.status(500).json({ error: error.message })
  }
}

// GET /api/cursos/mis-matriculas — los cursos donde está matriculado ESTE alumno.
export const misMatriculas = async (req, res) => {
  try {
    const cursos = await service.cursosDelAlumno(req.usuario.id)
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/matricularme — el alumno se matricula a sí mismo.
export const matricularme = async (req, res) => {
  try {
    const curso = await service.matricularAlumno(req.params.id, req.usuario.id)
    res.status(201).json(curso)
  } catch (error) {
    if (error.message.includes('cerrado') || error.message.includes('Ya estás'))
      return res.status(409).json({ error: error.message })
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id/matricularme — el alumno se sale del curso.
export const desmatricularme = async (req, res) => {
  try {
    const curso = await service.desmatricularAlumno(req.params.id, req.usuario.id)
    res.json(curso)
  } catch (error) {
    if (error.message.includes('cerrado'))
      return res.status(409).json({ error: error.message })
    res.status(400).json({ error: error.message })
  }
}
