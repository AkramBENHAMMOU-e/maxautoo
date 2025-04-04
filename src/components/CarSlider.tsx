'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
}

interface CarSliderProps {
  cars: Car[];
}

export function CarSlider({ cars }: CarSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && cars.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
      }, 5000); // Change de voiture toutes les 5 secondes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, cars.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cars.length) % cars.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
  };

  if (cars.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[450px] group">
      <Image
        src={cars[currentIndex].image}
        alt={`${cars[currentIndex].brand} ${cars[currentIndex].model}`}
        fill
        className="object-contain z-10 drop-shadow-2xl transform transition-transform duration-500"
        priority
      />
      
      {/* Navigation buttons */}
      {cars.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Car info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <h3 className="text-xl font-bold">
          {cars[currentIndex].brand} {cars[currentIndex].model}
        </h3>
        <p className="text-lg">
          {cars[currentIndex].price}DH<span className="text-sm">/jour</span>
        </p>
      </div>

      {/* Dots navigation */}
      {cars.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {cars.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 