import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Make Electricity Payments <br />
          <span className="text-blue-600">Instantly</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          The fastest way to purchase electricity units for Aba Power, PHEDC, and EEDC. 
          Instant token delivery, 24/7.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#discos" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Buy Token Now <ArrowRight size={20} />
          </a>
        </div>
      </div>
      
      {/* Abstract Background Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}