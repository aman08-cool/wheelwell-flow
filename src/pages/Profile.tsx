import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Car, KeyRound, LogOut, Trash } from "lucide-react";

interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number | null;
  vin?: string | null;
  color?: string | null;
  license_plate?: string | null;
}

export default function Profile({ initialSection }: { initialSection?: "vehicles" | "info" | "preferences" }) {
  const { user, profile, session, logout } = useAuth();
  const { toast } = useToast();

  // SEO tags
  useEffect(() => {
    const title = "Profile | AutoCare - Manage Account";
    const description = "Manage your AutoCare profile, vehicles, and preferences.";
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = description;
      document.head.appendChild(m);
    }

    const canonicalHref = window.location.origin + "/profile";
    let link = document.querySelector("link[rel=canonical]") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalHref;
  }, []);

  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [displayName, setDisplayName] = useState<string>(profile?.display_name ?? "");
  const [phone, setPhone] = useState<string>((profile as any)?.phone ?? "");

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setPhone((profile as any)?.phone ?? "");
  }, [profile]);

  // Preferences
  const prefs = useMemo(() => ({
    email_notifications: Boolean((profile as any)?.preferences?.email_notifications),
    sms_notifications: Boolean((profile as any)?.preferences?.sms_notifications),
  }), [profile]);
  const [emailNotifs, setEmailNotifs] = useState<boolean>(prefs.email_notifications);
  const [smsNotifs, setSmsNotifs] = useState<boolean>(prefs.sms_notifications);
  useEffect(() => {
    setEmailNotifs(prefs.email_notifications);
    setSmsNotifs(prefs.sms_notifications);
  }, [prefs]);

  // Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehLoading, setVehLoading] = useState(false);
  const [vehForm, setVehForm] = useState<Partial<Vehicle>>({ make: "", model: "", year: null, vin: "" });
  const [vehEditId, setVehEditId] = useState<string | null>(null);
  const [vehDialogOpen, setVehDialogOpen] = useState(false);

  const loadVehicles = async () => {
    if (!user) return;
    setVehLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("id, user_id, make, model, year, vin, color, license_plate")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load vehicles", description: error.message, variant: "destructive" });
    } else {
      setVehicles((data as any) ?? []);
    }
    setVehLoading(false);
  };

  useEffect(() => { loadVehicles(); }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, phone })
      .eq("user_id", user.id);

    setLoading(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Profile updated" });
    setEditOpen(false);
  };

  const savePreferences = async (next: { email_notifications?: boolean; sms_notifications?: boolean }) => {
    if (!user) return;
    const merged = {
      ...(profile as any)?.preferences,
      ...next,
    };
    const { error } = await supabase
      .from("profiles")
      .update({ preferences: merged })
      .eq("user_id", user.id);
    if (error) toast({ title: "Preferences update failed", description: error.message, variant: "destructive" });
    else toast({ title: "Preferences updated" });
  };

  const changePassword = async (pwd: string, confirm: string) => {
    if (!pwd) return toast({ title: "Password required", variant: "destructive" });
    if (pwd !== confirm) return toast({ title: "Passwords do not match", variant: "destructive" });
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) return toast({ title: "Password change failed", description: error.message, variant: "destructive" });
    toast({ title: "Password changed" });
    setPwdOpen(false);
  };

  const saveVehicle = async () => {
    if (!user) return;
    const payload = {
      user_id: user.id,
      make: vehForm.make || "",
      model: vehForm.model || "",
      year: vehForm.year ? Number(vehForm.year) : null,
      vin: vehForm.vin || null,
      color: vehForm.color || null,
      license_plate: vehForm.license_plate || null,
    } as any;

    let error;
    if (vehEditId) {
      ({ error } = await supabase.from("vehicles").update(payload).eq("id", vehEditId).eq("user_id", user.id));
    } else {
      ({ error } = await supabase.from("vehicles").insert(payload));
    }

    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Vehicle saved" });
    setVehDialogOpen(false);
    setVehEditId(null);
    setVehForm({ make: "", model: "", year: null, vin: "" });
    loadVehicles();
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Vehicle deleted" });
    loadVehicles();
  };

  const handleDeleteAccount = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("delete-user");
      if (error) throw error;
      toast({ title: "Account deleted" });
      // local logout just in case
      await logout();
    } catch (e: any) {
      toast({
        title: "Delete account failed",
        description: e?.message || "Please ensure the delete-user edge function and secrets are configured.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please log in to manage your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <main className="container py-6 space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground">View and manage your information, vehicles, and preferences.</p>
      </header>

      {/* User Info */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Update your name and phone number.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="display_name">Full Name</Label>
                    <Input id="display_name" value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={phone}
                      onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={saveProfile} disabled={loading}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Full Name</div>
              <div className="font-medium">{profile?.display_name || user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email Address</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phone Number</div>
              <div className="font-medium">{(profile as any)?.phone || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Role</div>
              <div className="font-medium"><Badge variant="secondary">{profile?.role || "customer"}</Badge></div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Vehicles */}
      <section id="vehicles">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vehicles</CardTitle>
              <CardDescription>Manage your vehicles</CardDescription>
            </div>
            <Dialog open={vehDialogOpen} onOpenChange={setVehDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Car className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{vehEditId ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2 sm:grid-cols-2">
                  <div className="grid gap-2 sm:col-span-2">
                    <Label>Make</Label>
                    <Input value={vehForm.make as string} onChange={(e) => setVehForm(v => ({ ...v, make: e.target.value }))} />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label>Model</Label>
                    <Input value={vehForm.model as string} onChange={(e) => setVehForm(v => ({ ...v, model: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Year</Label>
                    <Input type="number" value={(vehForm.year as any) ?? ""} onChange={(e) => setVehForm(v => ({ ...v, year: e.target.value ? Number(e.target.value) : null }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>VIN</Label>
                    <Input value={(vehForm.vin as any) ?? ""} onChange={(e) => setVehForm(v => ({ ...v, vin: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Color</Label>
                    <Input value={(vehForm.color as any) ?? ""} onChange={(e) => setVehForm(v => ({ ...v, color: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>License Plate</Label>
                    <Input value={(vehForm.license_plate as any) ?? ""} onChange={(e) => setVehForm(v => ({ ...v, license_plate: e.target.value }))} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={saveVehicle}>Save Vehicle</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehLoading && <div className="text-sm text-muted-foreground">Loading vehicles…</div>}
              {!vehLoading && vehicles.length === 0 && (
                <div className="text-sm text-muted-foreground">No vehicles yet.</div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {vehicles.map((v) => (
                  <div key={v.id} className="rounded-md border p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{v.make} {v.model} {v.year ? `(${v.year})` : ""}</div>
                      <div className="text-sm text-muted-foreground">{v.vin || "No VIN"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => { setVehEditId(v.id); setVehForm(v); setVehDialogOpen(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete vehicle?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteVehicle(v.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Preferences */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates about bookings and offers via email.</div>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={(checked) => { setEmailNotifs(checked); savePreferences({ email_notifications: checked }); }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS notifications</div>
                <div className="text-sm text-muted-foreground">Receive reminders via text message.</div>
              </div>
              <Switch checked={smsNotifs} onCheckedChange={(checked) => { setSmsNotifs(checked); savePreferences({ sms_notifications: checked }); }} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Account actions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Security and account management</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary"><KeyRound className="mr-2 h-4 w-4"/>Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <PasswordForm onSubmit={changePassword} loading={loading} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash className="mr-2 h-4 w-4"/>Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function PasswordForm({ onSubmit, loading }: { onSubmit: (pwd: string, confirm: string) => void; loading: boolean }) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input id="new-password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={() => onSubmit(pwd, confirm)} disabled={loading}>Update Password</Button>
      </div>
    </div>
  );
}
