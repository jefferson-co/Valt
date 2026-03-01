import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/ui/TopNav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/signup/username");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <TopNav username={profile.username} displayName={profile.display_name} />
      <main>{children}</main>
    </div>
  );
}
