import { useState } from "react"

export default function PricePredictor() {
  const [area, setArea] = useState("")
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(2)
  const [parking, setParking] = useState(1)
  const [city, setCity] = useState("Bangalore")

  const [price, setPrice] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const predictPrice = async () => {
    setError("")
    setPrice(null)

    if (!area || area <= 0) {
      setError("Please enter a valid area in square feet")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area_sqft: Number(area),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          stories: 1,
          parking: Number(parking),
          city: city
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || "Prediction failed")

      setPrice(data.predicted_price)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          AI Price Predictor
        </h1>

        {/* AREA */}
        <label className="block text-sm font-medium mb-1">
          Area (in square feet)
        </label>
        <input
          type="number"
          placeholder="e.g. 1200"
          value={area}
          onChange={e => setArea(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        {/* BEDROOMS */}
        <label className="block text-sm font-medium mb-1">
          Bedrooms
        </label>
        <input
          type="number"
          min="1"
          value={bedrooms}
          onChange={e => setBedrooms(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        {/* BATHROOMS */}
        <label className="block text-sm font-medium mb-1">
          Bathrooms
        </label>
        <input
          type="number"
          min="1"
          value={bathrooms}
          onChange={e => setBathrooms(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        {/* PARKING */}
        <label className="block text-sm font-medium mb-1">
          Parking Spaces
        </label>
        <input
          type="number"
          min="0"
          value={parking}
          onChange={e => setParking(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        {/* CITY */}
        <label className="block text-sm font-medium mb-1">
          City
        </label>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-6"
        >
          <option>Bangalore</option>
          <option>Mumbai</option>
          <option>Hyderabad</option>
          <option>Pune</option>
          <option>Chennai</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={predictPrice}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          {loading ? "Predicting..." : "Predict Price"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}

        {/* RESULT */}
        {price && (
          <div className="mt-6 text-center">
            <p className="text-gray-500">Estimated Market Price</p>
            <p className="text-3xl font-bold text-green-600">
              ₹ {Number(price).toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
