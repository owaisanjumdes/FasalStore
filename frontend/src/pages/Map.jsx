import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Loader2, Package, Star, IndianRupee } from 'lucide-react'
import { getAllStorages } from '../api'

// Fix Leaflet's default icon (Vite breaks the default paths)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Nagpur center coordinates
const NAGPUR_CENTER = [21.1458, 79.0882]

function Map() {
    const [storages, setStorages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchStorages = async () => {
            try {
                const data = await getAllStorages()
                setStorages(data.data || [])
            } catch (err) {
                setError('Failed to load storages. Make sure backend is running.')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStorages()
    }, [])

    return (
        <div className="min-h-screen bg-fasal-bg">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-6">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-fasal-accent">
                        Live Storage Map
                    </span>
                    <h1 className="font-serif text-5xl text-fasal-text mt-2">
                        All storages across Nagpur.
                    </h1>
                    <p className="text-fasal-muted mt-3">
                        {loading ? 'Loading...' : `${storages.length} storage facilities plotted on the map.`}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-fasal-warn/10 border border-fasal-warn/30 text-fasal-warn rounded-xl p-4 mb-6 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Map container */}
                <div className="bg-fasal-surface border border-fasal-border rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="h-[600px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-fasal-accent" />
                        </div>
                    ) : (
                        <MapContainer
                            center={NAGPUR_CENTER}
                            zoom={11}
                            style={{ height: '600px', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {storages.map((storage) => (
                                <Marker key={storage.id} position={[storage.lat, storage.lng]}>
                                    <Popup>
                                        <div className="font-sans">
                                            <h3 className="font-serif text-lg text-fasal-text mb-1">
                                                {storage.name}
                                            </h3>
                                            <p className="text-xs text-fasal-muted mb-2 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {storage.area} • {storage.distance} km
                                            </p>
                                            <div className="space-y-1 text-xs">
                                                <p className="capitalize">
                                                    <span className="text-fasal-muted">Crop: </span>
                                                    <span className="font-semibold text-fasal-accent">{storage.crop}</span>
                                                </p>
                                                <p>
                                                    <span className="text-fasal-muted">Available: </span>
                                                    <span className="font-semibold">{storage.available}/{storage.capacity} kg</span>
                                                </p>
                                                <p>
                                                    <span className="text-fasal-muted">Price: </span>
                                                    <span className="font-semibold">₹{storage.price}/kg</span>
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-fasal-gold fill-fasal-gold" />
                                                    <span className="font-semibold">{storage.rating}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    )}
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center gap-4 text-sm text-fasal-muted">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-fasal-accent" />
                        <span>Click any marker to see storage details</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Map