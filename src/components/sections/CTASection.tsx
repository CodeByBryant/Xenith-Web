import { motion } from "framer-motion";
import { WaitlistForm } from "../WaitlistForm";

export const CTASection = () => {
  return (
    <section id="waitlist" className="py-32 px-6 bg-secondary/30 relative overflow-hidden">
      {/* Decorative X */}
      <div className="absolute bottom-0 right-0 font-chomsky text-[30rem] text-muted/10 pointer-events-none select-none translate-x-1/4 translate-y-1/4">
        X
      </div>
      
      <div className="container mx-auto max-w-2xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            Ready to live with <span className="text-muted-foreground">intention</span>?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
            Join our waitlist and be the first to know when we launch. 
            No spam. Just updates on launch and early access.
          </p>

          <div className="flex justify-center">
            <WaitlistForm variant="footer" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
