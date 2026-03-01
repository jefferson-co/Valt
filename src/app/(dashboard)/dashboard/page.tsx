import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">
        Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Here&apos;s an overview of your Valt page.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="mt-1 font-display text-3xl font-bold">0</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          <p className="mt-1 font-display text-3xl font-bold">0</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Active Links</p>
          <p className="mt-1 font-display text-3xl font-bold">0</p>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="font-display text-lg font-semibold">Get started</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>1. Complete your profile in Settings</li>
          <li>2. Add your first links</li>
          <li>3. Connect your social accounts</li>
          <li>4. Customize your page appearance</li>
          <li>5. Share your Valt link!</li>
        </ul>
      </Card>
    </div>
  );
}
