import { Link, NavLink } from 'react-router-dom'
import { Sprout, Search, Map as MapIcon, BarChart3 } from 'lucide-react'

function Navbar() {
    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
            ? 'bg-fasal-accent text-white'
            : 'text-fasal-muted hover:bg-fasal-bg hover:text-fasal-text'
        }`

    return (
        <nav className="bg-fasal-surface/80 backdrop-blur-md border-b border-fasal-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Sprout className="w-7 h-7 text-fasal-accent" />
                    <span className="text-2xl font-serif text-fasal-text">FasalStore</span>
                </Link>

                <div className="flex items-center gap-1">
                    <NavLink to="/search" className={linkClass}>
                        <Search className="w-4 h-4" />
                        Search
                    </NavLink>
                    <NavLink to="/map" className={linkClass}>
                        <MapIcon className="w-4 h-4" />
                        Map
                    </NavLink>
                    <NavLink to="/analytics" className={linkClass}>
                        <BarChart3 className="w-4 h-4" />
                        Stats
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

export default Navbar