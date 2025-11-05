import { Users, GraduationCap, BookOpen, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Sistema de Gestión UTEQ
          </h1>
          <p className="text-xl text-gray-600">
            Plataforma integral para la administración académica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Users className="text-indigo-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Administrador</h3>
            <p className="text-gray-600">Gestión completa de usuarios del sistema</p>
          </Link>

          <Link to="/coordinador" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <BookOpen className="text-purple-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Coordinador</h3>
            <p className="text-gray-600">Coordinación académica y divisiones</p>
          </Link>

          <Link to="/profesor" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <User className="text-blue-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Profesor</h3>
            <p className="text-gray-600">Portal para profesores</p>
          </Link>

          <Link to="/alumno" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <GraduationCap className="text-green-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Alumno</h3>
            <p className="text-gray-600">Portal estudiantil</p>
          </Link>
        </div>
      </div>
    </div>
  )
}