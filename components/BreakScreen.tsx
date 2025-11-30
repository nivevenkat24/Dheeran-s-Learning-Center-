import React from 'react';

interface BreakScreenProps {
  onContinue: () => void;
  onExit: () => void;
}

export const BreakScreen: React.FC<BreakScreenProps> = ({ onContinue, onExit }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8 bg-cream-50">
      <div className="w-32 h-32 bg-olive-100 rounded-full flex items-center justify-center mb-6 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-olive-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-stone-700 mb-4">
        We answered 5 questions.
      </h2>
      <p className="text-xl text-stone-500 mb-12">
        Do you want to take a break or keep going?
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button 
          onClick={onContinue}
          className="flex-1 py-4 bg-sage-500 text-white rounded-2xl font-bold text-xl hover:bg-sage-400 transition-colors shadow-md"
        >
          Keep Going
        </button>
        <button 
          onClick={onExit}
          className="flex-1 py-4 bg-white text-stone-600 border-2 border-stone-200 rounded-2xl font-bold text-xl hover:bg-stone-50 hover:border-stone-300 transition-colors"
        >
          Take a Break
        </button>
      </div>
    </div>
  );
};