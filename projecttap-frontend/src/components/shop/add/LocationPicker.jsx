import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { useMapEvents } from "react-leaflet"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })

export default function LocationPicker({ locationLatitude, locationLongitude, setLocationName, setLocationLatitude, setLocationLongitude }) {
  const [L, setL] = useState(null)
  const [position, setPosition] = useState([locationLatitude || 44.4268, locationLongitude || 26.1025]) // Default to Bucharest
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setMounted(true)
    import("leaflet").then((leaflet) => setL(leaflet)) // Import Leaflet only on client
  }, [])

  if (!mounted || !L) return <Loading />

  const customIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32'>
        <path fill='#4F46E5' d='M16 2C9.37 2 4 7.37 4 14c0 6.9 10.6 15.4 11.1 15.8.5.4 1.3.4 1.8 0 .5-.4 11.1-8.9 11.1-15.8 0-6.63-5.37-12-12-12zm0 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z'/>
      </svg>`
    )}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })

  function CenterMapOnMarker({ position }) {
    const map = useMapEvents({
      move() {
        const lat = map.getCenter().lat
        const lng = map.getCenter().lng
        setPosition([lat, lng])
        setLocationLatitude(lat)
        setLocationLongitude(lng)
      },
    })
    useEffect(() => {
      map.panTo(position)
    }, [position, map])
    return null
  }

  const handleSearch = async () => {
    if (!search.trim()) return
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`)
      const data = await response.json()
      if (data.length > 0) {
        const { display_name, lat, lon } = data[0]
        const newPosition = [parseFloat(lat), parseFloat(lon)]
        setPosition(newPosition)
        setLocationName(display_name)
        setLocationLatitude(parseFloat(lat))
        setLocationLongitude(parseFloat(lon))
      }
    } catch (error) {
      console.error("Error fetching location data:", error)
    }
  }

  return (
    <div className="mb-4">
      <div className="mb-10 relative">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">Location:</label>
        <div className="flex gap-2 mt-2">
          <input required type="text" className="border p-2 rounded w-full" placeholder="City, Region, Country" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <MapContainer center={position} zoom={15} style={{ height: "300px", width: "100%" }} className="mt-2 border rounded">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CenterMapOnMarker position={position} />
        <Marker position={position} icon={customIcon}></Marker>
        <Circle center={position} radius={500} fillColor="blue" fillOpacity={0.2} stroke={false} />
      </MapContainer>
    </div>
  )
}
