import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Home as HomeIcon, Users, GraduationCap, BookOpen, User, LogIn } from 'lucide-react'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import Alumno from './pages/Alumno'
import Coordinador from './pages/Coordinador'
import Profesor from './pages/Profesor'
import Registro from './pages/Registro'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navegación */}
        <nav className="bg-indigo-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-bold">UTEQ</Link>
                <div className="flex gap-4">
                  <Link to="/" className="hover:bg-indigo-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <HomeIcon size={18} />
                    Inicio
                  </Link>
                  <Link to="/admin" className="hover:bg-indigo-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <Users size={18} />
                    Admin
                  </Link>
                  <Link to="/profesor" className="hover:bg-indigo-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <User size={18} />
                    Profesor
                  </Link>
                  <Link to="/alumno" className="hover:bg-indigo-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <GraduationCap size={18} />
                    Alumno
                  </Link>
                  <Link to="/coordinador" className="hover:bg-indigo-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <BookOpen size={18} />
                    Coordinador
                  </Link>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/login" className="hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Link>
                <Link to="/registro" className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium">
                  Registro
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/alumno" element={<Alumno />} />
          <Route path="/coordinador" element={<Coordinador />} />
          <Route path="/profesor" element={<Profesor />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App