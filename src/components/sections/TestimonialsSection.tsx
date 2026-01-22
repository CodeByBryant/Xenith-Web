import { motion } from "framer-motion";

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
    <section className="py-32 px-6 bg-foreground text-background">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            Early believers
          </h2>
          <p className="text-background/60 max-w-lg mx-auto text-lg">
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
              className="bg-background/5 border border-background/10 rounded-2xl p-8 relative hover:bg-background/10 transition-colors duration-300"
            >
              <div className="font-chomsky text-6xl text-background/20 absolute top-4 left-6">
                "
              </div>
              <p className="text-lg font-serif leading-relaxed mb-6 pt-8">
                {testimonial.quote}
              </p>
              <div>
                <p className="font-medium text-sm">{testimonial.author}</p>
                <p className="text-background/60 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
