"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import type { Section } from "@/types/database";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("sections")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    setSections((data as Section[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  function openAddModal() {
    setEditingSection(null);
    setTitle("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(section: Section) {
    setEditingSection(section);
    setTitle(section.title);
    setError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingSection) {
      const { error: updateError } = await supabase
        .from("sections")
        .update({ title: title.trim() })
        .eq("id", editingSection.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const newPosition = sections.length;
      const { error: insertError } = await supabase.from("sections").insert({
        user_id: user.id,
        title: title.trim(),
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
    loadSections();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("sections").delete().eq("id", id);
    setDeleteConfirm(null);
    loadSections();
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;

    [newSections[index], newSections[swapIndex]] = [
      newSections[swapIndex],
      newSections[index],
    ];

    setSections(newSections);

    const supabase = createClient();
    await Promise.all(
      newSections.map((section, i) =>
        supabase
          .from("sections")
          .update({ position: i })
          .eq("id", section.id)
      )
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Sections</h1>
          <p className="mt-1 text-muted-foreground">
            Organize your links into sections.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add section
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading sections...</p>
        )}

        {!loading && sections.length === 0 && (
          <Card className="py-12 text-center">
            <p className="text-muted-foreground">No sections yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create sections to group your links.
            </p>
          </Card>
        )}

        {sections.map((section, index) => (
          <Card key={section.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{section.title}</p>
            </div>

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
                disabled={index === sections.length - 1}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => openEditModal(section)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {deleteConfirm === section.id ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
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
                  onClick={() => setDeleteConfirm(section.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingSection ? "Edit section" : "Add section"}
      >
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="section-title"
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Featured Links"
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
              {editingSection ? "Save" : "Add section"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
