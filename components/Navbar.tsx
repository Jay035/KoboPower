import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-full">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Kobopay</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="#discos" className="text-gray-600 hover:text-blue-600 transition">Discos</Link>
            <Link href="#benefits" className="text-gray-600 hover:text-blue-600 transition">Benefits</Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</Link>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}