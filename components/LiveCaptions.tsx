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

      // recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      //   setTranscript((prev) => prev + ' ' + event.results[event.results.length - 1][0].transcript);
      // };

      // recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      //   const finalTranscript = event.results[0][0].transcript;
      //   setTranscript(finalTranscript); // Set only the final transcript
      //   // recognitionRef.current?.stop(); // Stop the recognition after capturing the speech
      // };

      // recognitionRef.current.onerror = (event) => {
      //   console.error('Speech recognition error:', event);
      // };

      // recognitionRef.current.onstart = () => {
      //   isRecognizing.current = true; // Mark recognition as started
      //   console.log('Speech recognition started.');
      // };


      // recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      //   const finalTranscript = event.results[0][0].transcript;

      //   // Add the new caption to the list
      //   setCaptions((prevCaptions) => {
      //     const newCaptions = [...prevCaptions, finalTranscript];

      //     // Keep only the latest captions within the word limit
      //     const allWords = newCaptions.join(' ').split(' '); // Split by words
      //     if (allWords.length > maxWords) {
      //       allWords.splice(0, allWords.length - maxWords); // Remove older words if over maxWords
      //     }

      //     return allWords.join(' ').match(/.{1,30}(\s|$)/g) || []; // Split into 30 char chunks
      //   });
      // };

      // recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      //   if (event.error === 'no-speech') {
      //     setError('No speech detected. Please try speaking again.');
      //   } else if (event.error === 'aborted') {
      //     setError('Speech recognition was aborted.');
      //   } else {
      //     setError('An unknown error occurred.');
      //   }
      //   console.error('Speech recognition error:', event);
      // };

      // recognitionRef.current.onend = () => {
      //   if (isRecognizing.current) {
      //     // Only restart if recognition was active
      //     if (startCaptions) {
      //       console.log('Restarting speech recognition...');
      //       recognitionRef.current?.start();
      //     }
      //   }
      // };
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
