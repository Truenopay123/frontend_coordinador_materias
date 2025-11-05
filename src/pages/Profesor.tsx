import { User } from 'lucide-react'

export default function Profesor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <User className="text-blue-600" size={48} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Portal del Profesor</h1>
              <p className="text-gray-600">Gestión de materias y alumnos</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <p className="text-blue-800 font-medium">
              👨‍🏫 Vista de profesor en desarrollo
            </p>
            <p className="text-blue-700 mt-2">
              Aquí podrás gestionar tus materias, calificaciones y asistencias.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}