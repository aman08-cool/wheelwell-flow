import { Car, Shield, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Car className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              AutoCare Service
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Professional car maintenance and repair services at your convenience. 
              Book online, track your service, and keep your vehicle running smoothly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a href="/login">Get Started</a>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Professional Car Service Made Easy
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              From routine maintenance to complex repairs, we've got you covered with 
              transparent pricing and convenient scheduling.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Quality Guaranteed</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Certified mechanics using genuine parts with comprehensive warranty coverage.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Convenient Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Book online 24/7, choose pickup & delivery, or visit our service centers.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Trusted Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Over 10,000 satisfied customers with 5-star service and transparent pricing.
                  </CardDescription>
                </CardContent>
              </Card>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of satisfied customers who trust AutoCare for their vehicle maintenance needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <a href="/login">Book Your Service</a>
              </Button>
              <Button variant="ghost" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}