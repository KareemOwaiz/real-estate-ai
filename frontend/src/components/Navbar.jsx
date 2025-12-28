import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          RealEstateAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/properties" className="hover:text-blue-600">Properties</Link>
          <Link to="/predictor" className="hover:text-blue-600">Price Predictor</Link>
          <Link to="/saved" className="hover:text-blue-600">Saved</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <Link onClick={() => setOpen(false)} to="/" className="block px-6 py-3">Home</Link>
          <Link onClick={() => setOpen(false)} to="/properties" className="block px-6 py-3">Properties</Link>
          <Link onClick={() => setOpen(false)} to="/predictor" className="block px-6 py-3">Price Predictor</Link>
          <Link onClick={() => setOpen(false)} to="/saved" className="block px-6 py-3">Saved</Link>
        </div>
      )}
    </nav>
  )
}
