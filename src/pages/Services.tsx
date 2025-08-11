import { useState } from "react"
import { Car, Clock, Star, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

const services = [
  {
    id: 1,
    name: "Basic Oil Change",
    description: "Standard oil and filter replacement with quality conventional oil",
    price: 49.99,
    duration: "30 mins",
    category: "maintenance",
    rating: 4.8,
    reviews: 234,
    features: ["Conventional Oil", "Oil Filter", "Visual Inspection"]
  },
  {
    id: 2,
    name: "Premium Oil Change",
    description: "Full synthetic oil change with comprehensive multi-point inspection",
    price: 79.99,
    duration: "45 mins",
    category: "maintenance",
    rating: 4.9,
    reviews: 456,
    features: ["Full Synthetic Oil", "Premium Filter", "20-Point Inspection", "Fluid Top-off"]
  },
  {
    id: 3,
    name: "Brake Pad Replacement",
    description: "Complete brake pad replacement with rotor inspection",
    price: 149.99,
    duration: "2 hours",
    category: "brakes",
    rating: 4.7,
    reviews: 189,
    features: ["Brake Pads", "Rotor Inspection", "Brake Fluid Check", "Test Drive"]
  },
  {
    id: 4,
    name: "Tire Rotation & Balance",
    description: "Professional tire rotation and wheel balancing service",
    price: 79.99,
    duration: "45 mins",
    category: "tires",
    rating: 4.6,
    reviews: 167,
    features: ["Tire Rotation", "Wheel Balancing", "Pressure Check", "Tread Inspection"]
  },
  {
    id: 5,
    name: "Engine Diagnostics",
    description: "Comprehensive computer diagnostic scan and analysis",
    price: 99.99,
    duration: "1 hour",
    category: "diagnostics",
    rating: 4.8,
    reviews: 298,
    features: ["OBD Scan", "Error Code Analysis", "Performance Test", "Detailed Report"]
  },
  {
    id: 6,
    name: "AC System Service",
    description: "Complete air conditioning system inspection and recharge",
    price: 129.99,
    duration: "1.5 hours",
    category: "climate",
    rating: 4.5,
    reviews: 134,
    features: ["System Inspection", "Refrigerant Recharge", "Leak Detection", "Performance Test"]
  },
  {
    id: 7,
    name: "Battery Test & Replace",
    description: "Battery health test and replacement if needed",
    price: 159.99,
    duration: "30 mins",
    category: "electrical",
    rating: 4.7,
    reviews: 203,
    features: ["Battery Test", "Terminal Cleaning", "Load Test", "New Battery (if needed)"]
  },
  {
    id: 8,
    name: "Transmission Service",
    description: "Complete transmission fluid change and filter replacement",
    price: 199.99,
    duration: "2 hours",
    category: "transmission",
    rating: 4.9,
    reviews: 87,
    features: ["Fluid Replacement", "Filter Change", "Pan Gasket", "System Flush"]
  }
]

const categories = [
  { value: "all", label: "All Services" },
  { value: "maintenance", label: "Maintenance" },
  { value: "brakes", label: "Brakes" },
  { value: "tires", label: "Tires" },
  { value: "diagnostics", label: "Diagnostics" },
  { value: "climate", label: "Climate Control" },
  { value: "electrical", label: "Electrical" },
  { value: "transmission", label: "Transmission" }
]

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const formatINR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Our Services</h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground">
            Professional automotive services performed by certified technicians with quality parts and tools
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low-High)</SelectItem>
              <SelectItem value="price-high">Price (High-Low)</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(cat => cat.value === service.category)?.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                    <span>({service.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">
                    {formatINR.format(service.price)}
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Includes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full" asChild>
                  <Link to={`/book?service=${service.id}`}>
                    <Car className="mr-2 h-4 w-4" />
                    Book This Service
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No services found matching your criteria.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}