export type TipoUsuario = 'COORDINADOR' | 'PROFESOR' | 'ALUMNO'

export interface Usuario {
  id: number
  nombre: string
  email: string
  tipoUsuario: TipoUsuario
  activo: boolean
  divisiones?: number[]
  matricula?: string
  carrera?: string
  semestre?: number
  areaCoordinacion?: string
  nivelAcceso?: string
}

export interface UsuarioEditDto {
  id: number
  nombre?: string
  email?: string
  tipoUsuario?: TipoUsuario
  activo?: boolean
  matricula?: string | null
  carrera?: string | null
  semestre?: number | null
  areaCoordinacion?: string | null
  nivelAcceso?: string | null
  divisiones?: number[] | null
}
