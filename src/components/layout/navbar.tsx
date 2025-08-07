import { Car, User, Calendar, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">AutoCare</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/services") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Services
            </Link>
            <Link
              to="/bookings"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/bookings") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              My Bookings
            </Link>
            <Link
              to="/vehicles"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/vehicles") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              My Vehicles
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu button could go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/book">
                <Calendar className="h-4 w-4 mr-2" />
                Book Service
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  )
}