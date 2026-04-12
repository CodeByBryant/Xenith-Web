import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, X, Trash2, Edit2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useBooks } from "@/hooks/use-books";
import type { Book } from "@/lib/types";
import { toast } from "sonner";

const STATUS_CONFIG = {
  reading: { label: "Reading", icon: BookOpen, color: "text-blue-500" },
  completed: { label: "Completed", icon: BookOpen, color: "text-green-500" },
  paused: { label: "Paused", icon: BookOpen, color: "text-yellow-500" },
  abandoned: { label: "Abandoned", icon: BookOpen, color: "text-red-500" },
};

export default function BookTracker() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<Book["status"]>("reading");
  const [progress, setProgress] = useState("0");
  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [takeaways, setTakeaways] = useState("");
  const [notes, setNotes] = useState("");

  const { books, isLoading, add, update, remove } = useBooks(statusFilter);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setStatus("reading");
    setProgress("0");
    setTotalPages("");
    setCurrentPage("");
    setRating(null);
    setTakeaways("");
    setNotes("");
    setEditingId(null);
  };

  const loadBook = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author || "");
    setStatus(book.status);
    setProgress(String(book.progress_percent));
    setTotalPages(String(book.total_pages || ""));
    setCurrentPage(String(book.current_page || ""));
    setRating(book.rating);
    setTakeaways(book.key_takeaways || "");
    setNotes(book.notes || "");
    setEditingId(book.id);
    setShowAdd(true);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      const input = {
        title: title.trim(),
        author: author.trim() || undefined,
        status,
        progress_percent: parseInt(progress) || 0,
        total_pages: parseInt(totalPages) || undefined,
        current_page: parseInt(currentPage) || undefined,
        rating: rating || undefined,
        key_takeaways: takeaways.trim() || undefined,
        notes: notes.trim() || undefined,
        completed_date:
          status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
      };

      if (editingId) {
        await update({ id: editingId, input });
        toast.success("Book updated");
      } else {
        await add(input);
        toast.success("Book added");
      }

      resetForm();
      setShowAdd(false);
    } catch {
      toast.error("Failed to save book");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;
    try {
      await remove(id);
      toast.success("Book deleted");
    } catch {
      toast.error("Failed to delete book");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10">
              <BookOpen className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Book Tracker</h1>
              <p className="text-xs text-muted-foreground">Reading progress & insights</p>
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

        {/* Status filter */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-medium transition-all",
              !statusFilter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as string)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5",
                statusFilter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <config.icon className="w-3 h-3" />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form - Compact */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mx-4 mt-4 bg-card border border-border rounded-2xl shadow-sm"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Book Title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="rounded-xl"
                />
                <Input
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setStatus(key as Book["status"])}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1",
                      status === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <config.icon className="w-3 h-3" />
                    {config.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Progress %"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Total Pages"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value)}
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Current Page"
                  value={currentPage}
                  onChange={(e) => {
                    setCurrentPage(e.target.value);
                    if (totalPages && e.target.value) {
                      const percent = Math.round(
                        (parseInt(e.target.value) / parseInt(totalPages)) * 100
                      );
                      setProgress(String(percent));
                    }
                  }}
                  className="rounded-xl"
                />
              </div>

              {status === "completed" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(rating === star ? null : star)}
                        className="transition-all hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "w-5 h-5",
                            rating && star <= rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Textarea
                placeholder="Key Takeaways"
                value={takeaways}
                onChange={(e) => setTakeaways(e.target.value)}
                className="rounded-xl min-h-[60px]"
                rows={2}
              />

              <Textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl min-h-[60px]"
                rows={2}
              />

              <div className="flex gap-2 pt-1">
                <Button onClick={handleSubmit} className="flex-1 rounded-xl">
                  {editingId ? "Update Book" : "Add Book"}
                </Button>
                {editingId && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      resetForm();
                      setShowAdd(false);
                    }}
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

      {/* Books Grid - Shelf View */}
      <div className="p-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!isLoading && books.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No books yet. Tap + to add one.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => {
            const config = STATUS_CONFIG[book.status];
            const borderColorClass = {
              reading: "border-blue-500/40",
              completed: "border-green-500/40",
              paused: "border-yellow-500/40",
              abandoned: "border-red-500/40",
            }[book.status];

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "bg-card border-2 rounded-2xl p-4 hover:shadow-lg transition-all relative group",
                  borderColorClass
                )}
              >
                {/* Status badge */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadBook(book)}
                    className="h-7 w-7 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                    className="h-7 w-7 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>

                <div className="pr-16">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
                      config.color,
                      "bg-secondary/50"
                    )}
                  >
                    <config.icon className="w-3 h-3" />
                    {config.label}
                  </span>
                </div>

                {/* Book info */}
                <div className="mt-3 space-y-2">
                  <h3 className="font-bold text-base leading-tight line-clamp-2">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {book.author}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{book.progress_percent}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all rounded-full",
                          {
                            reading: "bg-blue-500",
                            completed: "bg-green-500",
                            paused: "bg-yellow-500",
                            abandoned: "bg-red-500",
                          }[book.status]
                        )}
                        style={{ width: `${book.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Page info */}
                  {book.current_page && book.total_pages && (
                    <div className="text-xs text-muted-foreground">
                      Page {book.current_page} of {book.total_pages}
                    </div>
                  )}

                  {/* Rating */}
                  {book.rating && (
                    <div className="flex gap-0.5 pt-1">
                      {Array.from({ length: book.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                  )}

                  {/* Takeaways preview */}
                  {book.key_takeaways && (
                    <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t border-border/50">
                      {book.key_takeaways}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
