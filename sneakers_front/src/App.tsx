import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from './tools/Navbar'
import ProductPage from './pages/Product';


export default function App() {
  return (
    <Router>
      <Navbar />

      <main style={{ textAlign: 'center' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:product_id" element={<ProductPage />} />
        </Routes>
      </main>
    </Router>
  )
}