import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CatalogoPage from './pages/CatalogoPage'
import HomePage from './pages/HomePage'
import InfoPage from './pages/InfoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
