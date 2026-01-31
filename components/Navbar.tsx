import { Menu, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-black/20 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Kobopower
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#discos" className="hover:text-white transition">
              Discos
            </a>
            <a href="#benefits" className="hover:text-white transition">
              Benefits
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </div>
          <button className="md:hidden text-gray-300">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
