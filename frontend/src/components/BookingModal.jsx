import { useState } from 'react'
import { X, CheckCircle2, Calendar, Package, IndianRupee, Loader2 } from 'lucide-react'

function BookingModal({ storage, onClose }) {
    const [quantity, setQuantity] = useState(50)
    const [date, setDate] = useState(() => {
        // Default: tomorrow
        const t = new Date()
        t.setDate(t.getDate() + 1)
        return t.toISOString().split('T')[0]
    })
    const [submitting, setSubmitting] = useState(false)
    const [bookingId, setBookingId] = useState(null)

    const totalPrice = (quantity * storage.price).toFixed(2)
    const maxQuantity = storage.available

    const handleConfirm = () => {
        setSubmitting(true)
        // Simulate booking API call
        setTimeout(() => {
            const id = 'FS' + Date.now().toString().slice(-8)
            setBookingId(id)
            setSubmitting(false)
        }, 1200)
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-fasal-surface rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Booking Success State */}
                {bookingId ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-fasal-accent/10 text-fasal-accent flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="font-serif text-3xl text-fasal-text mb-2">Booking Confirmed!</h2>
                        <p className="text-fasal-muted mb-6">
                            Your storage slot has been reserved at {storage.name}.
                        </p>
                        <div className="bg-fasal-bg rounded-xl p-5 text-left mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-fasal-muted">Booking ID</span>
                                <span className="font-mono font-semibold text-fasal-text">{bookingId}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-fasal-muted">Storage</span>
                                <span className="font-semibold text-fasal-text">{storage.name}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-fasal-muted">Quantity</span>
                                <span className="font-semibold text-fasal-text">{quantity} kg</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-fasal-muted">Date</span>
                                <span className="font-semibold text-fasal-text">{date}</span>
                            </div>
                            <div className="border-t border-fasal-border pt-2 mt-2 flex justify-between">
                                <span className="text-fasal-muted">Total</span>
                                <span className="font-serif text-xl text-fasal-accent">₹{totalPrice}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-fasal-accent hover:bg-fasal-accent-light text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Done
                        </button>
                        <p className="text-xs text-fasal-muted mt-4 italic">
                            Demo mode — bookings are not persisted to the backend yet.
                        </p>
                    </div>
                ) : (
                    /* Booking Form State */
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-fasal-border">
                            <div>
                                <span className="text-xs font-semibold tracking-wider uppercase text-fasal-accent">
                                    Reserve Storage
                                </span>
                                <h2 className="font-serif text-2xl text-fasal-text mt-1">
                                    {storage.name}
                                </h2>
                                <p className="text-sm text-fasal-muted mt-1">
                                    {storage.area} • {storage.distance} km away
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-fasal-muted hover:text-fasal-text transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5">
                            {/* Quantity */}
                            <div>
                                <label className="text-xs font-semibold tracking-wider uppercase text-fasal-muted mb-2 flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" />
                                    Quantity (kg)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={maxQuantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
                                    className="w-full px-4 py-3 border border-fasal-border rounded-lg bg-fasal-bg focus:border-fasal-accent focus:outline-none text-fasal-text"
                                />
                                <p className="text-xs text-fasal-muted mt-1.5">
                                    Max available: {maxQuantity} kg
                                </p>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="text-xs font-semibold tracking-wider uppercase text-fasal-muted mb-2 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Booking Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-fasal-border rounded-lg bg-fasal-bg focus:border-fasal-accent focus:outline-none text-fasal-text"
                                />
                            </div>

                            {/* Price summary */}
                            <div className="bg-fasal-bg rounded-xl p-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-fasal-muted">Rate</span>
                                    <span className="text-fasal-text">₹{storage.price}/kg</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-fasal-muted">Quantity</span>
                                    <span className="text-fasal-text">{quantity} kg</span>
                                </div>
                                <div className="border-t border-fasal-border pt-2 mt-2 flex justify-between items-baseline">
                                    <span className="text-fasal-muted text-sm">Estimated total</span>
                                    <span className="font-serif text-3xl text-fasal-accent">₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 border border-fasal-border text-fasal-text py-3 rounded-lg font-semibold hover:bg-fasal-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={submitting || quantity < 1}
                                className="flex-1 bg-fasal-accent hover:bg-fasal-accent-light disabled:bg-fasal-muted/30 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Confirming...
                                    </>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default BookingModal