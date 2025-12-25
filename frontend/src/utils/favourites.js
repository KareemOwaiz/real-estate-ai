export function getFavourites() {
  return JSON.parse(localStorage.getItem("favourites")) || []
}

export function toggleFavourite(property) {
  const favs = getFavourites()
  const exists = favs.find(p => p.id === property.id)

  let updated
  if (exists) {
    updated = favs.filter(p => p.id !== property.id)
  } else {
    updated = [...favs, property]
  }

  localStorage.setItem("favourites", JSON.stringify(updated))
  return updated
}

export function isFavourite(id) {
  const favs = getFavourites()
  return favs.some(p => p.id === id)
}
