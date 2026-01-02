import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyGalleryProps {
  images: string[];
  name: string;
  fullSize?: boolean;
}

const PropertyGallery = ({ images, name, fullSize = false }: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const newIndex = prev + newDirection;
      if (newIndex < 0) return images.length - 1;
      if (newIndex >= images.length) return 0;
      return newIndex;
    });
  };

  return (
    <div className={`relative overflow-hidden ${fullSize ? 'aspect-[16/9] rounded-2xl' : 'aspect-[4/3]'}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${name} - Foto ${currentIndex + 1}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        onClick={(e) => paginate(-1, e)}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
      >
        <ChevronLeft className="h-4 w-4 text-foreground" />
      </button>
      <button
        onClick={(e) => paginate(1, e)}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
      >
        <ChevronRight className="h-4 w-4 text-foreground" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex % 5
                ? 'w-4 bg-background'
                : 'w-1.5 bg-background/60'
            }`}
          />
        ))}
        {images.length > 5 && (
          <span className="text-xs text-background/80 ml-1">+{images.length - 5}</span>
        )}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-x-0 bottom-0 h-20 gradient-overlay pointer-events-none" />
    </div>
  );
};

export default PropertyGallery;
