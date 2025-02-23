import React from 'react';
import { FaEthereum, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const PaymentDialog = ({ 
  isOpen, 
  onClose, 
  amount, 
  onPay, 
  isProcessing,
  timeInMinutes,
  type = 'payment', // 'payment', 'error', 'warning'
  message = '',
  title = 'Pending Payment'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-dark-lighter rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {type !== 'payment' && (
              <FaExclamationCircle 
                size={24} 
                className={type === 'error' ? 'text-red-500' : 'text-yellow-500'} 
              />
            )}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {type === 'payment' ? (
            <>
              <div className="bg-dark/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Watch Time:</span>
                  <span className="text-white font-medium">{timeInMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Amount Due:</span>
                  <div className="flex items-center text-primary font-medium">
                    <FaEthereum className="mr-1" />
                    <span>{amount} ETH</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm">
                Please settle this payment before watching more content. You can pay now or later from your account.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onPay}
                  disabled={isProcessing}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Later
                </button>
              </div>
            </>
          ) : type === 'warning' ? (
            <>
              <p className="text-gray-300 text-base">
                {message}
              </p>
              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={onPay}
                  disabled={isProcessing}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg 
                    transition-colors"
                >
                  Pay Later
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-300 text-base">
                {message}
              </p>
              <div className="flex justify-end mt-6">
                <button
                  onClick={onClose}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg 
                    transition-colors"
                >
                  OK
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;