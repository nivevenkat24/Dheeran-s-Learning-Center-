
import React, { useState, useEffect, useRef } from 'react';
import { LessonTopic, LessonState, LessonHistoryItem } from './types';
import { loadLessonItem, generateSpeech } from './services/geminiService';
import { decodeAudioData, getAudioContext } from './utils/audioUtils';
import { TopicGrid } from './components/TopicGrid';
import { LessonView } from './components/LessonView';

const App: React.FC = () => {
  const [state, setState] = useState<LessonState>({
    currentQuestionIndex: 0,
    topic: null,
    isLoading: false,
    isPlayingAudio: false,
    currentImage: null,
    currentQuestionText: null,
    currentConcept: null,
    history: [],
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Pre-fetching: Store the Promise of the NEXT question
  const nextLessonPromiseRef = useRef<Promise<LessonHistoryItem> | null>(null);

  // Initialize AudioContext on first interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = getAudioContext();
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const stopAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      currentSourceRef.current = null;
    }
    setState(prev => ({ ...prev, isPlayingAudio: false }));
  };

  const playAudio = async (base64Audio: string) => {
    // Stop any currently playing audio before starting new one
    stopAudio();
    initAudio();
    if (!audioContextRef.current) return;
    
    try {
      const buffer = await decodeAudioData(base64Audio, audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      
      currentSourceRef.current = source;
      
      source.start(0);
      setState(prev => ({ ...prev, isPlayingAudio: true }));
      
      source.onended = () => {
        // Only update state if this is still the active source
        if (currentSourceRef.current === source) {
           setState(prev => ({ ...prev, isPlayingAudio: false }));
           currentSourceRef.current = null;
        }
      };
    } catch (e) {
      console.error("Playback error", e);
    }
  };

  // Helper: Ensure the next question is loading in background
  const ensureNextQuestionPreloaded = (topic: LessonTopic) => {
    if (!nextLessonPromiseRef.current) {
      console.log("Pre-fetching next question...");
      nextLessonPromiseRef.current = loadLessonItem(topic)
        .catch(err => {
          console.error("Pre-fetch failed", err);
          // Clear ref so we try again on demand
          nextLessonPromiseRef.current = null;
          throw err;
        });
    }
  };

  // Generate pronunciation for the specific concept word
  const handlePlayPronunciation = async (text: string): Promise<void> => {
    if (!text) return;
    // CRITICAL: Initialize audio immediately on user click, before awaiting network
    initAudio();
    
    let speechText = text;
    // Alphabet audio enhancement: "S... S for Sun"
    if (state.topic === LessonTopic.ALPHABET && text.includes(' for ')) {
        const letter = text.split(' ')[0];
        speechText = `${letter}... ${text}`;
    }

    const audioBase64 = await generateSpeech(speechText);
    if (audioBase64) {
      await playAudio(audioBase64);
    }
  };

  // Restore a question from history
  const restoreQuestion = (index: number) => {
    stopAudio(); // Ensure previous audio stops
    const item = state.history[index];
    if (!item) return;

    setState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      currentConcept: item.concept,
      currentQuestionText: item.questionText,
      currentImage: item.imageSrc,
      isLoading: false,
    }));

    // Optional: Replay question audio if stored (or just silent)
    if (item.questionAudio) {
       playAudio(item.questionAudio);
    }
    
    // Trigger preload for the item AFTER this one (if valid topic)
    if (state.topic) {
        ensureNextQuestionPreloaded(state.topic);
    }
  };

  // Fetch next question (either from preload or new)
  const fetchNextQuestion = async (topic: LessonTopic) => {
    stopAudio();
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      currentImage: null,
      currentQuestionText: null,
      currentConcept: null
    }));

    try {
      // Ensure we have a promise to wait on
      ensureNextQuestionPreloaded(topic);
      
      if (!nextLessonPromiseRef.current) {
          throw new Error("Failed to initialize lesson loader");
      }

      // Wait for the preloaded item
      const item = await nextLessonPromiseRef.current;
      
      // Clear the promise ref so we can preload the *next* one later
      nextLessonPromiseRef.current = null;

      setState(prev => ({ 
        ...prev, 
        currentImage: item.imageSrc, 
        currentConcept: item.concept,
        currentQuestionText: item.questionText,
        isLoading: false,
        history: [...prev.history, item],
        currentQuestionIndex: prev.history.length
      }));

      // Play Audio
      if (item.questionAudio) {
        await playAudio(item.questionAudio);
      }
      
      // Immediately start pre-loading the N+2 question
      ensureNextQuestionPreloaded(topic);

    } catch (error) {
      console.error("Load question failed", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleTopicSelect = (topic: LessonTopic) => {
    stopAudio();
    initAudio();
    nextLessonPromiseRef.current = null; // Reset preload
    
    setState(prev => ({ 
      ...prev, 
      topic, 
      currentQuestionIndex: 0, 
      history: [] // Clear history on new topic
    }));
    
    // Initial fetch
    fetchNextQuestion(topic);
  };

  const handleNext = () => {
    stopAudio();
    if (!state.topic) return;
    
    const nextIndex = state.currentQuestionIndex + 1;

    // Check if we already have this in history (navigating forward from back)
    if (nextIndex < state.history.length) {
      restoreQuestion(nextIndex);
    } else {
      // Get new (possibly preloaded)
      fetchNextQuestion(state.topic);
    }
  };

  const handlePrevious = () => {
    stopAudio();
    const prevIndex = state.currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      restoreQuestion(prevIndex);
    }
  };

  const handleExit = () => {
    stopAudio();
    nextLessonPromiseRef.current = null;
    setState({
      currentQuestionIndex: 0,
      topic: null,
      isLoading: false,
      isPlayingAudio: false,
      currentImage: null,
      currentQuestionText: null,
      currentConcept: null,
      history: [],
    });
  };

  // -- RENDER --

  if (!state.topic) {
    return <TopicGrid onSelect={handleTopicSelect} />;
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
       <header className="p-4 flex justify-between items-center max-w-3xl mx-auto w-full">
         <button 
            onClick={handleExit} 
            className="text-stone-400 hover:text-terracotta-500 text-sm font-bold uppercase tracking-wide transition-colors"
         >
           &larr; Home
         </button>
         <div className="text-stone-400 text-xs font-bold uppercase tracking-widest">
           {/* Counter removed as requested */}
           {state.topic}
         </div>
       </header>

       <main className="flex-grow">
         <LessonView 
           imageSrc={state.currentImage}
           questionText={state.currentQuestionText}
           concept={state.currentConcept}
           isLoading={state.isLoading}
           onNext={handleNext}
           onPrevious={handlePrevious}
           hasPrevious={state.currentQuestionIndex > 0}
           onPlayPronunciation={handlePlayPronunciation}
         />
       </main>
    </div>
  );
};

export default App;
