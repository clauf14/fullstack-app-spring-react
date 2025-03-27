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
  const [locationLatitude, setLocationLatitude] = useState(44.4268)
  const [locationLongitude, setLocationLongitude] = useState(26.1025)

  const [position, setPosition] = useState([locationLatitude, locationLongitude])
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
      setPosition([response.data.latitude, response.data.longitude])
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
      <div className="p-4 bg-white rounded-xl shadow-md flex items-center">
        <FiMapPin className="h-6 w-6 text-indigo-600 mr-2" />
        <p className="text-gray-500">{locationName || "No location selected"}</p>
      </div>

      {/* Map Section */}
      <div className="mt-4">
        <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%" }} className="border rounded">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={`<a href="https://www.google.com/maps?q=${position[0]},${position[1]}" target="_blank" style="color: #4F46E5;">Open in Google Maps</a>`}
          />
          <Circle center={position} radius={1000} fillColor="blue" fillOpacity={0.2} stroke={false} />
        </MapContainer>
      </div>
    </>
  )
}
