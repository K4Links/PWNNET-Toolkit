import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ToolDef } from '../types';

interface CustomToolLayoutProps {
  tool: ToolDef;
  onClose: () => void;
  children: ReactNode;
  icon?: any;
  title?: string;
}

export function CustomToolLayout({ tool, onClose, children, icon: CustomIcon, title }: CustomToolLayoutProps) {
  const Icon = CustomIcon || tool.icon;
  
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-neon-green/20 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-neon-green font-bold tracking-widest text-sm sm:text-base uppercase flex items-center gap-2 truncate">
            &gt;_ SYSTEM // MODULE.{tool.id.toUpperCase()}
          </span>
          <span className={`shrink-0 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono rounded border uppercase tracking-widest bg-neon-green/10 text-neon-green border-neon-green/50`}>
            ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 text-neon-green border border-neon-green/50 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold hover:bg-neon-green/10 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            BACK
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="flex gap-3 p-4 sm:p-5 bg-neon-green/[0.02] border-b border-neon-green/10 shrink-0">
        <Icon size={16} className="text-neon-green mt-0.5 shrink-0" />
        <p className="text-gray-400 font-mono text-xs sm:text-[13px] leading-relaxed max-w-4xl">
          {tool.description}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 scrollbar-thin scrollbar-thumb-neon-green/20 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto border border-neon-green/20 rounded-[24px] p-5 sm:p-8 bg-[#0a0a0a] shadow-[0_0_20px_rgba(57,255,20,0.03)] focus-within:shadow-[0_0_20px_rgba(57,255,20,0.06)] transition-shadow flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <Icon size={24} className="text-neon-green" />
            <h2 className="text-white font-bold tracking-widest text-sm sm:text-lg uppercase">
              {title || `${tool.name} MODULE`}
            </h2>
          </div>
          
          <div className="space-y-8 font-mono">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
