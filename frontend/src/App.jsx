import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import PricePredictor from "./pages/PricePredictor"
import Favourites from "./pages/Favourites"


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/predictor" element={<PricePredictor />} />
	<Route path="/favourites" element={<Favourites />} />
      </Routes>
    </div>
  )
}

export default App