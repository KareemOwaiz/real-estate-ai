import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const heroImages = [
  "/images/hero-1.png",
  "/images/hero-2.png",
]

export default function Home() {
  const [properties, setProperties] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)

  // Rotate hero background
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Load featured properties
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/properties?page=1&limit=100`)
      .then(res => res.json())
      .then(data => setProperties(data.data || []))
  }, [])

  return (
    <div className="bg-gray-50">

      {/* ================= HERO ================= */}
      <section
        className="relative h-[90vh] flex items-center"
        style={{
          backgroundImage: `url(${heroImages[heroIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center text-white">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              AI-Powered <span className="text-blue-400">Real Estate</span>
              <br /> Price Prediction
            </h1>

            <p className="mt-6 text-lg text-gray-200">
              Browse properties, filter by city, and predict accurate prices using Machine Learning.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
              >
                Browse Properties
              </Link>

              <Link
                to="/predictor"
                className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold"
              >
                Predict Price
              </Link>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/95 text-black rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold mb-4">AI Price Estimator</h3>
            <p className="text-gray-600 mb-6">
              Enter property details and get instant AI-powered price insights.
            </p>

            <Link
              to="/predictor"
              className="block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Try Predictor →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Link to="/properties" className="text-blue-600 font-semibold">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((p, i) => (
            <div key={i} className="bg-white rounded-xl shadow hover:shadow-xl transition">
              <img
                src={p.image_url}
                className="h-48 w-full object-cover rounded-t-xl"
                alt="property"
              />

              <div className="p-5">
                <h3 className="font-semibold text-lg">
  {p.location || p.city}
</h3>
                <p className="text-sm text-gray-500">{p.city}</p>

                <p className="text-blue-600 font-bold mt-2">
                  ₹{Number(p.price).toLocaleString("en-IN")}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  {p.bedrooms} Beds • {p.bathrooms} Baths • {p.area_sqft} sqft
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Why RealEstateAI?</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              title="AI Price Prediction"
              desc="RandomForest ML model trained on real housing data."
            />
            <Feature
              title="Smart Filtering"
              desc="City-based filtering and price sorting."
            />
            <Feature
              title="Market Realism"
              desc="City multipliers reflect real Indian market trends."
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-600 py-20 text-center text-white">
        <h2 className="text-4xl font-bold">
          Predict Property Prices with AI
        </h2>
        <p className="mt-4 text-blue-100">
          Accurate • Fast • Realistic
        </p>

        <Link
          to="/predictor"
          className="inline-block mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Start Now
        </Link>
      </section>
    </div>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  )
}
