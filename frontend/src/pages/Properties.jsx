import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toggleFavourite, isFavourite } from "../utils/favourites"

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [city, setCity] = useState("All")
  const [sort, setSort] = useState("none")
  const [search, setSearch] = useState("")
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/properties?page=1&limit=100")
      .then(res => res.json())
      .then(data => setProperties(data.data || []))
  }, [])

  /* ---------------- FILTER + SEARCH ---------------- */
  let filtered = properties.filter(p => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      p.city?.toLowerCase().includes(searchText) ||
      p.location?.toLowerCase().includes(searchText)

    const matchesCity = city === "All" || p.city === city

    return matchesSearch && matchesCity
  })

  /* ---------------- SORT ---------------- */
  if (sort === "low") filtered.sort((a, b) => a.price - b.price)
  if (sort === "high") filtered.sort((a, b) => b.price - a.price)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>

      {/* 🔍 SEARCH + FILTERS */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by city or location..."
          className="border px-4 py-2 rounded w-full md:w-96"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          <option>All</option>
          <option>Bangalore</option>
          <option>Mumbai</option>
          <option>Pune</option>
          <option>Hyderabad</option>
          <option>Chennai</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* PROPERTY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p, i) => (
          <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src={p.image_url}
              alt="property"
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <h2 className="font-semibold text-lg">{p.location}</h2>

              <p className="text-sm text-gray-500">
                {p.city}
              </p>

              <p className="text-blue-600 font-bold mt-1">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </p>

              <div className="text-sm mt-2 text-gray-600 space-y-1">
                <p>Area: {p.area_sqft} sqft</p>
                <p>Bedrooms: {p.bedrooms}</p>
                <p>Bathrooms: {p.bathrooms}</p>
                <p>Parking: {p.parking}</p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-4">
                <Link to={`/property/${i}`} className="flex-1">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                    View Details
                  </button>
                </Link>

                <button
                  onClick={() => {
                    toggleFavourite(p)
                    setRefresh(!refresh)
                  }}
                  className={`px-4 rounded-lg text-lg ${
                    isFavourite(p.id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                  title="Save Property"
                >
                  {isFavourite(p.id) ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          No properties found.
        </p>
      )}
    </div>
  )
}