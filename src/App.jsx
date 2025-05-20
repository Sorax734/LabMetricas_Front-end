import { AppLayout } from "./layout/AppLayout"

function App() {

  return (
    <>
      <AppLayout
        role="Admin"
        name="Nombre del usuario"
        email="Correo electrónico del usuario"
      >
        <div className='w-full h-full'>
          <p>Contenido</p>
        </div>
      </AppLayout>
    </>
  )
}

export default App