import { useState, type FormEvent } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { SUPPORT_EMAIL } from "@/lib/legal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const FeedbackPopup = () => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Please add feedback before sending.");
      return;
    }

    const currentPath = window.location.pathname;
    const emailSubject = subject.trim() || "Xenith Feedback";
    const emailBody = [
      `Page: ${currentPath}`,
      "",
      trimmedMessage,
    ].join("\n");

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      emailSubject,
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailto;
    setOpen(false);
    setSubject("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg"
        >
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>
            Share bugs, ideas, or friction points. We’ll send this to{" "}
            {SUPPORT_EMAIL}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (optional)"
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What should we improve?"
              className="min-h-28"
              maxLength={4000}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">Send to support</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
