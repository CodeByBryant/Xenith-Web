import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock Supabase so the form always takes the localStorage path in tests
vi.mock("@/lib/supabase", () => ({
  supabase: null,
  isSupabaseConfigured: false,
}));

import { WaitlistForm } from "@/components/WaitlistForm";

describe("WaitlistForm", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("renders the email input and submit button", () => {
    render(<WaitlistForm />);
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(screen.getByText("Join Waitlist")).toBeInTheDocument();
  });

  it("shows an error for invalid email", async () => {
    render(<WaitlistForm />);
    const input = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input, { target: { value: "not-an-email" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("rejects an email exceeding 254 characters", async () => {
    render(<WaitlistForm />);
    const input = screen.getByPlaceholderText("your@email.com");
    const longEmail = "a".repeat(243) + "@example.com"; // 255 chars — just over the 254 limit
    fireEvent.change(input, { target: { value: longEmail } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("rejects emails that pass the old regex but are invalid (e.g. XSS-like local part)", async () => {
    render(<WaitlistForm />);
    const input = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input, { target: { value: "<script>@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("rejects an email with a single-character TLD", async () => {
    render(<WaitlistForm />);
    const input = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input, { target: { value: "user@example.c" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("falls back to localStorage when Supabase is unconfigured", async () => {
    render(<WaitlistForm variant="hero" />);

    const input = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);

    // Success paragraph renders outside the AnimatePresence button transition
    await waitFor(() => {
      expect(
        screen.getByText("We'll notify you when Xenith launches."),
      ).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem("xenith_waitlist") || "[]");
    expect(stored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: "test@example.com" }),
      ]),
    );
  });

  it("prevents duplicate localStorage entries", async () => {
    const { unmount } = render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input, { target: { value: "dupe@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByText("We'll notify you when Xenith launches."),
      ).toBeInTheDocument();
    });
    unmount();

    // Submit the same email again
    render(<WaitlistForm />);
    const input2 = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input2, { target: { value: "dupe@example.com" } });
    fireEvent.submit(input2.closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByText("We'll notify you when Xenith launches."),
      ).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem("xenith_waitlist") || "[]");
    const dupes = stored.filter(
      (e: { email: string }) => e.email === "dupe@example.com",
    );
    expect(dupes).toHaveLength(1);
  });

  it("captures the selected plan from sessionStorage", async () => {
    sessionStorage.setItem("xenith_selected_plan", "pro");
    render(<WaitlistForm variant="hero" />);

    const input = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(input, { target: { value: "plan@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByText("We'll notify you when Xenith launches."),
      ).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem("xenith_waitlist") || "[]");
    expect(stored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: "plan@example.com", source: "hero:pro" }),
      ]),
    );

    // sessionStorage key should have been consumed
    expect(sessionStorage.getItem("xenith_selected_plan")).toBeNull();
  });
});
