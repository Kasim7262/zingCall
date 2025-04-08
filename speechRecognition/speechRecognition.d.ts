declare global {
    // Extend the Window interface to include SpeechRecognition and webkitSpeechRecognition
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  
    // Declare the SpeechRecognition constructor
    var SpeechRecognition: {
      prototype: SpeechRecognition;
      new (): SpeechRecognition;
    };
  
    // Declare the webkitSpeechRecognition constructor (for browsers like Chrome)
    var webkitSpeechRecognition: {
      prototype: SpeechRecognition;
      new (): SpeechRecognition;
    };
  
    // Define the SpeechRecognition interface (you can expand this as needed)
    interface SpeechRecognition {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start(): void;
      stop(): void;
      abort(): void;
      onaudiostart: (() => void) | null;
      onsoundstart: (() => void) | null;
      onspeechstart: (() => void) | null;
      onspeechend: (() => void) | null;
      onsoundend: (() => void) | null;
      onaudioend: (() => void) | null;
      onresult: ((event: SpeechRecognitionEvent) => void) | null;
      onnomatch: (() => void) | null;
      onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
      onstart: (() => void) | null;
      onend: (() => void) | null;
    }
  
    // Define the SpeechRecognitionEvent interface
    interface SpeechRecognitionEvent {
      results: SpeechRecognitionResultList;
      resultIndex: number;
    }
  
    // Define the SpeechRecognitionErrorEvent interface
    interface SpeechRecognitionErrorEvent {
      error: string;
      message: string;
    }
  
    // Additional interfaces (optional, can be expanded as needed)
    interface SpeechRecognitionResultList {
      length: number;
      item(index: number): SpeechRecognitionResult;
      [index: number]: SpeechRecognitionResult;
    }
  
    interface SpeechRecognitionResult {
      isFinal: boolean;
      length: number;
      item(index: number): SpeechRecognitionAlternative;
      [index: number]: SpeechRecognitionAlternative;
    }
  
    interface SpeechRecognitionAlternative {
      transcript: string;
      confidence: number;
    }
  }
  
  export {};