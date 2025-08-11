import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ChatMessage = { role: "user" | "assistant"; content: string };

type BookingIntent = {
  action: "propose_booking" | "none";
  service_name?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  preferred_date?: string; // YYYY-MM-DD
  preferred_time?: string; // e.g., 09:00 AM
  location?: string;
};

type ChatResponse = {
  reply: string;
  intent?: BookingIntent;
};

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I can help you book a service. What do you need?" },
  ]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const [proposed, setProposed] = useState<BookingIntent | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, proposed, open]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || pending) return;

    const nextMsgs = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMsgs);
    setInput("");
    setPending(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-booking", {
        body: { messages: nextMsgs },
      });
      if (error) throw error;

      const resp = (data as ChatResponse) || { reply: "Sorry, something went wrong.", intent: { action: "none" } };

      setMessages((prev) => [...prev, { role: "assistant", content: resp.reply }]);
      if (resp.intent && resp.intent.action === "propose_booking") {
        setProposed(resp.intent);
      } else {
        setProposed(null);
      }
    } catch (e: any) {
      console.error("Assistant error", e);
      toast({
        title: "Assistant error",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  const confirmBooking = async () => {
    if (!proposed) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        toast({ title: "Login required", description: "Please log in to continue.", variant: "destructive" });
        return;
      }

      const { service_name, vehicle_make, vehicle_model, vehicle_year, preferred_date, preferred_time, location } = proposed;

      if (!service_name || !preferred_date || !preferred_time) {
        toast({ title: "Missing details", description: "Service, date and time are required.", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        service_name,
        additional_services: [],
        price: 0,
        location: location || null,
        status: "confirmed",
        scheduled_date: preferred_date,
        scheduled_time: preferred_time,
        vehicle_make: vehicle_make || null,
        vehicle_model: vehicle_model || null,
        vehicle_year: vehicle_year ?? null,
        license_plate: null,
        vin: null,
        notes: null,
      });

      if (error) throw error;

      toast({ title: "Booking confirmed", description: "We've saved your booking." });
      setProposed(null);
      setOpen(false);
      navigate("/bookings");
    } catch (e: any) {
      console.error("Confirm booking error", e);
      toast({ title: "Failed to save", description: e?.message || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <Button onClick={() => setOpen(true)} className="shadow-md">
          <MessageCircle className="mr-2 h-4 w-4" />
          Assistant
        </Button>
      )}

      {open && (
        <Card className="w-[340px] sm:w-[380px] shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">Booking Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div ref={listRef} className="h-64 overflow-y-auto space-y-3 pr-1">
              {messages.map((m, idx) => (
                <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div className={`inline-block rounded-md px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {proposed && (
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Proposed booking</div>
                  <div className="rounded-md border p-3 text-sm space-y-1">
                    {proposed.service_name && <div><span className="font-medium">Service:</span> {proposed.service_name}</div>}
                    {proposed.vehicle_year || proposed.vehicle_make || proposed.vehicle_model ? (
                      <div>
                        <span className="font-medium">Vehicle:</span> {[proposed.vehicle_year, proposed.vehicle_make, proposed.vehicle_model].filter(Boolean).join(" ")}
                      </div>
                    ) : null}
                    {proposed.preferred_date && proposed.preferred_time && (
                      <div><span className="font-medium">When:</span> {proposed.preferred_date} at {proposed.preferred_time}</div>
                    )}
                    {proposed.location && <div><span className="font-medium">Location:</span> {proposed.location}</div>}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={confirmBooking} disabled={!((proposed?.service_name) && (proposed?.preferred_date) && (proposed?.preferred_time))}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setProposed(null)}>Edit</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Describe what you need..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={pending}
              />
              <Button onClick={send} disabled={pending}>Send</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
