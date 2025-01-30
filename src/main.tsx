import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
{/*import Sidebar from './Components/Sidebar.tsx'
import Navbar from './Components/Navbar.tsx'
import CalorieCalculator from './Components/CalorieCalculator.tsx'*/}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<Navbar /> */}
    <App />
    {/*<Sidebar />
    <CalorieCalculator />*/}
  </StrictMode>,
)
