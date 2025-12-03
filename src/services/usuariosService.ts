import api from '../api/axiosConfig'
import type { Usuario, UsuarioEditDto } from '../interfaces/usuario'

const base = '/api/usuarios'



export async function getUsuarios(filtro?: string): Promise<Usuario[]> {
  let url = base
  if (filtro === 'COORDINADOR') url = `${base}/coordinadores`
  else if (filtro === 'PROFESOR') url = `${base}/profesores`
  else if (filtro === 'ALUMNO') url = `${base}/alumnos`

  const res = await api.get<Usuario[]>(url)
  return res.data
}

export async function updateUsuario(usuario: UsuarioEditDto): Promise<Usuario> {
  // Asegurar que el payload tenga la forma esperada por el backend.
  // Si es profesor, conservamos las divisiones existentes (si no vienen en el DTO)
  if (usuario.tipoUsuario === 'PROFESOR') {
    if (!usuario.divisiones) {
      try {
        const usuarioActual = await api.get<Usuario>(`${base}/${usuario.id}`)
        usuario.divisiones = usuarioActual.data.divisiones ?? null
      } catch (error) {
        console.warn('No se pudieron obtener divisiones actuales:', error)
      }
    }
  } else {
    // Si NO es profesor, forzamos divisiones = null para indicarle al backend
    // que elimine/ignore cualquier relación previa (previene orphan errors)
    usuario.divisiones = null
  }

  // Enviar la petición de actualización
  const res = await api.put<Usuario>(`${base}/${usuario.id}`, usuario)
  return res.data
}

export async function updateUsuarioStatus(id: number, activo: boolean): Promise<Usuario> {
  const res = await api.patch<Usuario>(`${base}/${id}/status`, null, { params: { activo } })
  return res.data
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`${base}/${id}`)
}

export async function createUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
  // El backend espera la entidad completa según su DTO; enviamos los campos proporcionados.
  const res = await api.post<Usuario>(base, usuario)
  return res.data
}