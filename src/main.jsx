import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { useAuth } from './hooks/useAuth.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { Login } from './pages/Login.jsx';

import App from './pages/App.jsx';
import { Home } from './pages/Home.jsx';
import { Profile } from './pages/Profile.jsx';
import { Users } from './pages/Users.jsx';
import HomeAdmin from './pages/HomeAdmin.jsx';
import HomeSupervisor from './pages/HomeSupervisor.jsx';
import HomeOperador from './pages/HomeOperador.jsx';

function ProtectedRoute({ children, allowedRoles }) {
	const { user } = useAuth();
	if (!user) {
		return <Login />;
	}
	if (allowedRoles && !allowedRoles.includes(user.role)) {
		// Redirigir a la home de su rol
		switch (user.role) {
			case 'ADMIN': return <HomeAdmin />;
			case 'SUPERVISOR': return <HomeSupervisor />;
			case 'OPERADOR': return <HomeOperador />;
			default: return <Home />;
		}
	}
	return children;
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<StrictMode>
			<AuthProvider>
				<HeroUIProvider locale="es-MX">
					<Routes>
						<Route path='/' element={ <Outlet/> } >
							<Route index element={ <LandingPage/> } />
							<Route path='Login' element={ <Login/> } />
							<Route path='App' element={ <App/> }>
								<Route index element={
									<ProtectedRoute allowedRoles={['ADMIN']}>
										<HomeAdmin />
									</ProtectedRoute>
								}/>
								<Route path='Profile' element={ <Profile/> }/>
								<Route path='Users' element={
									<ProtectedRoute allowedRoles={['ADMIN']}>
										<Users />
									</ProtectedRoute>
								}/>
								<Route path='supervisor' element={
									<ProtectedRoute allowedRoles={['SUPERVISOR']}>
										<HomeSupervisor />
									</ProtectedRoute>
								}/>
								<Route path='operador' element={
									<ProtectedRoute allowedRoles={['OPERADOR']}>
										<HomeOperador />
									</ProtectedRoute>
								}/>
							</Route>
						</Route>
					</Routes>
				</HeroUIProvider>
			</AuthProvider>
		</StrictMode>
	</BrowserRouter>
)
