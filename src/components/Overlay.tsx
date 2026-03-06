import { motion } from "motion/react";

export function Overlay() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col">
      {/* Navigation */}
      <nav className="p-8 flex justify-between items-center pointer-events-auto">
        <div className="text-2xl font-bold tracking-tighter">
          SPACE<span className="text-emerald-500">EDU</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest opacity-70">
          <a href="#" className="hover:opacity-100 transition-opacity">Planets</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Trailer</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Tickets</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Blog</a>
        </div>

        <button className="px-6 py-2 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all cursor-pointer">
          ENROLL
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="hero-content text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-xs font-bold tracking-[0.5em] uppercase opacity-50 mb-4 block">
              Planet
            </span>
            <h1 className="text-[12vw] md:text-[8vw] font-serif italic leading-none mb-6">
              Earth
            </h1>
            <p className="text-sm md:text-base opacity-60 leading-relaxed mb-8 max-w-md mx-auto">
              Experience our home planet like never before. A cinematic journey through the atmosphere into the deep blue oceans and vibrant landscapes.
            </p>
            <button className="pointer-events-auto px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-transform cursor-pointer">
              GET STARTED
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 flex justify-between items-end text-[10px] font-mono opacity-30 uppercase tracking-widest">
        <div>Coordinates: 0.0000° N, 0.0000° E</div>
        <div>System Status: Nominal</div>
      </footer>
    </div>
  );
}
