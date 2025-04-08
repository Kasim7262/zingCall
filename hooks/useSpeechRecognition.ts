import { useState, useEffect } from 'react';


// speech-recognition.d.ts
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
  
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
// Speech-to-Text Hook
const useSpeechRecognition = () => {
  const [captions, setCaptions] = useState<string>('');
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const latestTranscript = event.results[event.results.length - 1][0].transcript;
      setCaptions(latestTranscript);
    };

    recognition.onerror = (event : SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
    };

    // Event handler for errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
            setIsError('No speech detected. Please try speaking again.');
        } else if (event.error === 'audio-capture') {
            setIsError('No microphone found. Please check your microphone.');
        } else {
            setIsError('An error occurred with speech recognition.');
        }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return {captions, isError};
};

export default useSpeechRecognition;
