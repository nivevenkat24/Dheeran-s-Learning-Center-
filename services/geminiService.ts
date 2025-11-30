
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LessonTopic, GenerationResult, FeedbackResult, LessonHistoryItem } from "../types";
import { TOPIC_DATA } from "../data/concepts";
import { getCachedLesson, setCachedLesson } from "./cacheService";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to pick a random concept
const getRandomConcept = (topic: LessonTopic): string => {
  const list = TOPIC_DATA[topic];
  if (!list || list.length === 0) return topic;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

// Orchestrator: Checks cache, generates if needed, returns full item
export const loadLessonItem = async (topic: LessonTopic): Promise<LessonHistoryItem> => {
  // 1. Pick a concept
  const specificConcept = getRandomConcept(topic);

  // 2. Check Cache
  const cached = getCachedLesson(specificConcept);
  if (cached) {
    console.log(`Cache hit for: ${specificConcept}`);
    return cached;
  }

  console.log(`Cache miss, generating: ${specificConcept}`);

  // 3. Generate Content (Parallel where possible)
  // We need the text first to get the prompt, but we can accept the raw concept for caching
  try {
    const lesson = await generateLessonContent(topic, specificConcept);
    
    const [imgBase64, questionAudioBase64] = await Promise.all([
      generateRealImage(lesson.imagePrompt, topic),
      generateSpeech(lesson.question)
    ]);

    const newItem: LessonHistoryItem = {
      id: Date.now().toString() + Math.random().toString(),
      concept: lesson.concept,
      questionText: lesson.question,
      imageSrc: imgBase64 || '',
      questionAudio: questionAudioBase64
    };

    // 4. Save to Cache
    setCachedLesson(specificConcept, newItem);
    
    return newItem;
  } catch (error) {
    console.error("Error loading lesson item:", error);
    throw error;
  }
};

// 1. Generate Lesson Content (Text Logic)
export const generateLessonContent = async (topic: LessonTopic, specificConcept: string): Promise<GenerationResult> => {
  const systemInstruction = `
    You are a gentle Montessori teacher for a 2-year-old.
    I have selected a specific concept for you to teach: "${specificConcept}".
    The general topic is: "${topic}".
    
    Rules for JSON Output:
    1. 'concept': This is the text displayed to the child and the expected answer.
       - It MUST be the SIMPLEST form.
       - If topic is Animals, Objects, Fruit, Vegetables: Use ONLY the noun (e.g. "Horse", NOT "Baby Horse"; "Apple", NOT "Red Apple").
       - If topic is Numbers: Use the digit (e.g. "5").
       - If topic is Colors: Use the color name (e.g. "Green").
       - If topic is Alphabet: Use the format "Letter for Object" (e.g. "S for Sun").
    
    2. 'question': Keep it under 5 words.
       - "What is this?"
       - "What animal is this?"
       - "How many?"
       - "What color?"
    
    3. 'imagePrompt': 
       - PHOTOREALISTIC, REAL PHOTOGRAPHY ONLY.
       - Soft natural lighting or studio lighting.
       - White or soft cream background.
       - NO CARTOONS, NO ILLUSTRATIONS, NO 3D RENDERS, NO HIGH CONTRAST.
       - If topic is Numbers (e.g. "Number 5"): The prompt MUST specify "5 distinct objects arranged in a flat lay grid or line, totally separated, non-overlapping, seen from top-down". Do NOT stack objects.
       - If topic is Alphabet: Show "the real Object and a wooden block with the Letter".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate lesson for: ${specificConcept}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "The simple word to teach (e.g. 'Horse', '5', 'Red', 'A for Apple')" },
            question: { type: Type.STRING, description: "The simple question to ask" },
            imagePrompt: { type: Type.STRING, description: "Prompt for generating a realistic image" },
          },
          required: ["concept", "question", "imagePrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as GenerationResult;
  } catch (error) {
    console.error("Lesson Generation Error:", error);
    throw error;
  }
};

// 2. Generate Image (Visuals)
export const generateRealImage = async (prompt: string, topic: LessonTopic): Promise<string | null> => {
  try {
    // Specific negative prompts based on topic
    let additionalPrompt = ". Photorealistic, 8k, highly detailed, soft studio lighting, isolated on white background. Real photography. NOT cartoon, NOT illustration, NOT drawing, NOT cgi.";
    
    if (topic === LessonTopic.ALPHABET) {
      additionalPrompt += " Show the real object next to a wooden letter block.";
    }
    
    if (topic === LessonTopic.NUMBERS) {
      additionalPrompt += " Objects must be completely separate, distinct, and countable. No stacks. Flat lay.";
    } else {
      // For all other topics, enforce SINGLE object
      additionalPrompt += " Show only ONE single isolated object. Center frame.";
    }

    const finalPrompt = prompt + additionalPrompt;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Warning (Image might be blank):", error);
    return null;
  }
};

// 3. Generate Speech (TTS)
export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Gentle female voice
          },
        },
      },
    });

    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64 || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
