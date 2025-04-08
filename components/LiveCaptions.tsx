'use client';
import { useState, useEffect, useRef } from 'react';
// Fix: Declare global types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  
}

const LiveCaptions = ({ startCaptions }: { startCaptions: boolean }) => {
  const [captions, setCaptions] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const captionsContainerRef = useRef<HTMLDivElement | null>(null);

  const [error] = useState<string | null>(null);
  const isRecognizing = useRef(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript.trim() + ' ';
          }
        }

        if (finalTranscript.length > 0) {
          setCaptions([finalTranscript.trim()]); // Keeps only the latest caption
        }
      };
      
     
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event);
      };
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }, []);


  const startRecognition = () => {
    if (recognitionRef.current && !isRecognizing.current) {
      console.log('Starting speech recognition...');
      recognitionRef.current.start();
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognizing.current) {
      console.log('Stopping speech recognition...');
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {

    if (startCaptions) {
      startRecognition(); // Start recognition when captions are enabled
    } else {
      stopRecognition(); // Stop recognition when captions are disabled
    }
  }, [startCaptions]);

  return (

    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full text-white px-4 py-2">
      {/* Render captions */}
        {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white bg-opacity-70 p-2 rounded-md bg-black w-full max-w-[90%]"> */}
        <div ref={captionsContainerRef} className="overflow-y-auto max-w-[90%] text-left bg-transparent z-20">
          {captions.map((caption, index) => (
            <div
              key={index}
              className="mb-20 opacity-100 transition-opacity duration-500 ease-in-out"
              style={{
                animation: `fadeInOut 6s ease-out forwards`,
                animationDelay: `${index * 2}s`, // Delay each caption by 2s
              }}
            >
              <p className='mb-2'>{caption}</p>
            </div>
          ))}
        </div>
        {/* Display errors if any */}
        {error && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-red-500 bg-black/70 p-2 rounded-md ">
            <p>{error}</p>
          </div>
        )}
    </div>

  );
};

export default LiveCaptions;
