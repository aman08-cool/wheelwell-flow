import { useState } from "react"
import { Calendar, Car, Clock, MapPin, Star, ArrowRight, CheckCircle, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export default function Home() {
  const [formData, setFormData] = useState({
    carType: "",
    serviceType: "",
    date: "",
    time: "",
    location: "",
    notes: ""
  })

  const services = [
    {
      id: 1,
      name: "Oil Change",
      description: "Complete oil and filter replacement",
      price: "$49.99",
      duration: "30 mins",
      icon: <Car className="h-6 w-6" />
    },
    {
      id: 2,
      name: "Brake Service",
      description: "Brake inspection and pad replacement",
      price: "$149.99",
      duration: "2 hours",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      id: 3,
      name: "Tire Rotation",
      description: "Professional tire rotation and balancing",
      price: "$79.99",
      duration: "45 mins",
      icon: <Car className="h-6 w-6" />
    },
    {
      id: 4,
      name: "Engine Diagnostics",
      description: "Comprehensive engine health check",
      price: "$99.99",
      duration: "1 hour",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ]

  const stats = [
    { label: "Happy Customers", value: "10,000+", icon: <Users className="h-8 w-8" /> },
    { label: "Years Experience", value: "15+", icon: <Award className="h-8 w-8" /> },
    { label: "Services Completed", value: "50,000+", icon: <CheckCircle className="h-8 w-8" /> },
    { label: "Average Rating", value: "4.9", icon: <Star className="h-8 w-8" /> }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary/90 text-white">
        <div className="container px-4 py-20 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Premium Car Service
                <span className="block gradient-text">At Your Doorstep</span>
              </h1>
              <p className="max-w-[600px] text-lg text-white/90 md:text-xl">
                Experience hassle-free car maintenance with our professional service team. 
                Book online, track in real-time, and enjoy quality service you can trust.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="floating-shadow" asChild>
                  <Link to="/book">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Service Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" asChild>
                  <Link to="/services">
                    View All Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Quick Booking Form */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Service Booking</CardTitle>
                <CardDescription>Get started with your car service in minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="car-type">Car Type</Label>
                    <Select value={formData.carType} onValueChange={(value) => setFormData({...formData, carType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Service</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil-change">Oil Change</SelectItem>
                        <SelectItem value="brake-service">Brake Service</SelectItem>
                        <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                        <SelectItem value="diagnostics">Diagnostics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/book">
                    Continue Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Popular Services</h2>
            <p className="max-w-[600px] mx-auto text-muted-foreground">
              Our most requested services, performed by certified technicians with quality parts
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </Badge>
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/book">
                      Book Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Why Choose AutoCare?</h2>
            <p className="max-w-[600px] mx-auto text-muted-foreground">
              We're committed to providing the best car service experience with modern convenience
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Convenient Locations</h3>
              <p className="text-muted-foreground">
                Multiple service centers and mobile service options to fit your schedule
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-info/10 rounded-full flex items-center justify-center text-info">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Track your service progress in real-time with instant notifications
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center text-warning">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                All services backed by our satisfaction guarantee and warranty
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}