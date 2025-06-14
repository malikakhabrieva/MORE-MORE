import React from 'react';
import hero1 from '../../assets/images/hero-banner-1.jpg';
import hero2 from '../../assets/images/hero-banner-2.jpg';
import hero3 from '../../assets/images/hero-banner-3.jpg';

const Hero = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Полупрозрачный оверлей с текстом */}
      <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
        <h1 className="text-7xl md:text-9xl font-bold text-white/55 tracking-wider">
          MORE&MORE
        </h1>
      </div>
      
      {/* Контейнер для изображений */}
      <div className="flex w-full h-full">
        {/* Первое изображение */}
        <div className="w-1/3 h-full">
          <img
            src={hero1}
            alt="Hero Banner 1"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Второе изображение */}
        <div className="w-1/3 h-full">
          <img
            src={hero2}
            alt="Hero Banner 2"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Третье изображение */}
        <div className="w-1/3 h-full">
          <img
            src={hero3}
            alt="Hero Banner 3"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero; 