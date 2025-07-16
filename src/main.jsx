import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { useAuth } from './hooks/useAuth.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { Login } from './pages/Login.jsx';

import { AppLayout } from './layouts/AppLayout.jsx';
import { Home } from './pages/Home.jsx';
import { Profile } from './pages/Profile.jsx';
import { Users } from './pages/Users.jsx';
import { DismissFilled } from '@fluentui/react-icons';
import { MaintenanceCalibration } from './pages/MaintenanceCalibration.jsx';
import { Logs } from './pages/Logs.jsx';
import { Equipments } from './pages/Equipments.jsx';
import { Customers } from './pages/Customers.jsx';

function ProtectedRoute({ allowedRoles = [], children }) {
	const { user } = useAuth()
	
	if (!user) {
		return <Navigate to="/Login" replace/>
	}
	
	if (allowedRoles.length === 0) {
		return children
	}

	if (!allowedRoles.includes(user.role)) {
		return <Navigate to="/App" replace />
	}

	return children
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<HeroUIProvider locale="es-MX">
					<ToastProvider
						placement="bottom-left"
						toastOffset={60}
						maxVisibleToasts={2}
						toastProps={{
							variant: "flat",
							radius: "sm",
							closeIcon: <DismissFilled className='size-5'/>,
							shouldShowTimeoutProgress: true,
							classNames: {
								title: "pr-6",
								description: "pr-6",
								closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 ml-4",
								progressIndicator: "h-1 rounded-full opacity-100",
								base: "transition-colors !duration-1000 ease-in-out bg-background",
							},
						}}
					/>
					<Routes>
						<Route path='/' element={ <Outlet/> } >
							<Route index element={ <LandingPage/> } />
							<Route path='Login' element={ <Login/> } />

							<Route
								path='App'
								element={
									<ProtectedRoute allowedRoles={[]}>
										<AppLayout />
									</ProtectedRoute>
								}
							>
								<Route
									index
									element={
										<ProtectedRoute allowedRoles={[]}>
											<Home />
										</ProtectedRoute>
									}
								/>
								<Route
									path='Profile'
									element={
										<ProtectedRoute allowedRoles={[]}>
											<Profile />
										</ProtectedRoute>
									}
								/>
								<Route
									path='Equipments'
									element={
										<ProtectedRoute allowedRoles={[]}>
											<Equipments />
										</ProtectedRoute>
									}
								/>
								<Route
									path='Users'
									element={
										<ProtectedRoute allowedRoles={['ADMIN']}>
											<Users />
										</ProtectedRoute>
									}
								/>
								<Route
									path='Logs'
									element={
										<ProtectedRoute allowedRoles={['ADMIN']}>
											<Logs />
										</ProtectedRoute>
									}
								/>
								<Route
									path='Customers'
									element={
										<ProtectedRoute allowedRoles={['ADMIN']}>
											<Customers />
										</ProtectedRoute>
									}
								/>
								<Route
									path='Services'
									element={
										<ProtectedRoute allowedRoles={[]}>
											<MaintenanceCalibration />
										</ProtectedRoute>
									}
								/>
							</Route>
						</Route>
						<Route path="*" element={<h2>Página no encontrada (404)</h2>} />
					</Routes>
				</HeroUIProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
)
