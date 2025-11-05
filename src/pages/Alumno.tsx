import { GraduationCap } from 'lucide-react'

export default function Alumno() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <GraduationCap className="text-green-600" size={48} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Portal del Alumno</h1>
              <p className="text-gray-600">Acceso a tus materias y calificaciones</p>
            </div>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <p className="text-green-800 font-medium">
              🎓 Vista de alumno en desarrollo
            </p>
            <p className="text-green-700 mt-2">
              Aquí podrás ver tus materias, calificaciones y horarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}