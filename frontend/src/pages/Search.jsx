import { useState, useEffect } from 'react'
import { Search as SearchIcon, MapPin, Star, Package, IndianRupee, Loader2, ArrowUpDown } from 'lucide-react'
import { getAllStorages, recommendStorages } from '../api'
import BookingModal from '../components/BookingModal'

function Search() {
    const [crops, setCrops] = useState([])
    const [selectedCrop, setSelectedCrop] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [error, setError] = useState('')
    const [bookingStorage, setBookingStorage] = useState(null)
    const [sortBy, setSortBy] = useState('capacity') // NEW: sort state

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const data = await getAllStorages()
                setCrops(data.crops)
            } catch (err) {
                setError('Could not connect to backend. Make sure Flask is running on port 5000.')
                console.error(err)
            }
        }
        fetchCrops()
    }, [])

    const handleSearch = async () => {
        if (!selectedCrop) return
        setLoading(true)
        setHasSearched(true)
        setError('')
        try {
            const data = await recommendStorages(selectedCrop)
            setResults(data.data || [])
        } catch (err) {
            setError('Search failed. Check backend connection.')
            setResults([])
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // NEW: Sort the results based on selected sort option
    const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
            case 'capacity':
                return b.capacity - a.capacity
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'rating':
                return b.rating - a.rating
            case 'distance':
                return a.distance - b.distance
            case 'available':
                return b.available - a.available
            default:
                return 0
        }
    })

    const sortLabels = {
        capacity: 'Capacity (high to low)',
        'price-low': 'Price (low to high)',
        'price-high': 'Price (high to low)',
        rating: 'Rating (high to low)',
        distance: 'Distance (nearest)',
        available: 'Most available',
    }

    return (
        <div className="min-h-screen bg-fasal-bg">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-fasal-accent">
                        Search Storages
                    </span>
                    <h1 className="font-serif text-5xl text-fasal-text mt-2">
                        What are you storing today?
                    </h1>
                    <p className="text-fasal-muted mt-3">
                        Pick a crop to see all matching storage facilities.
                    </p>
                </div>

                {/* Search bar */}
                <div className="bg-fasal-surface border border-fasal-border rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-3 items-stretch">
                    <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="flex-1 px-4 py-3 border border-fasal-border rounded-lg bg-fasal-bg focus:border-fasal-accent focus:outline-none capitalize text-fasal-text"
                    >
                        <option value="">— Select a crop —</option>
                        {crops.map((crop) => (
                            <option key={crop} value={crop} className="capitalize">
                                {crop.charAt(0).toUpperCase() + crop.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSearch}
                        disabled={!selectedCrop || loading}
                        className="bg-fasal-accent hover:bg-fasal-accent-light disabled:bg-fasal-muted/30 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Searching
                            </>
                        ) : (
                            <>
                                <SearchIcon className="w-5 h-5" />
                                Search
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-fasal-warn/10 border border-fasal-warn/30 text-fasal-warn rounded-xl p-4 mb-6 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {!hasSearched && !error && (
                    <div className="text-center py-16 text-fasal-muted">
                        <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Select a crop above to find matching storages.</p>
                    </div>
                )}

                {!loading && hasSearched && results.length === 0 && !error && (
                    <div className="text-center py-16">
                        <p className="font-serif text-2xl text-fasal-text mb-2">No matches.</p>
                        <p className="text-fasal-muted">
                            No storages found for <span className="capitalize">"{selectedCrop}"</span>. Try another crop.
                        </p>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        {/* Results header with sort */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-5">
                            <p className="text-fasal-text">
                                <span className="font-serif text-3xl text-fasal-accent">{results.length}</span>{' '}
                                <span className="text-fasal-muted">matching storages for</span>{' '}
                                <span className="capitalize font-semibold">{selectedCrop}</span>
                            </p>

                            {/* NEW: Sort dropdown */}
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4 text-fasal-muted" />
                                <span className="text-xs uppercase tracking-wider text-fasal-muted">Sort by</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-1.5 border border-fasal-border rounded-lg bg-fasal-surface text-sm text-fasal-text focus:border-fasal-accent focus:outline-none cursor-pointer"
                                >
                                    {Object.entries(sortLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedResults.map((storage) => (
                                <StorageCard
                                    key={storage.id}
                                    storage={storage}
                                    onBook={() => setBookingStorage(storage)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {bookingStorage && (
                <BookingModal
                    storage={bookingStorage}
                    onClose={() => setBookingStorage(null)}
                />
            )}
        </div>
    )
}

function StorageCard({ storage, onBook }) {
    const availabilityPercent = Math.round((storage.available / storage.capacity) * 100)
    return (
        <div className="bg-fasal-surface border border-fasal-border rounded-2xl p-5 hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-serif text-xl text-fasal-text leading-tight">
                    {storage.name}
                </h3>
                <div className="flex items-center gap-1 bg-fasal-gold/10 px-2 py-1 rounded-md shrink-0">
                    <Star className="w-3.5 h-3.5 text-fasal-gold fill-fasal-gold" />
                    <span className="text-xs font-semibold text-fasal-gold">{storage.rating}</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-fasal-muted mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {storage.area} • {storage.distance} km
            </div>

            <div className="space-y-2 pt-3 border-t border-fasal-border flex-1">
                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1.5 text-fasal-muted">
                        <Package className="w-3.5 h-3.5" />
                        Available
                    </span>
                    <span className="font-semibold text-fasal-text">
                        {storage.available} / {storage.capacity} kg
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1.5 text-fasal-muted">
                        <IndianRupee className="w-3.5 h-3.5" />
                        Price
                    </span>
                    <span className="font-semibold text-fasal-text">₹{storage.price}/kg</span>
                </div>

                <div className="pt-2">
                    <div className="h-1.5 bg-fasal-bg rounded-full overflow-hidden">
                        <div
                            className="h-full bg-fasal-accent rounded-full transition-all"
                            style={{ width: `${availabilityPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-fasal-muted mt-1.5">{availabilityPercent}% available</p>
                </div>
            </div>

            <button
                onClick={onBook}
                className="w-full mt-4 bg-fasal-accent hover:bg-fasal-accent-light text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
                Book Now
            </button>
        </div>
    )
}

export default Search