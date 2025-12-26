import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://https://real-estate-ai.onrender.com/properties?page=1&limit=100")
      .then(res => res.json())
      .then(data => {
        setProperty(data.data?.[id])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center mt-20">Loading property...</div>
  if (!property) return <div className="text-center mt-20">Property not found</div>

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/properties" className="text-blue-600 font-semibold">
        ← Back to Properties
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6 bg-white p-8 rounded-xl shadow">
        <img
          src={property.image_url}
          alt="property"
          className="w-full h-96 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">
            {property.location}, {property.city}
          </h1>

          <p className="text-2xl font-bold text-blue-600 mb-6">
            ₹{Number(property.price).toLocaleString("en-IN")}
          </p>

          <div className="space-y-2 text-gray-700">
            <p>📐 Area: {property.area_sqft} sqft</p>
            <p>🛏 Bedrooms: {property.bedrooms}</p>
            <p>🛁 Bathrooms: {property.bathrooms}</p>
            <p>🚗 Parking: {property.parking}</p>
          </div>

          {/* CONTACT ACTIONS */}
          <div className="mt-8 flex gap-4">
            <a
              href="tel:+919999999999"
              className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              📞 Contact Agent
            </a>

            <a
              href="mailto:info@realestateai.com"
              className="flex-1 text-center border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              ✉️ Enquire Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
