import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const ContactModal: React.FC = () => {
  const { contactModalOpen, setContactModalOpen, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!contactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry sent! Arun Bookstores team will contact you shortly.');
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
      setContactModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-[#071A33] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold">Contact Bharat Kart & Store Manager</h2>
            <p className="text-xs text-gray-300">
              Direct Customer Support & Order Assistance
            </p>
          </div>
          <button
            onClick={() => setContactModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs text-gray-700">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`mailto:${MANAGER_CREDENTIALS.email}`}
              className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl flex items-center gap-3 hover:bg-orange-100/70 transition group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Store Manager Email</p>
                <p className="font-bold text-gray-900 text-sm truncate group-hover:text-[#FF7A00]">
                  {MANAGER_CREDENTIALS.email}
                </p>
                <span className="text-[10px] text-[#138808] font-medium">Orders & Direct Contact</span>
              </div>
            </a>

            <a
              href="mailto:arunbookstores123@gmail.com"
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 hover:bg-slate-100 transition group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#071A33] text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#FFB703]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Bookstore Support</p>
                <p className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-900">
                  arunbookstores123@gmail.com
                </p>
                <span className="text-[10px] text-gray-600">Official Catalog Inquiries</span>
              </div>
            </a>
          </div>

          {/* Business Address & Timing */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-start gap-2">
              <Building className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-800">Arun Bookstores & Bharat Kart Head Office</p>
                <p className="text-gray-500 text-[11px]">
                  Central Commercial Complex, New Delhi - 110001
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600 text-[11px] pt-1 border-t border-gray-200">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Working Hours: Monday to Sunday, 9:00 AM – 9:00 PM IST</span>
            </div>
          </div>

          {/* Quick Message Form */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Send Direct Message to Store</h3>
            {submitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Message sent successfully! The store team will reach out to you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone / Mobile Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="How can we assist you with your order, books, or electronics? *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
