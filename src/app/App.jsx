import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { AuthProvider } from "../contexts/AuthContext"
import { SocketProvider } from "../contexts/SocketContext"
import { EventProvider } from "../contexts/EventContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <EventProvider>
            <RouterProvider router={router} />
          </EventProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App