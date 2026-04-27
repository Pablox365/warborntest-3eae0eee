"use client";
import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  avatar_url?: string | null;
  created_at: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration ?? 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0)].map((_, dupIdx) => (
          <React.Fragment key={dupIdx}>
            {props.testimonials.map((t) => (
              <div
                key={`${dupIdx}-${t.id}`}
                className="p-6 rounded-xl border border-border bg-card shadow-lg shadow-primary/5 max-w-xs w-full"
              >
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-3.5 h-3.5 ${
                        n <= t.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 font-body leading-relaxed line-clamp-6">
                  {t.message}
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/50">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover border border-primary/30"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading text-sm font-bold border border-primary/30">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="font-heading text-xs tracking-wider leading-5">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-body leading-4">
                      Miembro Warborn
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
