"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { FileText, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CVPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("cv_url")
        .eq("id", user.id)
        .single();

      if (data?.cv_url) {
        setCvUrl(data.cv_url);
      }
    }
    loadProfile();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/cv.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("cv-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("cv-files").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ cv_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setCvUrl(publicUrl);
      setMessage("CV uploaded successfully!");
    }
    setUploading(false);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete() {
    setError("");
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/cv.pdf`;

    await supabase.storage.from("cv-files").remove([filePath]);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ cv_url: null })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setCvUrl(null);
      setMessage("CV removed.");
    }
    setDeleteConfirm(false);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">CV / Resume</h1>
      <p className="mt-1 text-muted-foreground">
        Upload a PDF of your CV. Visitors can view or download it from your
        public page.
      </p>

      {message && (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8">
        {cvUrl ? (
          <Card className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">CV uploaded</p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                Preview PDF
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4" />
                Replace
              </Button>
              {deleteConfirm ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card
            className="flex cursor-pointer flex-col items-center gap-3 py-12 hover:border-accent/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <Upload className="h-7 w-7 text-accent" />
            </div>
            <div className="text-center">
              <p className="font-medium">
                {uploading ? "Uploading..." : "Upload your CV"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF only, max 5MB
              </p>
            </div>
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
