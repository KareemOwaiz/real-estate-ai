import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        RealEstateAI
      </Link>

      <div className="flex gap-6 font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/properties" className="hover:text-blue-600">Properties</Link>
        <Link to="/predictor" className="hover:text-blue-600">Price Predictor</Link>
	<Link to="/favourites">Saved</Link>

      </div>
    </nav>
  )
}