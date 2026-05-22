import { useState, useMemo } from 'react';
import { ToolDef } from '../types';
import { TOOLS } from '../data/tools';
import { Search, Filter, Shield, Activity, Terminal as CmdIcon } from 'lucide-react';
import { motion } from 'motion/react';

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Recon':
      return {
        accentText: 'text-cyan-400',
        glowText: 'text-cyan-400 group-hover:text-cyan-300',
        borderClass: 'border-cyan-500/20 hover:border-cyan-400/60',
        bgGradient: 'bg-gradient-to-b from-[#081e2b]/50 to-[#030b10]/90',
        iconBg: 'bg-gradient-to-br from-cyan-500/10 via-[#0a1e2a] to-cyan-950/40 border-cyan-500/25 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-400/50',
        btnBg: 'hover:bg-cyan-500/[0.04] hover:shadow-[0_0_15px_rgba(34,211,238,0.12)]',
        accentLine: 'bg-cyan-400',
        badge: 'text-cyan-400/90 bg-cyan-950/50 border-cyan-500/20'
      };
    case 'Web':
      return {
        accentText: 'text-emerald-400',
        glowText: 'text-emerald-400 group-hover:text-emerald-300',
        borderClass: 'border-emerald-500/20 hover:border-emerald-400/60',
        bgGradient: 'bg-gradient-to-b from-[#082214]/50 to-[#020b06]/90',
        iconBg: 'bg-gradient-to-br from-emerald-500/10 via-[#0a2013] to-emerald-950/40 border-emerald-500/25 text-emerald-400 group-hover:text-emerald-300 group-hover:border-emerald-400/50',
        btnBg: 'hover:bg-emerald-500/[0.04] hover:shadow-[0_0_15px_rgba(16,185,129,0.12)]',
        accentLine: 'bg-emerald-400',
        badge: 'text-emerald-400/90 bg-emerald-950/50 border-emerald-500/20'
      };
    case 'Utils':
    default:
      return {
        accentText: 'text-purple-400',
        glowText: 'text-purple-400 group-hover:text-purple-300',
        borderClass: 'border-purple-500/20 hover:border-purple-400/60',
        bgGradient: 'bg-gradient-to-b from-[#1a0827]/50 to-[#08020c]/90',
        iconBg: 'bg-gradient-to-br from-purple-500/10 via-[#180824] to-purple-950/40 border-purple-500/25 text-purple-400 group-hover:text-purple-300 group-hover:border-purple-400/50',
        btnBg: 'hover:bg-purple-500/[0.04] hover:shadow-[0_0_15px_rgba(168,85,247,0.12)]',
        accentLine: 'bg-purple-400',
        badge: 'text-purple-400/90 bg-purple-950/50 border-purple-500/20'
      };
  }
};

interface ToolsGridProps {
  onSelectTool: (tool: ToolDef) => void;
}

