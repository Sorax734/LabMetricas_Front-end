import { AppLayout } from "../layout/AppLayout"
import { Outlet } from "react-router-dom"

function App() {
  const user = {
      name: "Usuario",
      lastName: "Apellido",
      email: "usuarioapellido@gmail.com",
      role: "ADMIN",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  }

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