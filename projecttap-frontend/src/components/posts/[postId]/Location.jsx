import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { FiMapPin } from "react-icons/fi"
import { request } from "@/app/axios_helper"
import "leaflet/dist/leaflet.css"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })

export default function Location({ post }) {
  const locationId = post.locationId
  const [locationName, setLocationName] = useState("")
  const [locationLatitude, setLocationLatitude] = useState("")
  const [locationLongitude, setLocationLongitude] = useState("")

  //leaflet map
  const [position, setPosition] = useState([locationLatitude || 44.4268, locationLongitude || 26.1025])
  const [L, setL] = useState(null)

  useEffect(() => {
    import("leaflet").then((leaflet) => setL(leaflet)) // Import Leaflet only on client
  }, [])

  const fetchLocation = async () => {
    try {
      const response = await request("GET", `/location/${locationId}`)
      setLocationName(response.data.name)
      setLocationLatitude(response.data.latitude)
      setLocationLongitude(response.data.longitude)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (locationId) {
      fetchLocation()
    }
  }, [locationId])

  return (
    <>
      <div className="text-2xl font-semibold mt-10 mb-4 text-black">Location</div>

      {/* Location Info */}
      <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center">
        <FiMapPin className="h-6 w-6 text-indigo-600 mr-2" />
        <p className="text-gray-500">{locationName || "No location selected"}</p>
      </div>

      {/* Map Section Below */}
      <div className="mt-4 max-w-sm mx-auto">
        <MapContainer center={position} zoom={14} style={{ height: "300px", width: "100%" }} className="border rounded">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle center={position} radius={500} fillColor="blue" fillOpacity={0.2} stroke={false} />
        </MapContainer>
      </div>
    </>
  )
}
