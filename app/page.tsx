'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PaymentModal from '@/components/PaymentModal';
import { Disco } from '@/types';
import { Smartphone, Clock, CreditCard, Zap, Gift, Headphones, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Configuration Data
const DISCOS: Disco[] = [
  { id: 'aba', name: 'Aba Power', logo: '/logos/aba.png', color: 'bg-red-600' },
  { id: 'phedc', name: 'PHEDC', logo: '/logos/phedc.png', color: 'bg-green-600' },
  { id: 'eedc', name: 'EEDC', logo: '/logos/eedc.png', color: 'bg-yellow-600' },
];

const BENEFITS = [
  { title: 'Convenience', desc: 'Purchase electricity units anywhere at anytime 24/7.', icon: Clock },
  { title: 'Flexible Payment', desc: 'Kobopay provides you with different payment options.', icon: CreditCard },
  { title: 'Instant Token', desc: 'Your tokens are delivered to you within seconds.', icon: Zap },
  { title: 'Track Spending', desc: 'Get detailed transaction receipts for your electricity expenses.', icon: Smartphone },
  { title: 'Rewards', desc: 'Get rewarded with amazing gifts for buying on Kobopay.', icon: Gift },
  { title: 'Premium Support', desc: 'Our customer service team is always available to help.', icon: Headphones },
];

export default function Home() {
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDiscoClick = (disco: Disco) => {
    setSelectedDisco(disco);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      <Navbar />
      <Hero />

      {/* DISCO SELECTION SECTION */}
      <section id="discos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Select Your Disco</h2>
            <p className="mt-4 text-gray-600">Choose your electricity distribution company to begin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {DISCOS.map((disco) => (
              <button
                key={disco.id}
                onClick={() => handleDiscoClick(disco)}
                className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center h-64 w-full"
              >
                <div className={`w-24 h-24 ${disco.color} rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg group-hover:scale-110 transition duration-300`}>
                  {/* Using Initials as placeholder for logos */}
                  {disco.name.substring(0, 3).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                  {disco.name}
                </h3>
                <span className="mt-2 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition">
                  Click to Pay
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Benefits of Using Kobopay</h2>
            <p className="mt-4 text-gray-600">Why thousands of Nigerians trust us for their power needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-16 bg-green-50 border-y border-green-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Buy on WhatsApp</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Prefer chatting? You can purchase your token directly through our automated WhatsApp bot.
          </p>
          <a href="https://wa.me/23490400000000" className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg">
            Chat on WhatsApp (090400000000)
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-blue-500" /> Kobopay
            </h3>
            <p className="max-w-xs text-sm leading-relaxed">
              Kobopay makes it easy for you to purchase electricity units for your prepaid meters securely and instantly.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">About us</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          ©️ 2025 Kobopay. All rights reserved.
        </div>
      </footer>

      {/* MODAL */}
      <PaymentModal 
        disco={selectedDisco} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}