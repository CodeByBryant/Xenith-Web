import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Finally, a productivity app that doesn't feel like a game or a corporate tool.",
    author: "Beta User",
    role: "Stanford University",
  },
  {
    quote: "The life dimensions feature completely changed how I think about balance.",
    author: "Early Tester",
    role: "Product Designer at Tech Startup",
  },
  {
    quote: "I've tried every productivity app. Xenith is the first one that actually stuck.",
    author: "Beta Member",
    role: "Medical Student",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const TestimonialsSection = () => {
  return (
    <section className="py-32 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Early believers
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            What our beta community is saying.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl p-8 relative"
            >
              <Quote className="w-8 h-8 text-muted-foreground/30 absolute top-6 right-6" />
              <p className="text-lg font-serif leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-medium text-sm">{testimonial.author}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
