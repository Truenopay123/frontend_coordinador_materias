import { BookOpen, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, UserPlus, Building2, Layers } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import api from '../api/axiosConfig'

type Materia = {
  id?: number
  nombre: string
  descripcion?: string
  activo: boolean
  profesorId?: number | null
  profesorNombre?: string | null
}

type Profesor = {
  id: number
  nombre: string
}

type Division = {
  id?: number
  nombre: string
  activo: boolean
  profesores?: string[]
}

type ProgramaEducativo = {
  id?: number
  programa: string
  divisionId?: number
}

export default function Coordinador() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<Materia>({ nombre: '', descripcion: '', activo: true, profesorId: null, profesorNombre: null })
  const [editingId, setEditingId] = useState<number | null>(null)
  const isEditing = useMemo(() => editingId !== null, [editingId])

  // Divisiones
  const [divisiones, setDivisiones] = useState<Division[]>([])
  const [divisionForm, setDivisionForm] = useState<Division>({ nombre: '', activo: true })
  const [editingDivisionId, setEditingDivisionId] = useState<number | null>(null)
  const isEditingDivision = useMemo(() => editingDivisionId !== null, [editingDivisionId])

  // Programas
  const [programas, setProgramas] = useState<ProgramaEducativo[]>([])
  const [programaForm, setProgramaForm] = useState<ProgramaEducativo>({ programa: '', divisionId: undefined })
  const [selectedDivisionForProgramas, setSelectedDivisionForProgramas] = useState<number | ''>('')

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [materiasRes, profesoresRes, divisionesRes] = await Promise.all([
        api.get<Materia[]>('/api/materias'),
        api.get<Profesor[]>('/api/usuarios/profesores'),
        api.get<Division[]>('/api/divisiones'),
      ])
      setMaterias(materiasRes.data)
      setProfesores(profesoresRes.data.map(p => ({ id: (p as any).id, nombre: (p as any).nombre })))
      setDivisiones(divisionesRes.data.map((d: any) => ({ id: d.id ?? d.divisionId, nombre: d.nombre, activo: d.activo ?? true, profesores: d.profesores ?? [] })))
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  function resetForm() {
    setForm({ nombre: '', descripcion: '', activo: true, profesorId: null, profesorNombre: null })
    setEditingId(null)
  }

  function resetDivisionForm() {
    setDivisionForm({ nombre: '', activo: true })
    setEditingDivisionId(null)
  }

  function resetProgramaForm() {
    setProgramaForm({ programa: '', divisionId: selectedDivisionForProgramas || undefined })
  }

  async function saveMateria() {
    try {
      setLoading(true)
      if (isEditing && editingId) {
        await api.put(`/api/materias/${editingId}`, form)
      } else {
        await api.post('/api/materias', form)
      }
      resetForm()
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar materia')
    } finally { setLoading(false) }
  }

  async function toggleActivo(m: Materia) {
    try {
      setLoading(true)
      await api.patch(`/api/materias/${m.id}/status`, null, { params: { activo: !m.activo } })
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al actualizar estado')
    } finally { setLoading(false) }
  }

  async function deleteMateria(id?: number) {
    if (!id) return
    if (!confirm('¿Eliminar esta materia?')) return
    try {
      setLoading(true)
      await api.delete(`/api/materias/${id}`)
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al eliminar materia')
    } finally { setLoading(false) }
  }

  async function asignarProfesor(materiaId?: number, profesorId?: number) {
    if (!materiaId || !profesorId) return
    try {
      setLoading(true)
      await api.post(`/api/materias/${materiaId}/asignar`, null, { params: { profesorId } })
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al asignar profesor')
    } finally { setLoading(false) }
  }

  // Divisiones: CRUD
  async function saveDivision() {
    try {
      setLoading(true)
      if (isEditingDivision && editingDivisionId) {
        await api.put(`/api/divisiones/${editingDivisionId}`, { nombre: divisionForm.nombre, activo: divisionForm.activo })
      } else {
        await api.post('/api/divisiones', { nombre: divisionForm.nombre, programasEducativos: [] })
      }
      resetDivisionForm()
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar división')
    } finally { setLoading(false) }
  }

  async function toggleDivision(div: Division) {
    try {
      setLoading(true)
      await api.put(`/api/divisiones/${div.id}/updateStatus`, { activo: !div.activo })
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al actualizar estado de división')
    } finally { setLoading(false) }
  }

  async function deleteDivision(id?: number) {
    if (!id) return
    if (!confirm('¿Eliminar esta división?')) return
    try {
      setLoading(true)
      await api.delete(`/api/divisiones/${id}`)
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al eliminar división')
    } finally { setLoading(false) }
  }

  // Programas: CRUD
  async function loadProgramasForDivision(divisionId: number) {
    try {
      setLoading(true)
      const res = await api.get<ProgramaEducativo[]>(`/api/programas/division/${divisionId}`)
      setProgramas(res.data.map((p: any) => ({ id: p.id, programa: p.programa, divisionId: divisionId })))
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar programas')
    } finally { setLoading(false) }
  }

  async function savePrograma() {
    if (!selectedDivisionForProgramas || typeof selectedDivisionForProgramas !== 'number') {
      setError('Selecciona una división para gestionar programas')
      return
    }
    try {
      setLoading(true)
      await api.post(`/api/programas/division/${selectedDivisionForProgramas}`, { programa: programaForm.programa })
      resetProgramaForm()
      await loadProgramasForDivision(selectedDivisionForProgramas)
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar programa')
    } finally { setLoading(false) }
  }

  async function updatePrograma(p: ProgramaEducativo) {
    try {
      setLoading(true)
      await api.put(`/api/programas/${p.id}`, { id: p.id, programa: p.programa })
      await loadProgramasForDivision(p.divisionId!)
    } catch (e: any) {
      setError(e?.message ?? 'Error al actualizar programa')
    } finally { setLoading(false) }
  }

  async function deletePrograma(id?: number) {
    if (!id) return
    if (!confirm('¿Eliminar este programa educativo?')) return
    try {
      setLoading(true)
      await api.delete(`/api/programas/${id}`)
      if (typeof selectedDivisionForProgramas === 'number') await loadProgramasForDivision(selectedDivisionForProgramas)
    } catch (e: any) {
      setError(e?.message ?? 'Error al eliminar programa')
    } finally { setLoading(false) }
  }

  async function asignarProfesorADivision(divisionId: number, profesorId: number) {
    try {
      setLoading(true)
      await api.post(`/api/divisiones/${divisionId}/asignar`, null, { params: { profesorId } })
      await loadData()
    } catch (e: any) {
      setError(e?.message ?? 'Error al asignar profesor a división')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="text-purple-600" size={48} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Materias</h1>
              <p className="text-gray-600">Crear, editar, habilitar/deshabilitar y asignar profesor</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded p-3">{error}</div>
          )}

          {/* Formulario de creación/edición */}
          <div className="border rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">{isEditing ? 'Editar materia' : 'Nueva materia'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="border rounded p-2" placeholder="Nombre"
                     value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <input className="border rounded p-2" placeholder="Descripción (opcional)"
                     value={form.descripcion ?? ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              <select className="border rounded p-2" value={form.profesorId ?? ''}
                      onChange={e => setForm({ ...form, profesorId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">Sin profesor asignado</option>
                {profesores.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2" onClick={saveMateria} disabled={loading}>
                {isEditing ? <Pencil size={18} /> : <Plus size={18} />} {isEditing ? 'Guardar cambios' : 'Crear materia'}
              </button>
              {isEditing && (
                <button className="border px-4 py-2 rounded" onClick={resetForm} disabled={loading}>Cancelar</button>
              )}
            </div>
          </div>

          {/* Listado de materias */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Listado de materias</h2>
              <button className="border px-3 py-1 rounded" onClick={loadData} disabled={loading}>Actualizar</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Descripción</th>
                    <th className="p-2">Estado</th>
                    <th className="p-2">Profesor</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {materias.map(m => (
                    <tr key={m.id} className="border-t">
                      <td className="p-2">{m.nombre}</td>
                      <td className="p-2">{m.descripcion ?? '-'}</td>
                      <td className="p-2">
                        <span className={m.activo ? 'text-green-600' : 'text-gray-500'}>
                          {m.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-2">{m.profesorNombre ?? '-'}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => { setEditingId(m.id!); setForm({ nombre: m.nombre, descripcion: m.descripcion, activo: m.activo, profesorId: m.profesorId ?? null, profesorNombre: m.profesorNombre ?? null }) }}>
                            <Pencil size={16} /> Editar
                          </button>
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => toggleActivo(m)}>
                            {m.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />} {m.activo ? 'Deshabilitar' : 'Habilitar'}
                          </button>
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => deleteMateria(m.id)}>
                            <Trash2 size={16} /> Eliminar
                          </button>
                          <div className="flex items-center gap-2">
                            <UserPlus size={16} />
                            <select className="border rounded p-1" value={m.profesorId ?? ''} onChange={e => asignarProfesor(m.id, e.target.value ? Number(e.target.value) : undefined)}>
                              <option value="">Seleccionar profesor</option>
                              {profesores.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gestión de Divisiones */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-blue-600" />
              <h2 className="text-xl font-semibold">Gestión de Divisiones</h2>
            </div>
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">{isEditingDivision ? 'Editar división' : 'Nueva división'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="border rounded p-2" placeholder="Nombre"
                       value={divisionForm.nombre} onChange={e => setDivisionForm({ ...divisionForm, nombre: e.target.value })} />
                <select className="border rounded p-2" value={divisionForm.activo ? 'true' : 'false'} onChange={e => setDivisionForm({ ...divisionForm, activo: e.target.value === 'true' })}>
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2" onClick={saveDivision} disabled={loading}>
                  {isEditingDivision ? <Pencil size={18} /> : <Plus size={18} />} {isEditingDivision ? 'Guardar cambios' : 'Crear división'}
                </button>
                {isEditingDivision && (
                  <button className="border px-4 py-2 rounded" onClick={resetDivisionForm} disabled={loading}>Cancelar</button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Estado</th>
                    <th className="p-2">Profesores</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {divisiones.map(d => (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.nombre}</td>
                      <td className="p-2"><span className={d.activo ? 'text-green-600' : 'text-gray-500'}>{d.activo ? 'Activa' : 'Inactiva'}</span></td>
                      <td className="p-2">
                        {d.profesores && d.profesores.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {d.profesores.map((nombre, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{nombre}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => { setEditingDivisionId(d.id!); setDivisionForm({ nombre: d.nombre, activo: d.activo }) }}>
                            <Pencil size={16} /> Editar
                          </button>
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => toggleDivision(d)}>
                            {d.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />} {d.activo ? 'Deshabilitar' : 'Habilitar'}
                          </button>
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => deleteDivision(d.id)}>
                            <Trash2 size={16} /> Eliminar
                          </button>
                          <div className="flex items-center gap-2">
                            <UserPlus size={16} />
                            <select
                              className="border rounded p-1"
                              onChange={e => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                if (!val) return;
                                asignarProfesorADivision(d.id!, val);
                                e.currentTarget.selectedIndex = 0;
                              }}
                            >
                              <option value="">Asignar profesor</option>
                              {profesores.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Programas Educativos por División */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="text-teal-600" />
              <h2 className="text-xl font-semibold">Programas Educativos</h2>
            </div>
            <div className="border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="border rounded p-2" value={selectedDivisionForProgramas}
                        onChange={e => { const val = e.target.value ? Number(e.target.value) : ''; setSelectedDivisionForProgramas(val as any); if (typeof val === 'number') { loadProgramasForDivision(val) } else { setProgramas([]) } }}>
                  <option value="">Selecciona división</option>
                  {divisiones.map(d => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
                <input className="border rounded p-2" placeholder="Nombre del programa"
                       value={programaForm.programa}
                       onChange={e => setProgramaForm({ ...programaForm, programa: e.target.value })} />
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center gap-2" onClick={savePrograma} disabled={loading || !selectedDivisionForProgramas}>
                  <Plus size={18} /> Agregar programa
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Programa</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {programas.map(p => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">
                        <input className="border rounded p-1 w-full" value={p.programa} onChange={e => setProgramas(prev => prev.map(x => x.id === p.id ? { ...x, programa: e.target.value } : x))} />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => updatePrograma(p)}>
                            <Pencil size={16} /> Guardar
                          </button>
                          <button className="border px-2 py-1 rounded flex items-center gap-1" onClick={() => deletePrograma(p.id)}>
                            <Trash2 size={16} /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}