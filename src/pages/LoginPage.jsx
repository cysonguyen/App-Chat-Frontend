import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

import { cn } from "../lib/utils"
import { Label, Input, Button } from "../components/ui"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      alert("Please enter username and password")
      return
    }
    try {
      await login({ username, password })
    } catch (error) {      
      console.error(error)
      alert("Invalid username or password")
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/chat")
    }
  }, [user, navigate])

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
          </div>
          <div className={cn("grid gap-2")}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Username: admin@prj.com"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="cursor-pointer">
                  Sign In
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center w-full">
              <Link
                to="/register"
                className=" text-sm text-muted-foreground hover:text-primary"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
