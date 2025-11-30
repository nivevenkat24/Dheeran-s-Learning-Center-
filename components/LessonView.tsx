
import React, { useState, useEffect } from 'react';

interface LessonViewProps {
  imageSrc: string | null;
  questionText: string | null;
  concept: string | null;
  isLoading: boolean;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  onPlayPronunciation: (text: string) => Promise<void>;
}

export const LessonView: React.FC<LessonViewProps> = ({
  imageSrc,
  questionText,
  concept,
  isLoading,
  onNext,
  onPrevious,
  hasPrevious,
  onPlayPronunciation
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Reset reveal state when image changes
  useEffect(() => {
    setIsRevealed(false);
    setIsPlayingSound(false);
  }, [imageSrc]);

  const handleImageClick = () => {
    if (!isLoading && imageSrc) {
      setIsRevealed(prev => !prev);
    }
  };

  const handlePronounceClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!concept || isPlayingSound) return;
    
    setIsPlayingSound(true);
    try {
      await onPlayPronunciation(concept);
    } finally {
      setIsPlayingSound(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto p-4 relative">
      
      {/* Floating Previous Button - Left Center */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          disabled={isLoading}
          className={`
            fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-50
            w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300
            bg-white/80 text-stone-400 hover:bg-white hover:text-stone-600 border-2 border-stone-200 active:scale-95
          `}
          aria-label="Previous Question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      )}

      {/* Floating Next/Skip Button - Right Center */}
      <button
        onClick={onNext}
        disabled={isLoading}
        className={`
          fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50
          w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300
          ${isRevealed
            ? 'bg-terracotta-500 text-white hover:bg-terracotta-600 scale-110 animate-pulse ring-4 ring-terracotta-200' 
            : 'bg-white/80 text-stone-400 hover:bg-white hover:text-stone-600 border-2 border-stone-200 active:scale-95'
          }
        `}
        aria-label={isRevealed ? "Next Question" : "Skip Question"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

      {/* Question Text Area - Top */}
      <div className="text-center mb-6 min-h-[4rem] w-full flex items-end justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-700 animate-fade-in leading-relaxed">
           {questionText || "..."}
        </h2>
      </div>

      {/* Interactive Card Area */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-lg border-4 border-cream-200 overflow-hidden mb-4 p-6 transition-all duration-500 min-h-[300px] flex items-center justify-center"
      >
        {/* Image Container */}
        <div 
          onClick={handleImageClick}
          className={`
            relative flex-shrink-0 bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer
            ${isRevealed ? 'w-1/2 h-64' : 'w-full h-72'}
            ${isLoading ? 'animate-pulse' : ''}
            flex items-center justify-center
          `}
        >
          {isLoading ? (
            <div className="flex flex-col items-center text-stone-300">
              <div className="w-20 h-20 rounded-full bg-stone-100 mb-4"></div>
              <p>Thinking...</p>
            </div>
          ) : imageSrc ? (
             <img 
              src={imageSrc} 
              alt="Lesson object" 
              className="w-full h-full object-contain p-2 animate-fade-in select-none"
            />
          ) : (
            <div className="text-stone-400 text-center p-4">
              <p className="text-2xl mb-2">🖼️</p>
              <p>Image unavailable</p>
              <p className="text-xs mt-2">(Tap to see word)</p>
            </div>
          )}
        </div>

        {/* Reveal Content */}
        <div 
          className={`
             flex flex-col items-center justify-center text-center transition-all duration-500 ease-out
             ${isRevealed ? 'w-1/2 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10 pointer-events-none'}
          `}
        >
          {isRevealed && concept && (
            <>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-700 mb-4 tracking-[0.2em] uppercase break-words max-w-full">
                {concept}
              </h3>
              <button
                onClick={handlePronounceClick}
                disabled={isPlayingSound}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm
                  ${isPlayingSound ? 'bg-sage-200 text-sage-700' : 'bg-sage-100 text-sage-600 hover:bg-sage-200'}
                `}
              >
                {isPlayingSound ? (
                  <div className="w-6 h-6 border-2 border-sage-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>
              <p className="text-stone-400 text-sm mt-2 font-bold">
                {isPlayingSound ? "Playing..." : "Listen"}
              </p>
            </>
          )}
        </div>

        {/* Hint overlay if not revealed */}
        {!isRevealed && !isLoading && imageSrc && (
          <div className="absolute bottom-4 left-4 pointer-events-none z-10">
             <span className="bg-white/80 px-3 py-1 rounded-full text-xs text-stone-400 shadow-sm backdrop-blur-sm font-semibold">
               👆 Tap image to see word
             </span>
          </div>
        )}
      </div>
      
      {/* Instruction Text Area */}
      <div className="min-h-[3rem] w-full text-center flex items-center justify-center">
          {!isLoading && (
            <p className="text-stone-400 text-sm font-semibold tracking-wide animate-fade-in">
              {isRevealed ? "Tap arrow to continue" : "Tap the picture to see the answer"}
            </p>
          )}
      </div>
    </div>
  );
};
