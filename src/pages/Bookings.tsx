import { Calendar, Clock, MapPin, Phone, Car } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
type Booking = {
  id: string
  service_name: string
  scheduled_date: string
  scheduled_time: string
  status: string
  location: string | null
  vehicle_make: string | null
  vehicle_model: string | null
  vehicle_year: number | null
  price: number | null
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        setBookings([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error loading bookings', error)
        setBookings([])
      } else {
        setBookings((data || []) as any)
      }
      setLoading(false)
    }
    load()
  }, [])

  const { toast } = useToast()
  const handleCancel = async (id: string) => {
    const snapshot = [...bookings]
    setBookings((prev) => prev.filter((b) => b.id !== id))
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) {
      console.error('Cancel booking error', error)
      setBookings(snapshot)
      toast({ title: 'Failed to cancel', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Booking cancelled', description: 'The booking was removed.' })
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-6">
        {loading && <div className="text-muted-foreground">Loading bookings...</div>}
        {!loading && bookings.length === 0 && (
          <div className="text-muted-foreground">No bookings yet.</div>
        )}
        {!loading && bookings.map((booking) => {
          const vehicle = [booking.vehicle_year, booking.vehicle_make, booking.vehicle_model].filter(Boolean).join(' ')
          const price = typeof booking.price === 'number' ? booking.price : Number(booking.price || 0)
          return (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{booking.service_name}</CardTitle>
                  <StatusBadge status={booking.status as any} />
                </div>
                <CardDescription>{vehicle || 'Vehicle'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.scheduled_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.scheduled_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.location || 'Location'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-lg font-bold text-primary">${price.toFixed(2)}</div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(booking.id)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
