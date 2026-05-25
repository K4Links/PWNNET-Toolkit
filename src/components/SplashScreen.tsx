import { useEffect, useState } from 'react';
import { Terminal, Shield, Network, Lock, Fingerprint, Code, Server, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [currentText, setCurrentText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    const startupSequence = [
      "INITIALIZING SECURE KERNEL...",
      "LOADING CRYPTOGRAPHIC MODULES...",
      "MOUNTING ENCRYPTED VOLUMES...",
      "ESTABLISHING SECURE CONNECTION...",
      "BYPASSING FIREWALL PROTOCOLS...",
      "ACCESSING SECURE MAINFRAME...",
      "AUTHENTICATION SUCCESSFUL",
    ];

    let currentLog = 0;
    setCurrentText(startupSequence[0]);
    
    const interval = setInterval(() => {
      currentLog++;
      if (currentLog < startupSequence.length) {
        setCurrentText(startupSequence[currentLog]);
        setProgress((currentLog / (startupSequence.length - 1)) * 100);
        if (currentLog === startupSequence.length - 1) {
          setIsGlitching(false);
        }
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1600); // 400ms from current tick + 1600ms = 2s total visible non-glitch
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#030303] flex flex-col items-center justify-center font-mono overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Refined subtle background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#030303]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:100%_4px] z-20"></div>
        <div className="absolute inset-0 tv-static-layer z-30"></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md px-6">
        <motion.div 
          className="relative mb-6 w-full max-w-[400px]"
          initial={{ scale: 0.95, opacity: 0, filter: "blur(8px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div 
            className={`absolute inset-0 ${isGlitching ? 'bg-[#00FF41]/20' : 'bg-[#00FF41]/40'} blur-[60px] rounded-full transition-colors duration-1000`}
            animate={{ 
              opacity: [0.6, 1, 0.6],
              scale: [1.1, 1.4, 1.1] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className={`absolute inset-4 ${isGlitching ? 'bg-[#38bdf8]/30' : 'bg-[#00FF41]/30'} blur-[30px] rounded-full transition-colors duration-1000`}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.1, 0.9] 
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <div 
            className="w-full h-auto relative z-10 drop-shadow-2xl glitch-container transition-all duration-300 mix-blend-screen contrast-125"
            style={{ backgroundImage: 'url(https://i.postimg.cc/Y9wL20Xk/PWN-logo.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', minHeight: '150px' }}
          >
             <div className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${isGlitching ? 'glitch-logo opacity-100' : 'opacity-0'}`} style={{ backgroundImage: 'url(https://i.postimg.cc/Y9wL20Xk/PWN-logo.png)' }}></div>
             <img 
               src="https://i.postimg.cc/Y9wL20Xk/PWN-logo.png" 
               alt="PWNNET"
               className="w-full h-auto object-contain opacity-0"
               referrerPolicy="no-referrer"
             />
          </div>
        </motion.div>

        <motion.div 
          className="text-center mb-12 relative z-10"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-gray-400 font-medium text-sm tracking-[0.3em] uppercase glow-text text-shadow-sm">Advanced Network Exploitation Toolkit</p>
        </motion.div>

        {/* Minimal Loading Bar & Text */}
        <div className="w-full max-w-[240px] flex flex-col items-center">
          <motion.div 
            className="w-full h-[1px] bg-white/10 overflow-hidden mb-4 relative"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div 
              className="absolute left-0 top-0 h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>
          
          <motion.div 
            key={currentText}
            className="text-[9px] text-gray-500 font-medium tracking-widest uppercase h-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {currentText}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
