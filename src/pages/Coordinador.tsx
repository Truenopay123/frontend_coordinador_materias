import { BookOpen } from 'lucide-react'

export default function Coordinador() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="text-purple-600" size={48} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Portal del Coordinador</h1>
              <p className="text-gray-600">Gestión de divisiones y profesores</p>
            </div>
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
            <p className="text-purple-800 font-medium">
              📚 Vista de coordinador en desarrollo
            </p>
            <p className="text-purple-700 mt-2">
              Aquí podrás gestionar divisiones, profesores y carreras.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}