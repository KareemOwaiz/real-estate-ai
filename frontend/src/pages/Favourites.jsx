import { useEffect, useState } from "react"
import { getFavourites, toggleFavourite } from "../utils/favourites"

export default function Favourites() {
  const [favs, setFavs] = useState([])

  useEffect(() => {
    setFavs(getFavourites())
  }, [])

  if (favs.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500">
        No saved properties yet ❤️
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Saved Properties</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favs.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow">
            <img
              src={p.image_url}
              className="h-48 w-full object-cover rounded-t-xl"
            />

            <div className="p-5">
              <p className="font-semibold">{p.city}</p>
              <p className="text-blue-600 font-bold">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => {
                  toggleFavourite(p)
                  setFavs(getFavourites())
                }}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Remove ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
