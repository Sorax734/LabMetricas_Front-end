import { AppLayout } from "../layout/AppLayout"
import { Outlet } from "react-router-dom"

function App() {

  return (
    <>
      <AppLayout
        role="Admin"
        name="Nombre del usuario"
        email="Correo electrónico del usuario"
      >
        <Outlet/>
      </AppLayout>
    </>
  )
}

export default App