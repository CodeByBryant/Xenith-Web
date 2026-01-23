import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I deleted Notion, Todoist, and three habit trackers. Xenith replaced them all.",
    author: "Jordan M.",
    role: "Stanford CS, Class of '26",
    metric: "Daily user for 4 months",
  },
  {
    quote: "The life dimensions feature made me realize I was crushing it at work while my health and relationships were dying.",
    author: "Alex K.",
    role: "Product Designer, Series A Startup",
    metric: "Rebalanced in 8 weeks",
  },
  {
    quote: "No gamification. No BS. Just a tool that respects my time and helps me execute.",
    author: "Sam R.",
    role: "Medical Student, Johns Hopkins",
    metric: "92% intention completion rate",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-32 md:py-48 px-6 bg-secondary/50 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8 mb-16"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-sans whitespace-nowrap">
            Beta Voices
          </span>
          <div className="h-px flex-1 bg-border" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1]">
              Early believers
              <br />
              <span className="text-muted-foreground">speak up.</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-4"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              We gave beta access to 500 students and young professionals. Here's what they said.
            </p>
          </motion.div>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="h-full bg-background border border-border rounded-2xl p-8 relative hover:border-foreground/20 transition-colors duration-300">
                {/* Quote mark */}
                <div className="font-chomsky text-7xl text-muted/20 absolute top-4 right-6 leading-none">
                  "
                </div>
                
                <div className="relative">
                  <p className="text-lg font-serif leading-relaxed mb-8 pr-8">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="pt-6 border-t border-border">
                    <p className="font-medium text-sm mb-1">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm mb-3">{testimonial.role}</p>
                    <p className="text-xs text-foreground/60 bg-secondary inline-block px-2 py-1 rounded">
                      {testimonial.metric}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
