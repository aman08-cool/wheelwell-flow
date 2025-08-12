import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Car, User, Phone, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
const services = [
  { id: 1, name: "Basic Oil Change", price: 49.99, duration: "30 mins" },
  { id: 2, name: "Premium Oil Change", price: 79.99, duration: "45 mins" },
  { id: 3, name: "Brake Pad Replacement", price: 149.99, duration: "2 hours" },
  { id: 4, name: "Tire Rotation & Balance", price: 79.99, duration: "45 mins" },
  { id: 5, name: "Engine Diagnostics", price: 99.99, duration: "1 hour" }
]

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
]

export default function BookService() {
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const preselectedService = searchParams.get("service")
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    // Service Details
    serviceType: preselectedService || "",
    additionalServices: [] as string[],
    
    // Vehicle Information
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    
    // Schedule
    preferredDate: "",
    preferredTime: "",
    serviceLocation: "",
    
    // Customer Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Additional Details
    specialInstructions: "",
    
    // Service Location Details
    address: "",
    isPickupService: false
  })

  const selectedService = services.find(s => s.id.toString() === formData.serviceType)
  const additionalServicesList = services.filter(s => 
    formData.additionalServices.includes(s.id.toString())
  )
  
  const baseTotal = (selectedService?.price || 0) + 
    additionalServicesList.reduce((sum, service) => sum + service.price, 0)
  const totalPrice = baseTotal * 100
  const formatINR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.serviceType || !formData.preferredDate || !formData.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to confirm your booking.",
        variant: "destructive"
      })
      return
    }

    const serviceName = selectedService?.name || "Service"
    const additionalServiceNames = additionalServicesList.map((s) => s.name)

    const locationLabel =
      formData.serviceLocation === "downtown"
        ? "Downtown Service Center"
        : formData.serviceLocation === "north"
        ? "North Branch"
        : formData.serviceLocation === "south"
        ? "South Branch"
        : formData.serviceLocation === "mobile"
        ? (formData.address ? `Mobile Service (${formData.address})` : "Mobile Service")
        : ""

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      service_name: serviceName,
      additional_services: additionalServiceNames,
      price: totalPrice,
      location: locationLabel,
      status: "confirmed",
      scheduled_date: formData.preferredDate,
      scheduled_time: formData.preferredTime,
      vehicle_make: formData.vehicleMake || null,
      vehicle_model: formData.vehicleModel || null,
      vehicle_year: formData.vehicleYear ? parseInt(formData.vehicleYear, 10) : null,
      license_plate: formData.licensePlate || null,
      vin: null,
      notes: formData.specialInstructions || null,
    })

    if (error) {
      console.error("Error creating booking", error)
      toast({
        title: "Booking failed",
        description: "We couldn't create your booking. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Booking Confirmed!",
      description: `Your service has been scheduled for ${formData.preferredDate} at ${formData.preferredTime}`,
    })

    navigate("/bookings")
  }

  const toggleAdditionalService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(id => id !== serviceId)
        : [...prev.additionalServices, serviceId]
    }))
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 max-w-4xl">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Book Your Service</h1>
          <p className="text-muted-foreground">
            Schedule your car service in just a few minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Service Selection
                  </CardTitle>
                  <CardDescription>Choose your primary service and any add-ons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Primary Service *</Label>
                    <Select 
                      value={formData.serviceType} 
                      onValueChange={(value) => setFormData({...formData, serviceType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{service.name}</span>
                              <span className="ml-2 font-medium">{formatINR.format(service.price * 100)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedService && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{selectedService.name}</h4>
                          <p className="text-sm text-muted-foreground">Duration: {selectedService.duration}</p>
                        </div>
                        <div className="text-lg font-bold text-primary">{formatINR.format(selectedService.price * 100)}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Additional Services (Optional)</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {services
                        .filter(s => s.id.toString() !== formData.serviceType)
                        .map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`additional-${service.id}`}
                            checked={formData.additionalServices.includes(service.id.toString())}
                            onChange={() => toggleAdditionalService(service.id.toString())}
                            className="rounded border-border"
                          />
                          <label 
                            htmlFor={`additional-${service.id}`}
                            className="text-sm cursor-pointer flex items-center justify-between flex-1"
                          >
                            <span>{service.name}</span>
                            <span className="font-medium">{formatINR.format(service.price * 100)}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-year">Year</Label>
                      <Select 
                        value={formData.vehicleYear} 
                        onValueChange={(value) => setFormData({...formData, vehicleYear: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 25}, (_, i) => 2024 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-make">Make</Label>
                      <Input
                        id="vehicle-make"
                        placeholder="e.g., Toyota"
                        value={formData.vehicleMake}
                        onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-model">Model</Label>
                      <Input
                        id="vehicle-model"
                        placeholder="e.g., Camry"
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">License Plate (Optional)</Label>
                    <Input
                      id="license-plate"
                      placeholder="ABC-1234"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Your Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="preferred-date">Preferred Date *</Label>
                      <Input
                        id="preferred-date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred-time">Preferred Time *</Label>
                      <Select 
                        value={formData.preferredTime} 
                        onValueChange={(value) => setFormData({...formData, preferredTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-location">Service Location</Label>
                    <Select 
                      value={formData.serviceLocation} 
                      onValueChange={(value) => setFormData({...formData, serviceLocation: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="downtown">Downtown Service Center</SelectItem>
                        <SelectItem value="north">North Branch</SelectItem>
                        <SelectItem value="south">South Branch</SelectItem>
                        <SelectItem value="mobile">Mobile Service (Your Location)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.serviceLocation === "mobile" && (
                    <div className="space-y-2">
                      <Label htmlFor="address">Service Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name *</Label>
                      <Input
                        id="first-name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name *</Label>
                      <Input
                        id="last-name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="special-instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="special-instructions"
                      placeholder="Any specific concerns or requests..."
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>{selectedService.name}</span>
                        <span className="font-medium">{formatINR.format(selectedService.price * 100)}</span>
                      </div>
                      
                      {additionalServicesList.map((service) => (
                        <div key={service.id} className="flex items-center justify-between text-sm">
                          <span>{service.name}</span>
                          <span>{formatINR.format(service.price * 100)}</span>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{formatINR.format(totalPrice)}</span>
                      </div>
                    </div>
                  )}

                  {formData.preferredDate && formData.preferredTime && (
                    <div className="space-y-2 pt-4 border-t">
                      <h4 className="font-medium">Appointment Details</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formData.preferredDate}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formData.preferredTime}
                        </div>
                        {formData.serviceLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {formData.serviceLocation === "mobile" ? "Mobile Service" : formData.serviceLocation}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={!formData.serviceType || !formData.preferredDate || !formData.preferredTime}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    You'll receive a confirmation email with booking details
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}