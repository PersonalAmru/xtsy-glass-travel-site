import React, { useState, useEffect } from 'react';
import { Eye, Mountain, Star, Moon, Tent } from 'lucide-react';

interface SelectorOption {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface InteractiveSelectorProps {
  options: SelectorOption[];
  header?: string;
  subheader?: string;
}

const InteractiveSelector: React.FC<InteractiveSelectorProps> = ({
  options,
  header,
  subheader,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [options.length]);

  return (
    <div className="w-full max-w-[1260px] mx-auto">
      {(header || subheader) && (
        <div className="text-center mb-6">
          {header && (
            <h3 className="text-2xl md:text-3xl font-bold text-foreground animate-fadeInTop">
              {header}
            </h3>
          )}
          {subheader && (
            <p className="text-muted-foreground mt-2 text-base md:text-lg animate-fadeInTop delay-300">
              {subheader}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2 md:gap-3 h-[600px] md:h-[600px]">
        {options.map((option, index) => {
          const isActive = index === activeIndex;
          const isAnimated = animatedOptions.includes(index);

          return (
            <div
              key={index}
              className={`
                relative rounded-2xl overflow-hidden cursor-pointer
                transition-all duration-700 ease-in-out
                ${isActive ? 'flex-[4]' : 'flex-[0.6]'}
                ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[60px]'}
              `}
              style={{
                transition: 'flex 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease, transform 0.5s ease',
              }}
              onClick={() => handleOptionClick(index)}
            >
              {/* Shadow overlay */}
              <div
                className={`
                  absolute inset-0 z-10 transition-opacity duration-700
                  ${isActive
                    ? 'bg-gradient-to-t from-black/60 via-black/10 to-transparent'
                    : 'bg-black/50'}
                `}
              />

              {/* Image */}
              <img
                src={option.image}
                alt={option.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
                loading="lazy"
              />

              {/* Label */}
              <div
                className={`
                  absolute z-20 transition-all duration-500 ease-in-out
                  ${isActive
                    ? 'bottom-6 left-6 right-6'
                    : 'bottom-4 left-0 right-0 flex flex-col items-center'}
                `}
              >
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md
                    transition-all duration-500
                    ${isActive
                      ? 'bg-white/15 border border-white/20'
                      : 'bg-white/10 border border-white/10 justify-center'}
                  `}
                >
                  <div className="text-white shrink-0">
                    {option.icon}
                  </div>
                  <div
                    className={`
                      overflow-hidden transition-all duration-500
                      ${isActive ? 'max-w-[300px] opacity-100' : 'max-w-0 opacity-0'}
                    `}
                  >
                    <p className="text-white font-bold text-lg whitespace-nowrap">
                      {option.title}
                    </p>
                    <p className="text-white/80 text-sm whitespace-nowrap">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeInFromTop {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default InteractiveSelector;
