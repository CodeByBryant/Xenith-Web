import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, X, Trash2, Edit2, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useConnections } from "@/hooks/use-connections";
import type { Connection } from "@/lib/types";
import { toast } from "sonner";

const RELATIONSHIP_TYPES = ["Family", "Friend", "Partner", "Colleague", "Mentor", "Other"];

export default function ConnectionTracker() {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [lastContactDate, setLastContactDate] = useState("");
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const { connections, isLoading, add, update, logContact, remove, isLoggingContact } = useConnections();

  const resetForm = () => {
    setName("");
    setRelationshipType("");
    setLastContactDate("");
    setHealthScore(null);
    setNotes("");
    setEditingId(null);
  };

  const loadConnection = (connection: Connection) => {
    setName(connection.name);
    setRelationshipType(connection.relationship_type || "");
    setLastContactDate(connection.last_contact_date || "");
    setHealthScore(connection.health_score);
    setNotes(connection.notes || "");
    setEditingId(connection.id);
    setShowAdd(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      const input = {
        name: name.trim(),
        relationship_type: relationshipType.trim() || undefined,
        last_contact_date: lastContactDate || undefined,
        health_score: healthScore || undefined,
        notes: notes.trim() || undefined,
      };

      if (editingId) {
        await update({ id: editingId, input });
        toast.success("Connection updated");
      } else {
        await add(input);
        toast.success("Connection added");
      }

      resetForm();
      setShowAdd(false);
    } catch {
      toast.error("Failed to save connection");
    }
  };

  const handleLogContact = async (id: string) => {
    try {
      await logContact(id);
      toast.success("Contact logged");
    } catch {
      toast.error("Failed to log contact");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this connection?")) return;
    try {
      await remove(id);
      toast.success("Connection deleted");
    } catch {
      toast.error("Failed to delete connection");
    }
  };

  const daysSinceContact = (lastContact: string | null) => {
    if (!lastContact) return null;
    const today = new Date();
    const contactDate = new Date(lastContact);
    const diffTime = today.getTime() - contactDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/10">
              <Users className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Connection Tracker</h1>
              <p className="text-xs text-muted-foreground">Track relationships & interactions</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
            variant={showAdd ? "ghost" : "default"}
            className="rounded-xl"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Name</label>
                <Input
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Relationship</label>
                <div className="grid grid-cols-3 gap-2">
                  {RELATIONSHIP_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setRelationshipType(type)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-medium transition-all border",
                        relationshipType === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border hover:border-primary/40"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Last Contact</label>
                <Input
                  type="date"
                  value={lastContactDate}
                  onChange={(e) => setLastContactDate(e.target.value)}
                  className="rounded-xl max-w-xs"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Relationship Health (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setHealthScore(score === healthScore ? null : score)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all border",
                        healthScore === score
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border hover:border-primary/40"
                      )}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Notes</label>
                <Textarea
                  placeholder="Last conversation topic, reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!name.trim()}
                  className="flex-1 rounded-xl"
                >
                  {editingId ? "Update" : "Add"} Connection
                </Button>
                {editingId && (
                  <Button
                    onClick={() => {
                      resetForm();
                    }}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connections List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
        ) : connections.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No connections yet. Add someone to stay in touch with.
          </div>
        ) : (
          connections.map((connection) => {
            const days = daysSinceContact(connection.last_contact_date);
            const isOverdue = days !== null && days > 30;

            return (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{connection.name}</h3>
                      {connection.relationship_type && (
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-md">
                          {connection.relationship_type}
                        </span>
                      )}
                      {connection.health_score && (
                        <span className="text-xs text-muted-foreground">
                          {"★".repeat(connection.health_score)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      {days === null ? (
                        <span>No contact recorded</span>
                      ) : days === 0 ? (
                        <span className="text-green-500">Contacted today</span>
                      ) : (
                        <span className={cn(isOverdue && "text-orange-500")}>
                          {days} {days === 1 ? "day" : "days"} ago
                          {isOverdue && " ⚠️"}
                        </span>
                      )}
                    </div>

                    {connection.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {connection.notes}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLogContact(connection.id)}
                        disabled={isLoggingContact}
                        className="flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-400 transition-colors font-medium"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Log Contact
                      </button>
                      <button
                        onClick={() => loadConnection(connection)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(connection.id)}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
