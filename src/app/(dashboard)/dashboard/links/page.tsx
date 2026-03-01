"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import type { Link as LinkType } from "@/types/database";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    setLinks((data as LinkType[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  function openAddModal() {
    setEditingLink(null);
    setTitle("");
    setUrl("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(link: LinkType) {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setSaving(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingLink) {
      const { error: updateError } = await supabase
        .from("links")
        .update({ title: title.trim(), url: url.trim() })
        .eq("id", editingLink.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const newPosition = links.length;
      const { error: insertError } = await supabase.from("links").insert({
        user_id: user.id,
        title: title.trim(),
        url: url.trim(),
        position: newPosition,
      });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setShowModal(false);
    loadLinks();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("links").delete().eq("id", id);
    setDeleteConfirm(null);
    loadLinks();
  }

  async function handleToggleActive(link: LinkType) {
    const supabase = createClient();
    await supabase
      .from("links")
      .update({ is_active: !link.is_active })
      .eq("id", link.id);
    loadLinks();
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;

    [newLinks[index], newLinks[swapIndex]] = [
      newLinks[swapIndex],
      newLinks[index],
    ];

    // Optimistic update
    setLinks(newLinks);

    const supabase = createClient();
    await Promise.all(
      newLinks.map((link, i) =>
        supabase.from("links").update({ position: i }).eq("id", link.id)
      )
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Links</h1>
          <p className="mt-1 text-muted-foreground">
            Manage the links on your Valt page.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add link
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading links...</p>
        )}

        {!loading && links.length === 0 && (
          <Card className="py-12 text-center">
            <p className="text-muted-foreground">No links yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first link to get started.
            </p>
          </Card>
        )}

        {links.map((link, index) => (
          <Card
            key={link.id}
            className={`flex items-center gap-4 p-4 ${
              !link.is_active ? "opacity-50" : ""
            }`}
          >
            <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{link.title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {link.url}
              </p>
            </div>

            <span className="shrink-0 text-xs text-muted-foreground">
              {link.clicks} click{link.clicks !== 1 ? "s" : ""}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => handleReorder(index, "up")}
                disabled={index === 0}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleReorder(index, "down")}
                disabled={index === links.length - 1}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleToggleActive(link)}
                className={`rounded-lg px-2 py-1 text-xs font-medium ${
                  link.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {link.is_active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => openEditModal(link)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              {deleteConfirm === link.id ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(link.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingLink ? "Edit link" : "Add link"}
      >
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="link-title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Portfolio"
            required
          />
          <Input
            id="link-url"
            label="URL"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingLink ? "Save" : "Add link"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
