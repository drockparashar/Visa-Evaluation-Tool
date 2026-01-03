import React from 'react';
import { Globe2, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-white text-black min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background gradient - barely perceptible */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
      
      {/* Minimal decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" style={{ transform: 'translate(40%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-15" style={{ transform: 'translate(-30%, 30%)' }} />

      <div className="relative z-10 container mx-auto max-w-5xl px-6 sm:px-8">
        <div className="text-center space-y-10">
          {/* Icon - minimal and refined */}
          <div className="inline-flex items-center justify-center">
            <div className="p-4 rounded-full bg-gray-100">
              <Globe2 className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Main heading - clean typography */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
            Find Your<br />
            <span className="font-semibold">Perfect Visa</span>
          </h1>
          
          {/* Subheading - breathing room and clarity */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            AI-powered assessment across 6+ countries. Discover your best immigration path in seconds.
          </p>

          {/* Features - minimal, elegant presentation */}
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-8 sm:gap-12 max-w-2xl mx-auto pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-gray-700 font-light">AI-Powered</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-gray-700 font-light">6+ Countries</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-gray-700 font-light">Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}