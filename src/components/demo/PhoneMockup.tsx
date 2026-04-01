import { ReactNode, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Signal, Wifi, Battery } from "lucide-react";

interface PhoneMockupProps {
  children: ReactNode;
}

export const PhoneMockup = ({ children }: PhoneMockupProps) => {
  const bodyOverflowRef = useRef<string | null>(null);

  const setBodyScrollDisabled = (disabled: boolean) => {
    if (typeof document === "undefined") return;
    if (disabled) {
      bodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = bodyOverflowRef.current ?? "";
      bodyOverflowRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = bodyOverflowRef.current ?? "";
      }
    };
  }, []);
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto max-w-[375px] w-full"
    >
      {/* iPhone 15 Pro Frame */}
      <div className="relative rounded-[55px] bg-demo-surface p-[12px] shadow-2xl">
        {/* Titanium outer ring */}
        <div className="absolute inset-0 rounded-[55px] bg-gradient-to-b from-demo-elevated via-demo-border to-demo-surface" />

        {/* Inner bezel */}
        <div className="relative rounded-[45px] bg-demo-bg overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
            <div className="w-[120px] h-[35px] bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-demo-surface mr-2" />
              <div className="w-2.5 h-2.5 rounded-full bg-demo-camera" />
            </div>
          </div>

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-40 px-8 py-3 flex items-center justify-between text-white text-xs font-medium">
            <span className="w-16">{getCurrentTime()}</span>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 w-16 justify-end">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>
          </div>

          {/* Screen Content */}
          <div
            className="relative h-[750px] overflow-hidden"
            onPointerDown={() => setBodyScrollDisabled(true)}
            onPointerUp={() => setBodyScrollDisabled(false)}
            onPointerCancel={() => setBodyScrollDisabled(false)}
            onPointerLeave={() => setBodyScrollDisabled(false)}
            onTouchStart={() => setBodyScrollDisabled(true)}
            onTouchEnd={() => setBodyScrollDisabled(false)}
          >
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};
