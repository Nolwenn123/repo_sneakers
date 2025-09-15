import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"

export default function App() {
  return (
    <Router>
      
      <main style={{ textAlign: 'center' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Ajoute ici d'autres routes si besoin */}
        </Routes>
      </main>
    </Router>
  )
}