import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Citizen Assistant. How can I help you with government services in Ludhiana?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // --- Audio Lifecycle Management ---
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  // Clean up audio when widget is closed
  useEffect(() => {
    if (!isOpen) {
      stopAudio();
    }
  }, [isOpen]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => stopAudio();
  }, []);

  // --- Bhashini TTS Engine ---
  const playBhashiniTTS = async (textToSpeak) => {
    if (!voiceMode) return;
    
    try {
      stopAudio(); // Stop any currently playing audio
      setIsPlayingAudio(true);

      // TODO: SECURELY INJECT YOUR BHASHINI CREDENTIALS HERE
      const USER_ID = "YOUR_BHASHINI_USER_ID";
      const API_KEY = "YOUR_BHASHINI_API_KEY";
      const ULCA_API_KEY = "YOUR_ULCA_API_KEY";

      const response = await fetch('https://dhruva-api.bhashini.gov.in/v1/compute/pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY,
          'userID': USER_ID,
          'ulcaApiKey': ULCA_API_KEY
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: "tts",
              config: {
                language: {
                  sourceLanguage: "pa" // Punjabi
                }
              }
            }
          ],
          inputData: {
            input: [
              { source: textToSpeak }
            ]
          }
        })
      });

      if (!response.ok) throw new Error('Bhashini TTS API Error');
      
      const data = await response.json();
      const base64Audio = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
      
      if (base64Audio) {
        // Construct native HTML5 audio playable URI
        const audioUri = `data:audio/wav;base64,${base64Audio}`;
        audioRef.current = new Audio(audioUri);
        
        // Listen for audio end
        audioRef.current.onended = () => setIsPlayingAudio(false);
        
        // Attempt playback
        await audioRef.current.play();
      } else {
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error("Bhashini TTS Error:", error);
      // Graceful fallback to text-only mode
      setIsPlayingAudio(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Interrupt AI if user speaks
    stopAudio();

    const userMessage = { sender: 'user', text: inputText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.text })
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
      
      // Attempt TTS Playback
      if (voiceMode) {
        playBhashiniTTS(data.response);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      const fallbackText = "Sorry, I couldn't connect to the server. Please try again later.";
      setMessages((prev) => [...prev, { sender: 'bot', text: fallbackText }]);
      if (voiceMode) playBhashiniTTS(fallbackText);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceMode = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    if (!newMode) stopAudio();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 mb-4 overflow-hidden flex flex-col transition-all duration-300 ease-in-out" style={{ height: '450px' }}>
          
          {/* Header */}
          <div className="bg-green-700 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-semibold text-lg">AI Citizen Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleVoiceMode}
                className={`transition-colors p-1.5 rounded-full ${voiceMode ? 'text-white hover:bg-green-600' : 'text-green-300 hover:text-white'}`}
                title={voiceMode ? "Mute Voice" : "Enable Voice"}
              >
                {voiceMode ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-green-100 hover:text-white hover:bg-green-600 transition-colors p-1.5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, idx) => {
              const isLastBotMsg = msg.sender === 'bot' && idx === messages.length - 1;
              return (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-700'}`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="flex flex-col">
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      
                      {/* Active Speaking Indicator */}
                      {isLastBotMsg && isPlayingAudio && (
                        <div className="flex gap-1 ml-2 mt-1 items-end h-3">
                          <div className="w-1 bg-green-500 rounded-full animate-pulse h-full" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 bg-green-500 rounded-full animate-pulse h-2/3" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 bg-green-500 rounded-full animate-pulse h-full" style={{ animationDelay: '300ms' }} />
                          <span className="text-[10px] text-green-600 ml-1 leading-none">Speaking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%] flex-row">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-3 shrink-0 flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-transparent focus:border-green-500 transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors shrink-0 flex items-center justify-center h-10 w-10"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
