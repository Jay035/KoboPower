'use client';

import { useState } from 'react';
import { Disco } from '@/types';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  disco: Disco | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ disco, isOpen, onClose }: PaymentModalProps) {
  const [meterNo, setMeterNo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !disco) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // SIMULATE API CALL
    // In a real app, you would fetch('/api/pay', { body: JSON.stringify({ discoId: disco.id, meterNo, amount }) })
    setTimeout(() => {
      setLoading(false);
      // Generate a fake token for demo
      const fakeToken = Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
      setSuccess(fakeToken);
    }, 2000);
  };

  const reset = () => {
    setSuccess(null);
    setMeterNo('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`p-6 ${disco.color} text-white flex justify-between items-center`}>
          <h3 className="text-xl font-bold">Pay {disco.name}</h3>
          <button onClick={reset} className="hover:bg-white/20 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h4>
              <p className="text-gray-500 mb-6">Your token has been generated.</p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-6 border border-dashed border-gray-300">
                <span className="block text-sm text-gray-500 uppercase tracking-wide">Token</span>
                <span className="block text-2xl font-mono font-bold tracking-widest text-gray-800">{success}</span>
              </div>
              
              <button onClick={reset} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number</label>
                <input 
                  type="number" 
                  required
                  value={meterNo}
                  onChange={(e) => setMeterNo(e.target.value)}
                  placeholder="e.g. 01011500445"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input 
                  type="number" 
                  required
                  min="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                Connecting to <strong>{disco.name}</strong> API securely.
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3.5 rounded-lg font-bold text-white shadow-md transition
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Processing...
                  </span>
                ) : (
                  `Pay ₦${amount || '0.00'}`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}