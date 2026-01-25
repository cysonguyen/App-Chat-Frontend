import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react"

export default function MainLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login")
    }
  }, [user, location.pathname, navigate])

  if (location.pathname === "/login") {
    return <Outlet />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link className="font-semibold" to="/login">
            App Chat
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">Hello, {user.fullName}</span>
            <button
              className="px-3 py-1 border rounded text-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Guest</span>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
