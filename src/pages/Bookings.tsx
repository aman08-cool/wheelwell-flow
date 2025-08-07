import { Calendar, Clock, MapPin, Phone, Car } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

const mockBookings = [
  {
    id: 1,
    serviceName: "Oil Change",
    date: "2024-08-15",
    time: "10:00 AM",
    status: "confirmed" as const,
    location: "Downtown Service Center",
    vehicle: "2020 Toyota Camry",
    price: 49.99
  },
  {
    id: 2,
    serviceName: "Brake Service",
    date: "2024-08-20",
    time: "2:00 PM", 
    status: "pending" as const,
    location: "Mobile Service",
    vehicle: "2019 Honda Civic",
    price: 149.99
  }
]

export default function Bookings() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-6">
        {mockBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{booking.serviceName}</CardTitle>
                <StatusBadge status={booking.status} />
              </div>
              <CardDescription>{booking.vehicle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-lg font-bold text-primary">${booking.price}</div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}