import { motion } from "framer-motion";
import { useState } from "react";

const screens = [
  { id: 1, title: "Dashboard", description: "Your daily command center" },
  { id: 2, title: "Intentions", description: "Plan with purpose" },
  { id: 3, title: "Life Balance", description: "Track all dimensions" },
  { id: 4, title: "Focus Timer", description: "Deep work made simple" },
  { id: 5, title: "Reflections", description: "Grow through review" },
];

export const PreviewSection = () => {
  const [activeScreen, setActiveScreen] = useState(0);

  return (
    <section id="preview" className="py-32 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A glimpse into your intentional future.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Device mockup */}
          <div className="relative mx-auto max-w-3xl">
            {/* Browser frame */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground text-center">
                    app.xenith.io
                  </div>
                </div>
              </div>

              {/* Screen content */}
              <div className="aspect-video bg-background relative overflow-hidden">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="font-serif text-2xl font-bold">X</span>
                    </div>
                    <h3 className="text-xl font-serif font-medium mb-2">
                      {screens[activeScreen].title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {screens[activeScreen].description}
                    </p>
                  </div>
                </motion.div>

                {/* Decorative grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
            </div>
          </div>

          {/* Screen selector */}
          <div className="flex justify-center gap-2 mt-8">
            {screens.map((screen, index) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(index)}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  activeScreen === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {screen.title}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
