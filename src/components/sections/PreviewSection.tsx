import { motion } from "framer-motion";
import { XenithDemo } from "../demo/XenithDemo";

export const PreviewSection = () => {
  return (
    <section id="preview" className="py-32 px-6 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-muted/50 to-transparent rounded-full blur-3xl opacity-50" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            A fully interactive preview. Tap through the screens.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <XenithDemo />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          ↑ Interactive demo — tap to navigate ↑
        </motion.p>
      </div>
    </section>
  );
};
