import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const convertMarkdownToHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [messages, isOpen]);

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
      const response = await fetch(`/api/langflow/lf/79f415bc-232b-446f-b7cf-983ee7bb5c66/api/v1/run/180be5c2-5808-490f-9a58-7555eea049b3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_ASTRA_DB_TOKEN}`
        },
        body: JSON.stringify({
          input_value: inputMessage,
          input_type: 'chat',
          output_type: 'chat'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the bot's response from the Langflow response
      let botContent = '';
      if (data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
        botContent = data.outputs[0].outputs[0].outputs.message.message.text;
      } else if (data?.outputs?.[0]?.output) {
        botContent = data.outputs[0].output;
      } else if (typeof data === 'string') {
        botContent = data;
      } else {
        throw new Error('Unexpected response format');
      }

      const botResponse = {
        type: 'bot',
        content: convertMarkdownToHtml(botContent),
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

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all"
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
            className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-red-600 text-white rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaRobot />
                <h3 className="font-semibold">Movie AI Assistant</h3>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-lg ${
                    message.type === 'user' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-1 opacity-75">
                      {message.type === 'user' ? <FaUser /> : <FaRobot className="text-red-400" />}
                      <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 rounded-2xl p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <FaRobot className="text-red-400" />
                      <span>Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-800">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about movies..."
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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