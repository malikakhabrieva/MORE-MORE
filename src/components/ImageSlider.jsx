import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [manualControl, setManualControl] = useState(false);
  const manualControlTimeoutRef = useRef(null);

  const resetManualControlTimeout = () => {
    if (manualControlTimeoutRef.current) {
      clearTimeout(manualControlTimeoutRef.current);
    }
    manualControlTimeoutRef.current = setTimeout(() => {
      setManualControl(false);
    }, 5000); // 5 секунд бездействия, затем возобновляем автопереключение
  };

  useEffect(() => {
    if (manualControl) {
      resetManualControlTimeout();
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, 3000); // Меняем изображение каждые 3 секунды
    return () => clearInterval(interval);
  }, [images.length, currentIndex, manualControl]);

  const goToPrev = () => {
    setManualControl(true);
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + images.length) % images.length
    );
    resetManualControlTimeout();
  };

  const goToNext = () => {
    setManualControl(true);
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
    resetManualControlTimeout();
  };

  return (
    <div className="image-slider relative w-full overflow-hidden rounded-lg shadow-lg">
      <div 
        className="slider-inner flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image) => (
          <img 
            key={image.id} 
            src={image.src} 
            alt={image.alt} 
            className="w-full flex-shrink-0 object-contain h-[70vh]"
          />
        ))}
      </div>

      {/* Стрелки навигации */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full shadow-md text-custom-black hover:bg-opacity-75 transition-all duration-300 z-10"
      >
        <FaChevronLeft className="text-xl" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full shadow-md text-custom-black hover:bg-opacity-75 transition-all duration-300 z-10"
      >
        <FaChevronRight className="text-xl" />
      </button>
    </div>
  );
}

export default ImageSlider; 