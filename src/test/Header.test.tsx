import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        const Tag = prop as string;
        return ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
          const filtered = Object.fromEntries(
            Object.entries(rest).filter(([k]) => !["initial", "animate", "exit", "transition", "whileHover", "whileTap"].includes(k))
          );
          return React.createElement(Tag, filtered, children);
        };
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock ThemeToggle
vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => null,
}));

import React from "react";
import { Header } from "@/components/Header";

describe("Header scroll handler", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    cafSpy = vi.spyOn(window, "cancelAnimationFrame");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers scroll listener with passive option", () => {
    render(<Header />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
  });

  it("uses requestAnimationFrame to throttle scroll updates", () => {
    render(<Header />);

    // Fire scroll event
    window.dispatchEvent(new Event("scroll"));
    expect(rafSpy).toHaveBeenCalled();
  });

  it("removes scroll listener on unmount", () => {
    const { unmount } = render(<Header />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("does not schedule multiple RAF calls while one is pending", () => {
    // Override RAF to NOT immediately invoke the callback (simulates pending frame)
    rafSpy.mockImplementation(() => 42);

    render(<Header />);

    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));

    // Only one RAF should have been scheduled
    expect(rafSpy).toHaveBeenCalledTimes(1);
  });
});
