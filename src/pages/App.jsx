import { AppLayout } from "../layout/AppLayout"
import { Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function App() {
  const { user } = useAuth();
  if (!user) return null; // O un loader

  return (
    <>
      <AppLayout
        user={user}
      >
        <Outlet/>
      </AppLayout>
    </>
  )
}

export default App