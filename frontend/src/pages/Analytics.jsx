import { useState, useEffect } from 'react'
import { Package, MapPin, TrendingUp, Wheat, Star, IndianRupee, Sprout, Loader2 } from 'lucide-react'
import { getAllStorages } from '../api'

function Analytics() {
    const [storages, setStorages] = useState([])
    const [crops, setCrops] = useState([])
    const [areas, setAreas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllStorages()
                setStorages(data.data || [])
                setCrops(data.crops || [])
                setAreas(data.areas || [])
            } catch (err) {
                setError('Could not load data. Make sure backend is running.')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Calculations
    const totalCapacity = storages.reduce((sum, s) => sum + s.capacity, 0)
    const totalAvailable = storages.reduce((sum, s) => sum + s.available, 0)
    const occupiedPercent = totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0
    const avgPrice = storages.length > 0 ? (storages.reduce((sum, s) => sum + s.price, 0) / storages.length).toFixed(2) : 0
    const avgRating = storages.length > 0 ? (storages.reduce((sum, s) => sum + s.rating, 0) / storages.length).toFixed(1) : 0

    // Crop distribution
    const cropCounts = crops.map(crop => ({
        name: crop,
        count: storages.filter(s => s.crop === crop).length,
        capacity: storages.filter(s => s.crop === crop).reduce((sum, s) => sum + s.capacity, 0)
    })).sort((a, b) => b.capacity - a.capacity)

    // Area distribution (top 5 by capacity)
    const areaCounts = areas.map(area => ({
        name: area,
        count: storages.filter(s => s.area === area).length,
        capacity: storages.filter(s => s.area === area).reduce((sum, s) => sum + s.capacity, 0)
    })).sort((a, b) => b.capacity - a.capacity).slice(0, 5)

    if (loading) {
        return (
            <div className="min-h-screen bg-fasal-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-fasal-accent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-fasal-bg">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-fasal-accent">
                        Network Insights
                    </span>
                    <h1 className="font-serif text-5xl text-fasal-text mt-2">
                        FasalStore at a glance.
                    </h1>
                    <p className="text-fasal-muted mt-3">
                        Aggregated data across all storage facilities in Nagpur.
                    </p>
                </div>

                {error && (
                    <div className="bg-fasal-warn/10 border border-fasal-warn/30 text-fasal-warn rounded-xl p-4 mb-6 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Top stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatCard
                        icon={<Package className="w-5 h-5" />}
                        label="Total Storages"
                        value={storages.length}
                        sub="across Nagpur"
                    />
                    <StatCard
                        icon={<Wheat className="w-5 h-5" />}
                        label="Crop Types"
                        value={crops.length}
                        sub="supported"
                    />
                    <StatCard
                        icon={<MapPin className="w-5 h-5" />}
                        label="Areas Covered"
                        value={areas.length}
                        sub="neighborhoods"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="Occupancy"
                        value={`${occupiedPercent}%`}
                        sub="currently in use"
                    />
                </div>

                {/* Big stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <BigStatCard
                        label="Total Capacity"
                        value={totalCapacity.toLocaleString()}
                        unit="kg"
                        sub={`${totalAvailable.toLocaleString()} kg available`}
                        color="accent"
                    />
                    <BigStatCard
                        label="Average Price"
                        value={`₹${avgPrice}`}
                        unit="per kg"
                        sub="across all storages"
                        color="gold"
                    />
                    <BigStatCard
                        label="Average Rating"
                        value={avgRating}
                        unit="/ 5.0"
                        sub="customer satisfaction"
                        color="blue"
                    />
                </div>

                {/* Two column: Crop distribution + Area distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Crops */}
                    <div className="bg-fasal-surface border border-fasal-border rounded-2xl p-6">
                        <div className="flex items-baseline justify-between mb-5">
                            <h2 className="font-serif text-2xl text-fasal-text">Storage by Crop</h2>
                            <span className="text-xs uppercase tracking-wider text-fasal-muted">By capacity</span>
                        </div>
                        <div className="space-y-3">
                            {cropCounts.map((crop) => {
                                const percent = Math.round((crop.capacity / totalCapacity) * 100)
                                return (
                                    <div key={crop.name}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="capitalize text-fasal-text font-medium">{crop.name}</span>
                                            <span className="text-sm text-fasal-muted">
                                                {crop.count} storages • {crop.capacity.toLocaleString()} kg
                                            </span>
                                        </div>
                                        <div className="h-2 bg-fasal-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-fasal-accent rounded-full transition-all"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Areas */}
                    <div className="bg-fasal-surface border border-fasal-border rounded-2xl p-6">
                        <div className="flex items-baseline justify-between mb-5">
                            <h2 className="font-serif text-2xl text-fasal-text">Top 5 Areas</h2>
                            <span className="text-xs uppercase tracking-wider text-fasal-muted">By capacity</span>
                        </div>
                        <div className="space-y-3">
                            {areaCounts.map((area, index) => (
                                <div
                                    key={area.name}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-fasal-bg transition-colors"
                                >
                                    <span className="font-serif text-3xl text-fasal-accent w-10">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-fasal-text">{area.name}</p>
                                        <p className="text-sm text-fasal-muted">
                                            {area.count} storages
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-fasal-text">
                                        {area.capacity.toLocaleString()} kg
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-10 flex items-center justify-center gap-2 text-sm text-fasal-muted">
                    <Sprout className="w-4 h-4 text-fasal-accent" />
                    <span>Data refreshes from the FasalStore backend in real-time.</span>
                </div>
            </div>
        </div>
    )
}

// Small stat card
function StatCard({ icon, label, value, sub }) {
    return (
        <div className="bg-fasal-surface border border-fasal-border rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg bg-fasal-accent/10 text-fasal-accent flex items-center justify-center mb-3">
                {icon}
            </div>
            <p className="text-xs uppercase tracking-wider text-fasal-muted mb-1">{label}</p>
            <p className="font-serif text-3xl text-fasal-text leading-tight">{value}</p>
            <p className="text-xs text-fasal-muted mt-1">{sub}</p>
        </div>
    )
}

// Bigger feature card
function BigStatCard({ label, value, unit, sub, color }) {
    const colorMap = {
        accent: 'text-fasal-accent',
        gold: 'text-fasal-gold',
        blue: 'text-fasal-blue',
    }
    return (
        <div className="bg-fasal-surface border border-fasal-border rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-fasal-muted mb-3">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className={`font-serif text-5xl ${colorMap[color]}`}>{value}</span>
                <span className="text-fasal-muted text-sm">{unit}</span>
            </div>
            <p className="text-sm text-fasal-muted mt-2">{sub}</p>
        </div>
    )
}

export default Analytics