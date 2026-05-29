import { useState, useRef, useEffect, FormEvent, ReactNode } from 'react';
import * as OTPAuth from 'otpauth';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { logService } from '../utils/logger';
import { 
  X, Terminal as TerminalIcon, Play, RefreshCw, Copy, Check, 
  Cpu, ShieldAlert, Wifi, Globe, MapPin, Hash, KeySquare, Laptop, 
  Compass, Eye, Zap, ShieldAlert as AlertIcon, Lock, ArrowLeft, Bluetooth, Calculator, KeyRound, Gauge, QrCode,
  Search, DoorOpen, Server, Bug, FileText
} from 'lucide-react';
import { ToolDef, TerminalOutput } from '../types';

interface TerminalEmulatorProps {
  tool: ToolDef | null;
  onClose: () => void;
}

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try { document.execCommand('copy'); } catch (err) { console.error('Copy failed', err); }
  document.body.removeChild(textArea);
};

const copyToClipboardV2 = (text: string) => {
  if (!navigator.clipboard) { fallbackCopyTextToClipboard(text); return; }
  navigator.clipboard.writeText(text).catch(() => fallbackCopyTextToClipboard(text));
};

const CopyableLink = ({ url, label }: { url: string, label?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    copyToClipboardV2(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const openExternal = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <span className="inline-flex items-center gap-2 text-blue-400 underline underline-offset-2 decoration-dotted decoration-blue-500/40 text-xs">
      {label || url}
      <button onClick={handleCopy} className="p-1 rounded hover:bg-white/10 transition-colors" title="Copy link">
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
      <button onClick={openExternal} className="p-1 rounded hover:bg-white/10 transition-colors" title="Open in browser">
        ↗
      </button>
    </span>
  );
};

export function TerminalEmulator({ tool, onClose }: TerminalEmulatorProps) {
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [target, setTarget] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tool) {
      setOutput([]);
      setShowInput(tool.requiresInput || false);
      setTarget('');

      if (!tool.requiresInput && tool.actionType === 'terminal') {
        runAutoTool(tool.id);
      }
    }
  }, [tool]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const addOutput = (type: TerminalOutput['type'], content: ReactNode) => {
    const entry: TerminalOutput = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      type,
      content,
    };
    setOutput(prev => [...prev, entry]);
    logService.addEntry(entry);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-purple-400';
      case 'input': return 'text-cyan-300';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-gray-200';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = () => {
    if (isRunning) return { text: 'RUNNING', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    if (output.some(o => o.type === 'error')) return { text: 'ERROR', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    if (output.length > 1) return { text: 'COMPLETE', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
    return { text: 'IDLE', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  const runAutoTool = async (toolId: string) => {
    setIsRunning(true);
    addOutput('system', `Initializing ${toolId.toUpperCase()} module...`);

    if (toolId === 'device') {
      const mem = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;
      const info = [
        `User Agent: ${navigator.userAgent}`,
        `Platform: ${navigator.platform}`,
        `Language: ${navigator.language}`,
        `Screen: ${screen.width}x${screen.height}`,
        `Color Depth: ${screen.colorDepth}bit`,
        `Device Memory: ${mem || 'Unknown'} GB`,
        `CPU Cores: ${cores || 'Unknown'}`,
        `Online: ${navigator.onLine}`,
        `Cookies Enabled: ${navigator.cookieEnabled}`,
        `Touch Support: ${navigator.maxTouchPoints > 0}`,
      ];
      info.forEach(line => addOutput('info', line));
      addOutput('success', 'Device scan complete.');
    }
    else if (toolId === 'security') {
      const checks = [
        { name: 'Cookies Enabled', pass: navigator.cookieEnabled },
        { name: 'Do Not Track', pass: (navigator as any).doNotTrack === '1' },
        { name: 'Local Storage', pass: !!window.localStorage },
        { name: 'Session Storage', pass: !!window.sessionStorage },
        { name: 'Service Worker Support', pass: 'serviceWorker' in navigator },
        { name: 'Geolocation API', pass: 'geolocation' in navigator },
      ];
      checks.forEach(c => {
        addOutput(c.pass ? 'success' : 'error', `${c.name}: ${c.pass ? '✓' : '✗'}`);
      });
      addOutput('success', 'Security profile scan complete.');
    }
    else if (toolId === 'speed') {
      addOutput('system', 'Testing latency...');
      const start = performance.now();
      try {
        await fetch('https://www.google.com/images/phd/px.gif', { mode: 'no-cors', cache: 'no-store' });
        const end = performance.now();
        addOutput('info', `Round-trip latency: ~${Math.round(end - start)}ms`);
        addOutput('success', 'Latency test complete.');
      } catch {
        addOutput('error', 'Latency test blocked.');
      }
    }
    else if (toolId === 'base64') {
      addOutput('system', 'Base64 encoder/decoder ready. Enter text to encode, or "decode:<base64>" to decode.');
    }
    else if (toolId === 'cipher') {
      addOutput('system', 'Cipher decoder ready. Enter text to analyze.');
    }
    else {
      addOutput('info', `Module ready. Enter a target to proceed.`);
    }

    setIsRunning(false);
  };

  const handleRunTarget = async (input: string) => {
    if (!input.trim() || !tool) return;

    const activeToolId = tool.id;
    addOutput('input', `> ${input}`);

    setIsRunning(true);
    let resolvedTarget = input.trim();
    if (!resolvedTarget.startsWith('http://') && !resolvedTarget.startsWith('https://') && 
        (activeToolId === 'http' || activeToolId === 'spider' || activeToolId === 'admin_finder' || activeToolId === 'admin-finder')) {
      resolvedTarget = 'https://' + resolvedTarget;
    }

    const runBackendTool = async (endpoint: string, params: Record<string, string>) => {
      const qs = new URLSearchParams(params).toString();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://pwnnet-toolkit.onrender.com';
      const res = await fetch(`${backendUrl}/api/net/${endpoint}?${qs}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return data;
    };

    try {
      // --- ADMIN FINDER ---
      if (activeToolId === 'admin_finder' || activeToolId === 'admin-finder') {
        addOutput('system', `Scanning admin panels on ${resolvedTarget} via backend...`);
        const data = await runBackendTool('adminfinder', { target: resolvedTarget });
        if (data.results && data.results.length > 0) {
          data.results.forEach((r: any) => addOutput('success', `[${r.status}] FOUND: ${resolvedTarget}${r.path}`));
          addOutput('system', `Complete. Found ${data.results.length} admin panel(s).`);
        } else {
          addOutput('info', 'No common admin panels found.');
        }
        setIsRunning(false);
        return;
      }

      // --- PWNUX CLI ---
      if (activeToolId === 'pwnux') {
        const args = input.trim().split(' ');
        const cmd = args[0].toLowerCase();

        if (cmd === 'help') {
          addOutput('info', `Available commands:
  nmap <target>    - Port scan
  ping <target>    - Ping target
  whois <domain>   - WHOIS lookup
  dns <domain>     - DNS records
  admin <url>      - Admin panel finder
  http <url>       - HTTP headers
  crawl <url>      - Web crawler
  help               - This help
  clear              - Clear output
  echo <text>      - Print text`);
        }
        else if (cmd === 'clear') { setOutput([]); }
        else if (cmd === 'echo') { addOutput('info', args.slice(1).join(' ')); }
        else if (cmd === 'nmap') {
          const host = args[1];
          if (!host) { addOutput('error', 'Usage: nmap <target>'); setIsRunning(false); return; }
          addOutput('system', `Scanning ${host} via backend...`);
          try {
            const data = await runBackendTool('portscan', { target: host });
            data.results.forEach((r: any) => {
              addOutput(r.isOpen ? 'success' : 'info', `Port ${r.port} (${r.service}): ${r.isOpen ? 'OPEN' : 'CLOSED'}`);
            });
          } catch (e: any) {
            addOutput('error', 'Scan failed: ' + e.message);
          }
        }
        else if (cmd === 'ping') {
          const host = args[1];
          if (!host) { addOutput('error', 'Usage: ping <target>'); setIsRunning(false); return; }
          addOutput('system', `Pinging ${host} via backend TCP...`);
          try {
            const data = await runBackendTool('ping', { target: host });
            addOutput('info', `Reply from ${data.ip} via port ${data.port}: time=${data.time}ms`);
          } catch (e: any) {
            addOutput('error', 'Ping failed: ' + e.message);
          }
        }
        else if (cmd === 'whois') {
          const domain = args[1];
          if (!domain) { addOutput('error', 'Usage: whois <domain>'); setIsRunning(false); return; }
          addOutput('system', `WHOIS ${domain}...`);
          try {
            const data = await runBackendTool('whois', { target: domain });
            data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
          } catch (e: any) {
            addOutput('error', 'WHOIS failed: ' + e.message);
          }
        }
        else if (cmd === 'dns') {
          const domain = args[1];
          if (!domain) { addOutput('error', 'Usage: dns <domain>'); setIsRunning(false); return; }
          addOutput('system', `DNS records for ${domain}...`);
          try {
            const data = await runBackendTool('dns', { target: domain });
            data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
            addOutput('success', 'DNS lookup complete.');
          } catch (e: any) {
            addOutput('error', 'DNS lookup failed: ' + e.message);
          }
        }
        else if (cmd === 'admin') {
          const site = args[1];
          if (!site) { addOutput('error', 'Usage: admin <url>'); setIsRunning(false); return; }
          addOutput('system', `Admin scan on ${site}...`);
          try {
            const data = await runBackendTool('adminfinder', { target: site });
            if (data.results && data.results.length > 0) {
              data.results.forEach((r: any) => addOutput('success', `[${r.status}] FOUND: ${site}${r.path}`));
            } else {
              addOutput('info', 'No admin panels found.');
            }
          } catch (e: any) {
            addOutput('error', 'Scan failed: ' + e.message);
          }
        }
        else if (cmd === 'http') {
          const url = args[1];
          if (!url) { addOutput('error', 'Usage: http <url>'); setIsRunning(false); return; }
          addOutput('system', `Headers for ${url}...`);
          try {
            const data = await runBackendTool('http', { target: url });
            data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
          } catch (e: any) {
            addOutput('error', 'HTTP failed: ' + e.message);
          }
        }
        else if (cmd === 'crawl') {
          const url = args[1];
          if (!url) { addOutput('error', 'Usage: crawl <url>'); setIsRunning(false); return; }
          addOutput('system', `Crawling ${url}...`);
          try {
            const data = await runBackendTool('spider', { target: url });
            data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
          } catch (e: any) {
            addOutput('error', 'Crawl failed: ' + e.message);
          }
        }
        else {
          addOutput('error', `Unknown command: ${cmd}. Type 'help'.`);
        }

        setIsRunning(false);
        return;
      }

      // --- REGULAR TOOLS ---
      if (activeToolId === 'shodan') {
        addOutput('system', `Shodan: ${resolvedTarget}`);
        addOutput('success', ( <CopyableLink url={`https://www.shodan.io/search?query=${encodeURIComponent(resolvedTarget)}`} label="→ Open Shodan search" /> ));
      }
      else if (activeToolId === 'vt') {
        addOutput('system', `VirusTotal: ${resolvedTarget}`);
        addOutput('success', ( <CopyableLink url={`https://www.virustotal.com/gui/search/${encodeURIComponent(resolvedTarget)}`} label="→ VirusTotal analysis" /> ));
      }
      else if (activeToolId === 'dorks') {
        addOutput('system', 'Google Dorks:');
        const cleanTarget = resolvedTarget.replace(/https?:\/\//, '');
        addOutput('info', `site:${cleanTarget} intitle:"index of"`);
        addOutput('info', `site:${cleanTarget} inurl:admin`);
        addOutput('info', `site:${cleanTarget} ext:sql|ext:env|ext:bak`);
        addOutput('info', `site:${cleanTarget} inurl:wp-admin`);
        addOutput('info', `site:${cleanTarget} intitle:"phpinfo"`);
        addOutput('success', ( <CopyableLink url={`https://www.google.com/search?q=site:${cleanTarget}`} label="→ Open Google search" /> ));
      }
      else if (activeToolId === 'pwned') {
        addOutput('system', `Checking if ${resolvedTarget} has been pwned...`);
        try {
          const data = await runBackendTool('pwned', { email: resolvedTarget });
          if (data.breaches && data.breaches.length > 0) {
            addOutput('error', `Found ${data.breaches.length} breaches!`);
            data.breaches.slice(0, 5).forEach((b: any) => addOutput('info', `- ${b.Name} (${b.BreachDate})`));
            if (data.breaches.length > 5) addOutput('info', '... and more');
          } else {
            addOutput('success', 'No breaches found.');
          }
          addOutput('success', ( <CopyableLink url={`https://haveibeenpwned.com/account/${encodeURIComponent(resolvedTarget)}`} label="→ View on HaveIBeenPwned" /> ));
        } catch (e: any) {
          addOutput('error', `Check failed: ${e.message}`);
          addOutput('success', ( <CopyableLink url={`https://haveibeenpwned.com/account/${encodeURIComponent(resolvedTarget)}`} label="→ View on HaveIBeenPwned" /> ));
        }
      }
      else if (activeToolId === 'blacklist') {
         addOutput('system', `Checking blacklists for ${resolvedTarget}...`);
         try {
           const data = await runBackendTool('blacklist', { target: resolvedTarget });
           addOutput('info', `Resolved IP: ${data.ip}`);
           data.results.forEach((r: any) => {
             addOutput(r.clean ? 'success' : 'error', `[${r.clean ? 'CLEAN' : 'LISTED'}] ${r.list}`);
           });
         } catch (e: any) {
           addOutput('error', `Blacklist check failed: ${e.message}`);
         }
      }
      else if (activeToolId === 'nmap' || activeToolId === 'port_scan') {
        addOutput('system', `Port scan on ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('portscan', { target: resolvedTarget });
          data.results.forEach((r: any) => {
            addOutput(r.isOpen ? 'success' : 'info', `Port ${r.port} (${r.service}): ${r.isOpen ? 'OPEN' : 'CLOSED'}`);
          });
          const openCount = data.results.filter((r: any) => r.isOpen).length;
          addOutput(openCount > 0 ? 'success' : 'info', `Scan complete. ${openCount} open ports found.`);
        } catch (e: any) {
          addOutput('error', `Port scan failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'whois') {
        addOutput('system', `WHOIS: ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('whois', { target: resolvedTarget });
          data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
        } catch (e: any) {
          addOutput('error', `WHOIS failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'dns') {
        addOutput('system', `DNS: ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('dns', { target: resolvedTarget });
          data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
          addOutput('success', 'DNS complete.');
        } catch (e: any) {
          addOutput('error', `DNS failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'ping') {
        addOutput('system', `Ping (TCP): ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('ping', { target: resolvedTarget });
          addOutput('success', `Reply from ${data.ip} via port ${data.port}: time=${data.time}ms`);
        } catch (e: any) {
          addOutput('error', `Ping failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'net_scan') {
        addOutput('system', `Network scan (subnet detection): ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('netscan', { target: resolvedTarget });
          addOutput('info', `Target IP: ${data.targetIp}`);
          if (data.alive && data.alive.length > 0) {
            data.alive.forEach((r: any) => addOutput('success', `Host alive: ${r.ip}`));
          } else {
             addOutput('info', 'No other alive hosts found in standard subnets.');
          }
        } catch (e: any) {
          addOutput('error', `Network scan failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'traceroute') {
        addOutput('system', `Traceroute: ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('traceroute', { target: resolvedTarget });
          data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
        } catch (e: any) {
          addOutput('error', `Traceroute failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'http') {
        addOutput('system', `HTTP headers: ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('http', { target: resolvedTarget });
          data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
        } catch (e: any) {
          addOutput('error', `HTTP failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'spider') {
        addOutput('system', `Crawling ${resolvedTarget}...`);
        try {
          const data = await runBackendTool('spider', { target: resolvedTarget });
          data.result.split('\n').filter((l: string) => l.trim()).forEach((l: string) => addOutput('info', l));
          addOutput('success', 'Crawl complete.');
        } catch (e: any) {
           addOutput('error', `Crawl failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'certs') {
        addOutput('system', `Fetching TLS certs for ${resolvedTarget}...`);
        try {
           const data = await runBackendTool('certs', { target: resolvedTarget });
           addOutput('info', `Subject: ${JSON.stringify(data.subject)}`);
           addOutput('info', `Issuer: ${JSON.stringify(data.issuer)}`);
           addOutput('info', `Valid From: ${data.valid_from}`);
           addOutput('info', `Valid To: ${data.valid_to}`);
           addOutput('info', `Fingerprint: ${data.fingerprint}`);
           addOutput('success', 'Certificate retrieved.');
        } catch (e: any) {
           addOutput('error', `Cert fetch failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'mac') {
        addOutput('system', `Looking up MAC vendor for: ${resolvedTarget}...`);
        try {
           const data = await runBackendTool('mac', { address: resolvedTarget });
           addOutput('success', `Vendor: ${data.vendor}`);
        } catch (e: any) {
           addOutput('error', `MAC lookup failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'mail') {
        addOutput('system', `Mail server check: ${resolvedTarget}...`);
        try {
           const data = await runBackendTool('mail', { target: resolvedTarget });
           if (data.mx && data.mx.length > 0) {
             data.mx.forEach((m: any) => addOutput('info', `[MX] ${m.priority} ${m.exchange}`));
           } else { addOutput('error', 'No MX records found'); }
           if (data.spf && data.spf.length > 0) {
             data.spf.forEach((s: any) => addOutput('success', `[SPF] ${s}`));
           } else { addOutput('error', 'No SPF records found'); }
           if (data.dmarc && data.dmarc.length > 0) {
             data.dmarc.forEach((d: any) => addOutput('success', `[DMARC] ${d}`));
           }
        } catch (e: any) {
           addOutput('error', `Mail check failed: ${e.message}`);
        }
      }
      else if (activeToolId === 'cve') {
        addOutput('success', ( <CopyableLink url={`https://nvd.nist.gov/vuln/search/results?query=${encodeURIComponent(resolvedTarget)}`} label="→ NVD CVE Search" /> ));
      }
      else if (activeToolId === 'base64') {
        if (input.startsWith('decode:')) {
          try {
            addOutput('info', `Decoded: ${atob(input.replace('decode:', '').trim())}`);
          } catch { addOutput('error', 'Invalid Base64.'); }
        } else {
          addOutput('info', `Encoded: ${btoa(input)}`);
        }
      }
      else if (activeToolId === 'cipher') {
        const text = input;
        // Try ROT13
        const rot13 = text.replace(/[a-zA-Z]/g, (c: string) => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + 13) % 26) + 65);
          if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + 13) % 26) + 97);
          return c;
        });
        addOutput('info', `ROT13: ${rot13}`);
        
        // Check if hex
        if (/^[0-9a-fA-F\s]+$/.test(text)) {
          const hex = text.replace(/\s/g, '');
          if (hex.length % 2 === 0) {
            let decoded = '';
            for (let i = 0; i < hex.length; i += 2) {
              decoded += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
            }
            addOutput('info', `Hex decoded: ${decoded}`);
          }
        }
        
        // Check if binary
        if (/^[01\s]+$/.test(text)) {
          const bin = text.replace(/\s/g, '');
          if (bin.length % 8 === 0) {
            let decoded = '';
            for (let i = 0; i < bin.length; i += 8) {
              decoded += String.fromCharCode(parseInt(bin.substring(i, i+8), 2));
            }
            addOutput('info', `Binary decoded: ${decoded}`);
          }
        }
        
        // Try Base64
        try {
          const decoded = atob(text);
          if (decoded.length > 2 && /^[\x20-\x7E]+$/.test(decoded)) {
            addOutput('info', `Base64 decoded: ${decoded}`);
          }
        } catch {}
      }
      else {
        addOutput('info', `${activeToolId} executed for ${resolvedTarget}`);
      }
    } catch (e: any) {
      addOutput('error', `Failed: ${e.message}`);
    } finally {
      setTarget('');
      setIsRunning(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (target.trim() && tool) {
      const input = target;
      setTarget('');
      setShowInput(false);
      handleRunTarget(input);
    }
  };

  const copyAllOutput = () => {
    const text = output.map(o => {
      if (typeof o.content === 'string') return o.content;
      return '';
    }).filter(Boolean).join('\n');
    copyToClipboardV2(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tool) return null;

  const status = getStatusBadge();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <TerminalIcon size={18} className="text-purple-400" />
          <span className="text-sm font-mono text-gray-300">
            SYSTEM // MODULE.{tool.id.toUpperCase()}
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${status.color}`}>
            {status.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono">{output.length} lines</span>
          <button onClick={copyAllOutput} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Copy output">
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5">
        <p className="text-xs text-gray-500 font-mono">{tool.description}</p>
      </div>

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {output.length === 0 && !isRunning && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <TerminalIcon size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Ready. {tool.requiresInput ? 'Enter a target below.' : 'Initializing...'}</p>
          </div>
        )}
        {output.map(entry => (
          <div key={entry.id} className={`${getTypeColor(entry.type)} leading-relaxed break-words whitespace-pre-wrap`}>
            <span className="text-[10px] opacity-40 mr-2 shrink-0">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
            <span className="align-middle">{entry.content}</span>
          </div>
        ))}
        {isRunning && (
          <div className="flex items-center gap-2 text-yellow-400/70 mt-2">
            <RefreshCw size={14} className="animate-spin shrink-0" />
            <span className="text-xs">Processing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      {showInput && !isRunning && (
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 bg-black/30">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10 focus-within:border-purple-500/50">
            <span className="text-purple-400 text-xs font-mono">λ</span>
            <input
              ref={inputRef}
              type="text"
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder={tool.id.includes('admin') ? 'Enter URL (e.g., example.com)' : 'Enter target...'}
              className="flex-1 bg-transparent text-gray-200 text-sm font-mono outline-none placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={!target.trim()}
              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Play size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
