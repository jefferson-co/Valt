import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/ui/Sidebar";
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
    <div className="flex h-screen" style={{ background: "#FAFAFA" }}>
      <Sidebar
        username={profile.username}
        displayName={profile.display_name}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[960px] p-8">{children}</div>
      </main>
    </div>
  );
}