export function ToolsGrid({ onSelectTool }: ToolsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories extraction
  const categories = useMemo(() => {
    const cats = new Set(TOOLS.map((t) => t.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-obsidian relative">
      {/* CRT Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] z-10 opacity-30"></div>
      
      {/* Utility Search & Category Bar */}
      <div className="p-4 bg-[#080808] border-b border-neon-green/20 flex flex-col gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-neon-green" />
            <input
              type="text"
              placeholder="SEARCH SECURE TOOLS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-neon-green/30 hover:border-neon-green/60 focus:border-neon-green text-neon-green text-xs font-mono uppercase px-10 py-2.5 rounded-xl focus:outline-none focus:ring-0 placeholder:text-gray-700 transition-all tracking-wider font-bold"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-green text-[10px] font-mono font-bold"
              >
                [ESC]
              </button>
            )}
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 border border-neon-green/20 bg-black/80 text-[10px] font-mono text-gray-400 rounded-xl sm:self-stretch">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              <span className="text-neon-green uppercase font-black tracking-widest text-[9px] glow-text">ACTIVE</span>
            </div>
            <div className="border-l border-neon-green/20 h-4"></div>
            <div className="font-bold tracking-wider">CORE: <span className="text-[#38bdf8]">PWN//NET v1.0.1</span></div>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 font-bold">
            <Filter size={10} className="text-[#38bdf8]" /> REGISTRY GROUPS:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            let themeClasses = '';
            if (isActive) {
              if (cat === 'Recon') {
                themeClasses = 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 glow-border shadow-[0_0_12px_rgba(34,211,238,0.35)]';
              } else if (cat === 'Web') {
                themeClasses = 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400 glow-border shadow-[0_0_12px_rgba(16,185,129,0.35)]';
              } else if (cat === 'Utils') {
                themeClasses = 'bg-purple-500 text-white border-purple-400 hover:bg-purple-400 glow-border shadow-[0_0_12px_rgba(168,85,247,0.35)]';
              } else {
                themeClasses = 'bg-neon-green text-black border-neon-green glow-border';
              }
            } else {
              if (cat === 'Recon') {
                themeClasses = 'bg-black text-gray-400 border-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400/60';
              } else if (cat === 'Web') {
                themeClasses = 'bg-black text-gray-400 border-emerald-500/20 hover:text-emerald-400 hover:border-emerald-400/60';
              } else if (cat === 'Utils') {
                themeClasses = 'bg-black text-gray-400 border-purple-500/20 hover:text-purple-400 hover:border-purple-400/60';
              } else {
                themeClasses = 'bg-black text-gray-400 border-neon-green/20 hover:text-neon-green hover:border-neon-green/60';
              }
            }
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[10px] uppercase font-mono tracking-wider transition-all border cursor-pointer select-none font-bold rounded-xl ${themeClasses}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {filteredTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-gray bg-[#080808] p-4 text-center">
            <Shield className="w-10 h-10 text-red-500/50 mb-3 animate-pulse" />
            <h3 className="font-mono text-neon-green text-sm uppercase tracking-widest">No matching security tools</h3>
            <p className="font-sans text-xs text-gray-400 mt-1 max-w-xs">Double check your filters or search criteria. Command registry returned empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const styles = getCategoryStyles(tool.category);
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: Math.min(index * 0.015, 0.2) }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-stretch text-left bg-[#0c0c0c]/90 border ${styles.borderClass} p-3.5 group transition-all duration-300 ease-out relative overflow-hidden aspect-square select-none cursor-pointer rounded-2xl ${styles.btnBg}`}
                >
                  {/* Subtle matrix-like grid index indicator */}
                  <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-gray-500 group-hover:text-white/60 uppercase transition-colors">
                    {tool.category.substring(0, 3)}-{index + 1}
                  </div>

                  {/* Upgraded Premium Icon section (rounded like client-side phone apps) */}
                  <div className="flex-1 flex items-center justify-start mt-1">
                    <div className={`p-2.5 ${styles.iconBg} border transition-all duration-300 ease-out rounded-xl shadow-inner`}>
                      <Icon strokeWidth={1.8} size={38} />
                    </div>
                  </div>

                  {/* Title labels */}
                  <div className="mt-2.5 flex flex-col w-full">
                    <span className="text-[11.5px] font-bold font-sans text-gray-100 group-hover:text-white transition-colors line-clamp-1 tracking-wide">
                      {tool.name}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider font-mono text-gray-500 group-hover:text-white/80 mt-1 flex items-center justify-between">
                      <span className={`px-1 rounded-sm text-[7.5px] font-extrabold ${styles.badge} border`}>
                        {tool.category}
                      </span>
                      <span className={`text-[7.5px] ${styles.glowText} opacity-0 group-hover:opacity-100 transition-opacity font-extrabold tracking-widest`}>
                        [LAUNCH]
                      </span>
                    </span>
                  </div>

                  {/* Interactive glowing bottom tracker */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:${styles.accentLine} transition-all duration-300`} />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
