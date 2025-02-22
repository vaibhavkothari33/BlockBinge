import React from 'react';
import { motion } from 'framer-motion';

const CodeLine = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-3 text-sm md:text-base font-mono"
  >
    <span className="text-primary">{'>_'}</span>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ duration: 1, delay: delay + 0.2 }}
      className="h-4 bg-gradient-to-r from-primary/20 to-transparent rounded"
    />
  </motion.div>
);

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-dark z-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text"
        >
          Loading BlockBinge
        </motion.div>
        <div className="space-y-3">
          <CodeLine delay={0} />
          <CodeLine delay={0.2} />
          <CodeLine delay={0.4} />
          <CodeLine delay={0.6} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-400 text-center mt-6"
          >
            Initializing decentralized streaming...
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Loader; 