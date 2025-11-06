import { useState, useEffect } from 'react'
import {
  User,
  Users,
  GraduationCap,
  BookOpen,
  Search,
  Trash2,
  Eye,
  RefreshCw,
  Filter,
  X,
  Pencil,
  Building,
  GraduationCap as Cap,
  Shield,
  Hash,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react'

import type { Usuario, UsuarioEditDto, TipoUsuario } from '../interfaces/usuario'
import { getUsuarios, updateUsuario, updateUsuarioStatus, deleteUsuario } from '../services/usuariosService'

export default function Admin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editableUsuario, setEditableUsuario] = useState<UsuarioEditDto | null>(null)
  const [filtro, setFiltro] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)

  useEffect(() => {
    cargarUsuarios()
  }, [filtro])

  const cargarUsuarios = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getUsuarios(filtro === 'TODOS' ? undefined : filtro)
      setUsuarios(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Simula el cambio local de estado
  const cambiarEstado = async (id: number, activo: boolean) => {
    // Optimistic update
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !activo } : u))
    try {
      await updateUsuarioStatus(id, !activo)
    } catch (err) {
      // revertir si hay error
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo } : u))
      alert('Error al actualizar estado: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    }
  }

  const eliminarUsuario = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return
    
    try {
      await deleteUsuario(id)
      setUsuarios(prev => prev.filter(u => u.id !== id))
      console.log(`Usuario ${id} eliminado`)
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    }
  }

  const verDetalles = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setMostrarModal(true)
  }

  const abrirEdicion = (usuario: Usuario) => {
    setIsEditing(true)
    setEditableUsuario({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      activo: usuario.activo,
      matricula: usuario.matricula ?? null,
      carrera: usuario.carrera ?? null,
      semestre: usuario.semestre ?? null,
      areaCoordinacion: usuario.areaCoordinacion ?? null,
      nivelAcceso: usuario.nivelAcceso ?? null,
      divisiones: usuario.divisiones ?? null,
    })
    setUsuarioSeleccionado(usuario)
    setMostrarModal(true)
  }

  const handleSaveEdicion = async () => {
    if (!editableUsuario) return
    try {
      const updated = await updateUsuario(editableUsuario)
      setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u))
      setMostrarModal(false)
      setIsEditing(false)
      setEditableUsuario(null)
    } catch (err) {
      alert('Error al guardar: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    }
  }

  const handleCancelEdicion = () => {
    setIsEditing(false)
    setEditableUsuario(null)
    // mantener los detalles si estaban abiertos
    // setMostrarModal(false)
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    (u.matricula?.toLowerCase().includes(busqueda.toLowerCase()) ?? false)
  )

  const stats = {
    total: usuarios.length,
    activos: usuarios.filter(u => u.activo).length,
    inactivos: usuarios.filter(u => !u.activo).length
  }

  const getTipoConfig = (tipo: string) => {
    const configs = {
      COORDINADOR: {
        color: 'from-purple-500 to-pink-500',
        bgLight: 'bg-purple-50',
        badge: 'bg-purple-100 text-purple-700 border border-purple-200',
        icon: <BookOpen size={20} />,
        iconBg: 'bg-gradient-to-br from-purple-400 to-pink-400'
      },
      PROFESOR: {
        color: 'from-blue-500 to-cyan-500',
        bgLight: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-700 border border-blue-200',
        icon: <User size={20} />,
        iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-400'
      },
      ALUMNO: {
        color: 'from-green-500 to-emerald-500',
        bgLight: 'bg-green-50',
        badge: 'bg-green-100 text-green-700 border border-green-200',
        icon: <GraduationCap size={20} />,
        iconBg: 'bg-gradient-to-br from-green-400 to-emerald-400'
      }
    }
    return configs[tipo as keyof typeof configs]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Premium */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 backdrop-blur-sm bg-white/90">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Panel de Administración
                  </h1>
                  <p className="text-slate-600 font-medium mt-1">Sistema de Gestión UTEQ</p>
                </div>
              </div>
            </div>
            <button 
              onClick={cargarUsuarios}
              className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-l-4 border-blue-500 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Total Usuarios</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl group-hover:scale-110 transition-transform">
                <Users className="text-blue-600" size={32} />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-l-4 border-green-500 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Activos</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                  {stats.activos}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-l-4 border-red-500 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">Inactivos</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mt-2">
                  {stats.inactivos}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl group-hover:scale-110 transition-transform">
                <XCircle className="text-red-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-slate-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-700">Filtros</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-3 flex-wrap">
              {['TODOS', 'COORDINADOR', 'PROFESOR', 'ALUMNO'].map(tipo => {
                const isActive = filtro === tipo
                const icons = {
                  TODOS: <Users size={18} />,
                  COORDINADOR: <BookOpen size={18} />,
                  PROFESOR: <User size={18} />,
                  ALUMNO: <GraduationCap size={18} />
                }
                
                return (
                  <button
                    key={tipo}
                    onClick={() => setFiltro(tipo)}
                    className={`group px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    {icons[tipo as keyof typeof icons]}
                    {tipo}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o matrícula..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <RefreshCw className="animate-spin mx-auto text-indigo-600 mb-4" size={56} />
            <p className="text-slate-600 text-lg font-semibold">Cargando usuarios...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <X className="text-red-600" size={24} />
            </div>
            <p className="text-red-700 font-semibold text-lg">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">ID</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Nombre</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Tipo</th>
                    <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wide">Activo</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Matrícula</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Carrera</th>
                    <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wide">Semestre</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Área Coord.</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">Nivel Acceso</th>
                    <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-16">
                        <Users className="mx-auto text-slate-300 mb-4" size={64} />
                        <p className="text-slate-500 text-lg font-semibold">No se encontraron usuarios</p>
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((usuario) => {
                      const config = getTipoConfig(usuario.tipoUsuario)
                      return (
                        <tr key={usuario.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Hash size={16} className="text-slate-500" />
                              <span className="font-bold text-slate-700">{usuario.id}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center text-white shadow-sm`}>
                                {config.icon}
                              </div>
                              <p className="font-semibold text-slate-800">{usuario.nombre}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{usuario.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${config.badge} shadow-sm`}>
                              {usuario.tipoUsuario}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => cambiarEstado(usuario.id, usuario.activo)}
                              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm hover:scale-105 ${
                                usuario.activo
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {usuario.activo ? 'Sí' : 'No'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{usuario.matricula || '-'}</td>
                          <td className="px-4 py-3 text-slate-700">{usuario.carrera || '-'}</td>
                          <td className="px-4 py-3 text-center">
                            {usuario.semestre ? (
                              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                                <Calendar size={14} /> {usuario.semestre}°
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{usuario.areaCoordinacion || '-'}</td>
                          <td className="px-4 py-3">
                            {usuario.nivelAcceso ? (
                              <div className="flex items-center gap-1">
                                <Shield size={14} className="text-purple-600" />
                                <span className="font-medium text-purple-700">{usuario.nivelAcceso}</span>
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => verDetalles(usuario)}
                                className="group p-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:scale-110"
                                title="Ver detalles"
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                onClick={() => abrirEdicion(usuario)}
                                className="group p-2.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:scale-110"
                                title="Editar"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() => eliminarUsuario(usuario.id)}
                                className="group p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:scale-110"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Detalles */}
        {mostrarModal && usuarioSeleccionado && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
              <div className={`bg-gradient-to-r ${getTipoConfig(usuarioSeleccionado.tipoUsuario).color} text-white p-8 rounded-t-3xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">Detalles del Usuario</h2>
                  <p className="text-white/90">Información completa del perfil</p>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                {isEditing && editableUsuario ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-600 font-bold mb-1">Nombre</label>
                        <input
                          value={editableUsuario.nombre ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, nombre: e.target.value } : prev)}
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 font-bold mb-1">Email</label>
                        <input
                          value={editableUsuario.email ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, email: e.target.value } : prev)}
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 font-bold mb-1">Tipo</label>
                        <select
                          value={editableUsuario.tipoUsuario ?? 'PROFESOR'}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, tipoUsuario: e.target.value as TipoUsuario } : prev)}
                          className="w-full px-4 py-3 border rounded-xl"
                        >
                          <option value="COORDINADOR">COORDINADOR</option>
                          <option value="PROFESOR">PROFESOR</option>
                          <option value="ALUMNO">ALUMNO</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Activo</label>
                        <input
                          type="checkbox"
                          checked={!!editableUsuario.activo}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, activo: e.target.checked } : prev)}
                        />
                      </div>
                    </div>

                    {/* Campos específicos según tipo */}
                    {editableUsuario.tipoUsuario === 'ALUMNO' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          placeholder="Matrícula"
                          value={editableUsuario.matricula ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, matricula: e.target.value } : prev)}
                          className="px-4 py-3 border rounded-xl"
                        />
                        <input
                          placeholder="Carrera"
                          value={editableUsuario.carrera ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, carrera: e.target.value } : prev)}
                          className="px-4 py-3 border rounded-xl"
                        />
                        <input
                          type="number"
                          placeholder="Semestre"
                          value={editableUsuario.semestre ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, semestre: e.target.value ? Number(e.target.value) : null } : prev)}
                          className="px-4 py-3 border rounded-xl"
                        />
                      </div>
                    )}

                    {editableUsuario.tipoUsuario === 'COORDINADOR' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          placeholder="Área de Coordinación"
                          value={editableUsuario.areaCoordinacion ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, areaCoordinacion: e.target.value } : prev)}
                          className="px-4 py-3 border rounded-xl"
                        />
                        <input
                          placeholder="Nivel de Acceso"
                          value={editableUsuario.nivelAcceso ?? ''}
                          onChange={(e) => setEditableUsuario(prev => prev ? { ...prev, nivelAcceso: e.target.value } : prev)}
                          className="px-4 py-3 border rounded-xl"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={handleCancelEdicion}
                        className="px-6 py-3 rounded-xl bg-slate-100 font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveEdicion}
                        className="px-6 py-3 rounded-xl bg-amber-600 text-white font-bold"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Hash size={14} /> ID
                        </p>
                        <p className="text-2xl font-bold text-slate-800">#{usuarioSeleccionado.id}</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wide mb-1">Tipo</p>
                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${getTipoConfig(usuarioSeleccionado.tipoUsuario).badge}`}>
                          {usuarioSeleccionado.tipoUsuario}
                        </span>
                      </div>
                      <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wide mb-1">Nombre Completo</p>
                        <p className="text-xl font-bold text-slate-800">{usuarioSeleccionado.nombre}</p>
                      </div>
                      <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wide mb-1">Email</p>
                        <p className="text-lg text-slate-700 font-medium">{usuarioSeleccionado.email}</p>
                      </div>

                      {/* Campos específicos */}
                      {usuarioSeleccionado.matricula && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border-2 border-indigo-200">
                          <p className="text-xs text-indigo-700 font-bold uppercase tracking-wide mb-1">Matrícula</p>
                          <p className="text-xl font-bold text-indigo-900">{usuarioSeleccionado.matricula}</p>
                        </div>
                      )}

                      {usuarioSeleccionado.carrera && (
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-2xl border-2 border-teal-200">
                          <p className="text-xs text-teal-700 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                            <Cap size={14} /> Carrera
                          </p>
                          <p className="text-lg font-semibold text-teal-900">{usuarioSeleccionado.carrera}</p>
                        </div>
                      )}

                      {usuarioSeleccionado.semestre && (
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-2xl border-2 border-emerald-200">
                          <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                            <Calendar size={14} /> Semestre
                          </p>
                          <p className="text-2xl font-bold text-emerald-900">{usuarioSeleccionado.semestre}°</p>
                        </div>
                      )}

                      {usuarioSeleccionado.areaCoordinacion && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200">
                          <p className="text-xs text-purple-700 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                            <Building size={14} /> Área de Coordinación
                          </p>
                          <p className="text-lg font-semibold text-purple-900">{usuarioSeleccionado.areaCoordinacion}</p>
                        </div>
                      )}

                      {usuarioSeleccionado.nivelAcceso && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border-2 border-amber-200">
                          <p className="text-xs text-amber-700 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                            <Shield size={14} /> Nivel de Acceso
                          </p>
                          <p className="text-xl font-bold text-amber-900">{usuarioSeleccionado.nivelAcceso}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setMostrarModal(false)}
                        className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}