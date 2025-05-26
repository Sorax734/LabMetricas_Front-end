import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage.jsx';
import { Login } from './pages/Login.jsx';

import App from './pages/App.jsx';
import { Home } from './pages/Home.jsx';
import { Profile } from './pages/Profile.jsx';
import { Users } from './pages/Users.jsx';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
    <StrictMode>
      <HeroUIProvider locale="es-MX">
        <Routes>
          <Route path='/' element={ <Outlet/> } >
            <Route index element={ <LandingPage/> } />
            <Route path='Login' element={ <Login/> } />

            <Route path='App' element={ <App/> }>
              <Route index element={ <Home/> }/>
              <Route path='Profile' element={ <Profile/> }/>
              <Route path='Users' element={ <Users/> }/>
            </Route>
          </Route>
        </Routes>
      </HeroUIProvider>
    </StrictMode>
	</BrowserRouter>
)
