import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from "./layout/AppLayout";
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={
          <AppLayout
            role="Admin"
            name="Nombre del usuario"
            email="Correo electrónico del usuario"
          >
            {/* Contenido del dashboard */}
          </AppLayout>
        }/>
      </Routes>
    </Router>
  );
}

export default App;