export const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  // Using a standard sample rate of 24000 to match Gemini's native output
  return new AudioContextClass({ sampleRate: 24000 });
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const decodeAudioData = async (
  base64: string,
  ctx: AudioContext
): Promise<AudioBuffer> => {
  try {
    const rawBuffer = base64ToArrayBuffer(base64);
    
    // Fix: Int16Array requires byteLength to be a multiple of 2.
    // If we have an odd number of bytes, drop the last one or pad.
    let bufferToUse = rawBuffer;
    if (rawBuffer.byteLength % 2 !== 0) {
      bufferToUse = rawBuffer.slice(0, rawBuffer.byteLength - 1);
    }

    // PCM data from Gemini TTS is 24kHz, 1 channel, 16-bit little-endian
    const dataInt16 = new Int16Array(bufferToUse);
    const sampleRate = 24000; // Gemini native rate
    const numChannels = 1;
    
    const frameCount = dataInt16.length / numChannels;
    const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Convert 16-bit PCM to float [-1.0, 1.0]
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return audioBuffer;
  } catch (e) {
    console.error("Error in custom decodeAudioData", e);
    // Return silent buffer to prevent crash
    return ctx.createBuffer(1, 24000, 24000);
  }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:audio/wav;base64,")
        const parts = reader.result.split(',');
        resolve(parts.length > 1 ? parts[1] : parts[0]);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};