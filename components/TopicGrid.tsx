import React from 'react';
import { LessonTopic } from '../types';

interface TopicGridProps {
  onSelect: (topic: LessonTopic) => void;
}

const topics = Object.values(LessonTopic);

export const TopicGrid: React.FC<TopicGridProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-stone-700 text-center mb-2 font-sans tracking-tight">
        Dheeran's Learning Center
      </h1>
      <p className="text-stone-500 text-center mb-10 text-xl font-light">
        What shall we learn today?
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelect(topic)}
            className="
              h-36 rounded-3xl bg-white border-2 border-sand-200 
              shadow-sm hover:shadow-lg hover:border-olive-300 hover:bg-olive-100
              transition-all duration-300 flex flex-col items-center justify-center
              text-stone-600 font-semibold text-xl active:scale-95 group
            "
          >
            <span className="group-hover:scale-110 transition-transform duration-300">
              {topic}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};