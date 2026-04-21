import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        const Tag = prop as string;
        return ({
          children,
          ...rest
        }: React.HTMLAttributes<HTMLElement> & {
          children?: React.ReactNode;
        }) => {
          const filtered = Object.fromEntries(
            Object.entries(rest).filter(
              ([key]) =>
                ![
                  "initial",
                  "animate",
                  "exit",
                  "transition",
                  "whileHover",
                  "whileTap",
                  "whileInView",
                  "viewport",
                  "layout",
                ].includes(key),
            ),
          );
          return React.createElement(Tag, filtered, children);
        };
      },
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useScroll: () => ({ scrollYProgress: 0 }),
  useTransform: () => 0,
}));

import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { PricingSection } from "@/components/sections/PricingSection";

describe("Landing conversion", () => {
  it("renders hero primary CTA to signin", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );

    const startLink = screen.getByRole("link", { name: /start free beta now/i });
    expect(startLink).toHaveAttribute("href", "/signin");
    expect(screen.queryByText(/waitlist/i)).not.toBeInTheDocument();
  });

  it("renders CTA section actions without waitlist language", () => {
    render(
      <MemoryRouter>
        <CTASection />
      </MemoryRouter>,
    );

    const startLink = screen.getByRole("link", {
      name: /start free beta now/i,
    });
    expect(startLink).toHaveAttribute("href", "/signin");
    expect(screen.queryByText(/join waitlist/i)).not.toBeInTheDocument();
  });

  it("routes free-beta pricing CTA directly to signup", () => {
    render(
      <MemoryRouter>
        <PricingSection />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /start free beta/i })).toHaveAttribute(
      "href",
      "/signin",
    );

    expect(
      screen.queryByRole("link", { name: /start pro/i }),
    ).not.toBeInTheDocument();
  });
});
