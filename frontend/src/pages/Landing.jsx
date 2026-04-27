import { Link } from 'react-router-dom'
import { Search, MapPin, BarChart3, ArrowRight, Sprout } from 'lucide-react'

function Landing() {
    return (
        <div className="min-h-screen bg-fasal-bg">
            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
                <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-fasal-accent mb-4">
                    Smart Storage for Indian Farmers
                </span>
                <h1 className="font-serif text-6xl md:text-7xl text-fasal-text leading-tight mb-6">
                    Find the right storage<br />
                    <em className="text-fasal-accent">for every harvest.</em>
                </h1>
                <p className="text-lg text-fasal-muted max-w-2xl mx-auto mb-10">
                    FasalStore connects farmers in Nagpur with the best-suited cold storage,
                    warehouses, and dry storage — instantly, based on crop type and capacity.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        to="/search"
                        className="inline-flex items-center gap-2 bg-fasal-accent hover:bg-fasal-accent-light text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Find Storage <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/map"
                        className="inline-flex items-center gap-2 bg-fasal-surface border border-fasal-border text-fasal-text px-6 py-3 rounded-lg font-semibold hover:bg-fasal-bg transition-colors"
                    >
                        View Map
                    </Link>
                </div>
            </section>

            {/* Feature cards */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Search className="w-5 h-5" />}
                        title="Smart Search"
                        text="Filter storage facilities by crop type. Get instant recommendations sorted by capacity and rating."
                    />
                    <FeatureCard
                        icon={<MapPin className="w-5 h-5" />}
                        title="Live Map"
                        text="Visualize all 50 storages across Nagpur. See location, distance, and availability at a glance."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-5 h-5" />}
                        title="Insights"
                        text="Get statistics on storage availability, area-wise capacity, and pricing trends."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-fasal-border py-8">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm text-fasal-muted">
                    <Sprout className="w-5 h-5 text-fasal-accent inline mr-2" />
                    FasalStore — B.Tech Final Year Project
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, text }) {
    return (
        <div className="bg-fasal-surface rounded-2xl p-6 border border-fasal-border">
            <div className="w-10 h-10 rounded-lg bg-fasal-accent/10 text-fasal-accent flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="font-serif text-2xl text-fasal-text mb-2">{title}</h3>
            <p className="text-sm text-fasal-muted leading-relaxed">{text}</p>
        </div>
    )
}

export default Landing