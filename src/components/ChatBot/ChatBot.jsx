import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaUser, FaRegSmile } from 'react-icons/fa';
import { LangflowClient } from '../../utils/LangflowClient';
import { motion, AnimatePresence } from 'framer-motion';

// Simple markdown to HTML converter
const convertMarkdownToHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Handle ***text***
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // Handle **text**
    .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Handle *text*
    .replace(/\n/g, '<br/>');                          // Handle line breaks
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Replace with your environment variable or configuration
  const ASTRA_DB_TOKEN = process.env.REACT_APP_ASTRA_DB_TOKEN || 
                          import.meta.env.VITE_ASTRA_DB_TOKEN || 
                          '<YOUR_APPLICATION_TOKEN>';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const langflowClient = new LangflowClient(
    '/api/langflow', // This will be proxied in your app
    ASTRA_DB_TOKEN
  );

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await langflowClient.runFlow(
        '180be5c2-5808-490f-9a58-7555eea049b3',
        '79f415bc-232b-446f-b7cf-983ee7bb5c66',
        inputMessage,
        'chat',
        'chat',
        {},
        false
      );

      console.log('Full response:', response);

      // Handle different response formats
      let botContent = '';
      if (response?.outputs?.[0]?.outputs?.[0]?.message?.content) {
        botContent = response.outputs[0].outputs[0].message.content;
      } else if (response?.outputs?.[0]?.outputs?.[0]?.message?.text) {
        botContent = response.outputs[0].outputs[0].message.text;
      } else if (response?.outputs?.[0]?.message) {
        botContent = response.outputs[0].message;
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Could not parse AI response');
      }

      // Process markdown in the response
      const processedContent = convertMarkdownToHtml(botContent);

      const botResponse = {
        type: 'bot',
        content: processedContent,
        rawContent: botContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-full shadow-lg 
          hover:bg-red-600 transition-all hover:scale-110 hover:shadow-red-500/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot className="text-2xl" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-900/95 backdrop-blur-lg 
              rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-700/50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-600 to-red-400 text-white 
              rounded-t-2xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <FaRobot className="text-xl" />
                <h3 className="font-semibold">Movie AI Assistant</h3>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin 
              scrollbar-thumb-red-500/20 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-red-500 text-white ml-4'
                        : 'bg-gray-800 text-gray-100 mr-4'
                    } shadow-lg backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-2 mb-1 opacity-75">
                      {message.type === 'user' ? 
                        <FaUser className="text-sm" /> : 
                        <FaRobot className="text-sm text-red-400" />
                      }
                      <span className="text-xs">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    ></p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 text-white rounded-2xl p-3 mr-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <FaRobot className="text-sm text-red-400" />
                      <div className="animate-pulse flex space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" 
                          style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" 
                          style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" 
                          style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about movies..."
                    className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 pr-10 
                      focus:outline-none focus:ring-2 focus:ring-red-500/50 
                      placeholder-gray-400 shadow-inner"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                      hover:text-red-400 transition-colors p-2"
                  >
                    <FaRegSmile />
                  </button>
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                    shadow-lg hover:shadow-red-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPaperPlane />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;