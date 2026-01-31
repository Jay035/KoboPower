"use client";

import { useState } from "react";
import Head from "next/head";
import {
  Zap,
  CreditCard,
  Clock,
  BarChart3,
  Gift,
  Headphones,
  Phone,
} from "lucide-react";
import PaymentModal from "@/components/PaymentModal";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { DISCOS } from "@/lib/db";

// const billers = [
//   {
//     id: "eedc",
//     name: "Enugu Electricity Distribution Company",
//     billers: {
//       prepaid: "biller-eedc-pre",
//       postpaid: "biller-eedc-post",
//     },
//   },
//   {
//     id: "phedc",
//     name: "Port Harcourt Electricity Distribution Company",
//     billers: {
//       prepaid: "biller-phedc-pre",
//       postpaid: "biller-phedc-post",
//     },
//   },
//   {
//     id: "ekedc",
//     name: "Eko Electricity Distribution Company",
//     billers: {
//       prepaid: "biller-ekedc-pre",
//       postpaid: "biller-ekedc-post",
//     },
//   },
//   // {
//   //   id: "ekedc",
//   //   code: "biller-ekedc-pre",
//   //   name: "Eko Electricity Distribution Prepaid",
//   // },

//   // { code: "biller-ekedc-post", name: "Eko Electricity Distribution Postpaid" },

//   // { code: "biller-ibedc-pre", name: "Ibadan Electricity Distribution Prepaid" },

//   // {
//   //   code: "biller-ibedc-post",
//   //   name: "Ibadan Electricity Distribution Postpaid",
//   // },

//   // { code: "biller-ikedc-pre", name: "Ikeja Electricity Distribution Prepaid" },

//   // {
//   //   code: "biller-ikedc-post",
//   //   name: "Ikeja Electricity Distribution Postpaid",
//   // },

//   // { code: "biller-jedc-pre", name: "Jos Electricity Distribution Prepaid" },

//   // { code: "biller-jedc-post", name: "Jos Electricity Distribution Postpaid" },

//   // { code: "biller-aedc-pre", name: "Abuja Electricity Distribution Prepaid" },

//   // { code: "biller-aedc-post", name: "Abuja Electricity Distribution Postpaid" },

//   // { code: "biller-kedc-pre", name: "Kano Electricity Distribution Prepaid" },
//   // { code: "biller-knedc-pre", name: "Kaduna Electricity Distribution Prepaid" },
// ];

const BENEFITS = [
  {
    title: "Convenience",
    desc: "Purchase electricity units anywhere at anytime 24/7.",
    icon: Clock,
  },
  {
    title: "Flexible Payment",
    desc: "Different payment options making payment easier.",
    icon: CreditCard,
  },
  {
    title: "Instant Token",
    desc: "Your tokens are delivered to you within seconds.",
    icon: Zap,
  },
  {
    title: "Track Spending",
    desc: "Get detailed transaction receipts for expenses.",
    icon: BarChart3,
  },
  {
    title: "Rewards",
    desc: "Get rewarded with amazing gifts for buying tokens.",
    icon: Gift,
  },
  {
    title: "Premium Support",
    desc: "Customer service team is always available.",
    icon: Headphones,
  },
];

type SelectedDisco = {
  name: string;
  id: number;
  serviceID: string;
};

export default function Home() {
  const [selectedDisco, setSelectedDisco] = useState<SelectedDisco | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      <Head>
        <title>Kobopay | Instant Electricity Payments</title>
        <meta
          name="description"
          content="Pay for electricity instantly with Kobopay"
        />
      </Head>

      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-700 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
              Live 24/7 Payments
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Make Electricity <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
              Payments Instantly
            </span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Seamlessly purchase units for Aba Power, PHEDC, and EEDC. Get your
            token in seconds.
          </p>

          <a
            href="#discos"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
          >
            Start Payment
          </a>
        </div>
      </section>

      {/* --- Discos Section --- */}
      <section id="discos" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Select Your Provider
            </h2>
            <p className="text-gray-400">
              Choose your distribution company to proceed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DISCOS.map((disco) => (
              <Link
                href={`/pay/${disco.slug}`}
                key={disco.id}
                // onClick={() => setSelectedDisco(disco)}
                className="group cursor-pointer relative bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* ${disco.color} */}
                <div
                  className={`${disco.color} w-16 h-16 rounded-full  flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Zap className="text-white" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">
                  {disco.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Click to buy units instantly
                </p>
                <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
                  Pay Now{" "}
                  <span className="ml-2 group-hover:translate-x-1 transition">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- Benefits Section --- */}
      <section id="benefits" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Kobopay?</h2>
            <p className="text-gray-400">
              Experience the future of utility payments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {BENEFITS.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                    <item.icon className="text-blue-500" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WhatsApp CTA --- */}
      <section className="py-20 bg-linear-to-b from-gray-900 to-black border-y border-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Help? Buy on WhatsApp
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Chat with our bot or support team directly to purchase units or
            resolve issues.
          </p>
          <a
            href="https://wa.me/23490400000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full transition-all"
          >
            <Phone fill="currentColor" />
            <span>Chat on WhatsApp (090400000000)</span>
          </a>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black pt-16 pb-8 border-t border-gray-900 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-blue-500" size={20} />
              <span className="text-xl font-bold text-white">Kobopay</span>
            </div>
            <p className="max-w-xs leading-relaxed mb-6">
              Simplifying electricity payments across Nigeria. Fast, secure, and
              reliable service 24/7.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Kobopay. All rights reserved.</p>
        </div>
      </footer>

      {/* --- Logic Modal --- */}
      {selectedDisco && (
        <PaymentModal
          isOpen={!!selectedDisco}
          onClose={() => setSelectedDisco(null)}
          disco={selectedDisco}
        />
      )}
    </div>
  );
}
