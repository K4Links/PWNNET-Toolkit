import { useState, useMemo, useEffect } from 'react';
import { 
  HelpCircle, BookOpen, FileText, Eye, CloudLightning, Link,
  TerminalSquare, Hash, MonitorDot, Link2, MonitorDown, FileBadge,
  FileCode2, Globe2, X, Search, ChevronRight, ArrowLeft, Shield
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResourceDef {
  id: string;
  name: string;
  category: 'Cheat Sheets' | 'Networking' | 'Reference' | 'Web Web';
  icon: any;
  content: {
    title: string;
    subtitle: string;
    columns: string[];
    rows: string[][];
    summaryText?: string;
  };
}

const getResourceCategoryStyles = (category: string) => {
  switch (category) {
    case 'Cheat Sheets':
      return {
        borderClass: 'border-purple-500/20 hover:border-purple-400/60',
        iconBg: 'bg-gradient-to-br from-purple-500/10 via-[#150a1e] to-purple-950/40 border-purple-500/25 text-purple-400 group-hover:text-purple-300 group-hover:border-purple-400/50',
        btnBg: 'hover:bg-purple-500/[0.03] hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]',
        accentText: 'text-purple-400 group-hover:text-purple-300',
        line: 'bg-purple-400',
        badge: 'text-purple-400 bg-purple-950/40 border-purple-500/20'
      };
    case 'Networking':
      return {
        borderClass: 'border-cyan-500/20 hover:border-cyan-400/60',
        iconBg: 'bg-gradient-to-br from-cyan-500/10 via-[#0a1e28] to-cyan-950/40 border-cyan-500/25 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-400/50',
        btnBg: 'hover:bg-cyan-500/[0.03] hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]',
        accentText: 'text-cyan-400 group-hover:text-cyan-300',
        line: 'bg-cyan-400',
        badge: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20'
      };
    case 'Reference':
    default:
      return {
        borderClass: 'border-teal-500/20 hover:border-teal-400/60',
        iconBg: 'bg-gradient-to-br from-teal-500/10 via-[#081b16] to-teal-950/40 border-teal-500/25 text-teal-400 group-hover:text-teal-300 group-hover:border-teal-400/50',
        btnBg: 'hover:bg-teal-500/[0.03] hover:shadow-[0_0_15px_rgba(20,184,166,0.1)]',
        accentText: 'text-teal-400 group-hover:text-teal-300',
        line: 'bg-teal-400',
        badge: 'text-teal-400 bg-teal-950/40 border-teal-500/20'
      };
  }
};

export function Resources() {
  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle hardware back button for Resource details
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we go back and there's no res state, but we had a res open, close it
      if (selectedResId && (!e.state || e.state.view !== 'resource')) {
        setSelectedResId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedResId]);

  const handleSelectRes = (id: string) => {
    setSelectedResId(id);
    window.history.pushState({ view: 'resource', id }, '');
  };

  const handleCloseRes = () => {
    setSelectedResId(null);
    if (window.history.state?.view === 'resource') {
      window.history.back();
    }
  };

  const resources: ResourceDef[] = [
    { 
      id: 'ports', 
      name: 'Common TCP/UDP Ports', 
      category: 'Networking', 
      icon: MonitorDot,
      content: {
        title: 'TCP/UDP Port Registry Directory',
        subtitle: 'Standard Well-Known Network Ports Allocation',
        columns: ['PORT', 'PROTOCOL', 'KEY SERVICE & TYPICAL VECTOR'],
        rows: [
          ['21', 'TCP', 'FTP (File Transfer Protocol) - Vulnerable to packet sniffing'],
          ['22', 'TCP', 'SSH (Secure Terminal Access) - Encrypted key exchange access'],
          ['23', 'TCP', 'Telnet (Cleartext Access) - Deprecated, brute-force prone'],
          ['25', 'TCP', 'SMTP (Email Routing) - Critical SPAM & bounce vectors'],
          ['53', 'UDP', 'DNS (Domain Name Service) - Domain mappings, zone leaks'],
          ['80', 'TCP', 'HTTP (Web Traffic) - Cleartext unencrypted connections'],
          ['110', 'TCP', 'POP3 (Mail Client Fetching) - Cleartext password access'],
          ['161', 'UDP', 'SNMP (Router Diagnostics) - Community strings scans'],
          ['443', 'TCP', 'HTTPS (Secure TLS Web) - Mandatory for modern safety'],
          ['445', 'TCP', 'SMB (Windows Active Sharing) - Target of MS17-010 leaks'],
          ['3306', 'TCP', 'MySQL (Relational Database) - Target of SQLi & cred scans'],
          ['8080', 'TCP', 'HTTP Alternate - Often used in microservices & dev setups']
        ],
        summaryText: "Note: In cybersecurity audits, mapping port numbers to actual service responses is critical to trace host exposure risks."
      }
    },
    { 
      id: 'ascii', 
      name: 'ASCII Code Matrix', 
      category: 'Reference', 
      icon: FileText,
      content: {
        title: 'ASCII Control Matrix & Character Set',
        subtitle: 'Numeric representation of text elements',
        columns: ['DEC', 'HEX', 'BIN', 'CHARACTER', 'DESCRIPTION'],
        rows: [
          ['32', '20', '00100000', '[SPC]', 'Whitespace / Standard Space'],
          ['33', '21', '00100001', '!', 'Exclamation Point'],
          ['36', '24', '00100100', '$', 'Dollar Currency Character'],
          ['43', '2B', '00101011', '+', 'Mathematical Plus operator'],
          ['48', '30', '00110000', '0', 'Numerical zero'],
          ['65', '41', '01000001', 'A', 'Capital Letter A'],
          ['97', '61', '01100001', 'a', 'Lowercase alphabet start'],
          ['123', '7B', '01111011', '{', 'Curved Opening Bracket'],
          ['126', '7E', '01111110', '~', 'Tilde Operator Accent']
        ],
        summaryText: "Computes base alignments for binary systems and memory address headers within compiler payloads."
      }
    },
    { 
      id: 'http_status', 
      name: 'HTTP Status Reference', 
      category: 'Reference', 
      icon: FileCode2,
      content: {
        title: 'Hypertext Protocol Status Codes Directory',
        subtitle: 'Returned Web Header Handshaking Keys',
        columns: ['CODE', 'CLASSIFICATION', 'SHORT SUMMARY & IMPACT'],
        rows: [
          ['200', 'SUCCESS', 'OK - Connection completed correctly and payload delivered.'],
          ['301', 'REDIRECTION', 'Moved Permanently - Ingress routed to a different URI.'],
          ['400', 'CLIENT ERROR', 'Bad Request - Web requests syntax is incorrect.'],
          ['401', 'AUTH EXCEPTION', 'Unauthorized - Handshake requires credential verification.'],
          ['403', 'AUTH ACCESS', 'Forbidden - User credentials lack host permissions.'],
          ['404', 'SYSTEM ERROR', 'Not Found - Targeted resource could not be found under server.'],
          ['500', 'SERVER ERROR', 'Internal Server Error - Internal error crashed active request.'],
          ['503', 'SERVICE EXCEPTION', 'Service Unavailable - Active node overloaded or offline.']
        ],
        summaryText: "Returned responses from API queries can indicate exposed security boundaries, misconfigurations, or database states."
      }
    },
    { 
      id: 'url_enc', 
      name: 'URL Encoding Reference', 
      category: 'Reference', 
      icon: FileCode2,
      content: {
        title: 'Web URI Hex Escape Codes Sheet',
        subtitle: 'Used for query parameters and safe headers encoding',
        columns: ['HEX ENCODING', 'RAW STRING INPUT', 'USAGES & EXPLANATIONS'],
        rows: [
          ['%20', '[SPACE]', 'Inserts standard whitespaces inside target inputs'],
          ['%21', '!', 'Renders exclamation point identifiers'],
          ['%23', '#', 'Indicates HTML element anchors, block headers'],
          ['%24', '$', 'Currency symbol representation in URLs'],
          ['%26', '&', 'URI query query string concatenator symbol'],
          ['%2B', '+', 'Used inside math encoding schemes'],
          ['%2F', '/', 'Primary website routing directory separator'],
          ['%3A', ':', 'Used for port assignments and protocol schemas'],
          ['%3D', '=', 'Matches specific key/value strings assignments'],
          ['%3F', '?', 'Starts URL GET attributes list arrays']
        ],
        summaryText: "Mandatory format when injection parameters must traverse proxy channels safely."
      }
    },
    { 
      id: 'tips', 
      name: 'Linux Terminal Cheatsheet', 
      category: 'Cheat Sheets', 
      icon: TerminalSquare,
      content: {
        title: 'Essential CLI Commands Directory',
        subtitle: 'Linux System Operator Cheat Sheet Reference',
        columns: ['COMMAND', 'ARGS SYNTX', 'DETAILED FUNCTION OUTCOMES'],
        rows: [
          ['ls', '-la', 'List directories showing permissions, size, hidden files'],
          ['chmod', '+x <file>', 'Give designated shell-script execute permissions'],
          ['ssh', 'user@host', 'Initialize encrypted CLI connection to remoters'],
          ['curl', '-I <url>', 'Fetch targeted web headers without pulling documents'],
          ['grep', '-rI "text" .', 'Recursively search directory text bypassing binaries'],
          ['ps', 'aux', 'List active system processes and execution owners'],
          ['ip', 'addr show', 'Print connected network adapters & local IPs'],
          ['systemctl', 'status ssh', 'Check remote admin daemon active states']
        ],
        summaryText: "Handy shortcuts for navigating command consoles on targeted remote terminals."
      }
    },
    { 
      id: 'protocols', 
      name: 'IP & Network Protocols', 
      category: 'Networking', 
      icon: Link2,
      content: {
        title: 'Network Transport Headers Protocol List',
        subtitle: 'Standard parameters describing packet exchanges',
        columns: ['CODE', 'ACRONYM', 'LAYER LEVEL', 'OPERATIONAL BRIEF'],
        rows: [
          ['IP', 'Internet Protocol', 'Network Layer (L3)', 'Unreliable host-to-host packet routing'],
          ['TCP', 'Transmission Control', 'Transport Layer (L4)', 'Reliable connection-oriented stateful packet stream'],
          ['UDP', 'User Datagram', 'Transport Layer (L4)', 'Fast stateless unacknowledged message broadcasts'],
          ['ICMP', 'Control Messages', 'Network Layer (L3)', 'Diagnostic checks, errors, standard terminal ping signals'],
          ['ARP', 'Address Resolution', 'Data Link (L2)', 'Maps hardware MAC codes to IP address arrays']
        ],
        summaryText: "Each protocol has unique packet structure headers which can be audited via network scanners."
      }
    },
    { 
      id: 'osi_model', 
      name: 'OSI Model Reference', 
      category: 'Networking', 
      icon: CloudLightning,
      content: {
        title: 'OSI 7-Layer Protocol Matrix',
        subtitle: 'Standardized network architecture layers',
        columns: ['LAYER', 'NAME / PROTOCOLS', 'SECURITY VECTORS & FUNCTION'],
        rows: [
          ['7', 'Application (HTTP, FTP, DNS)', 'Payload execution, app-level attacks (XSS, SQLi, CSRF)'],
          ['6', 'Presentation (SSL/TLS, JPEG)', 'Encryption flaws, evasion techniques, data mangling'],
          ['5', 'Session (RPC, NetBIOS)', 'Session hijacking, token manipulation, credential bruteforcing'],
          ['4', 'Transport (TCP, UDP)', 'Port scanning, SYN floods, DoS/DDoS vectors'],
          ['3', 'Network (IPv4, IPv6, ICMP)', 'IP spoofing, packet sniffing, route hijacking, ping sweeps'],
          ['2', 'Data Link (MAC, ARP, VLAN)', 'ARP spoofing, MAC cloning, VLAN hopping, rogue switches'],
          ['1', 'Physical (Cables, Radio)', 'Wiretapping, signal jamming, physical access, rogue APs']
        ],
        summaryText: "Understanding the OSI model helps pinpoint the operational layer of network vulnerabilities and defense mechanisms."
      }
    },
    { 
      id: 'nmap_flags', 
      name: 'Nmap Scanning Flags', 
      category: 'Cheat Sheets', 
      icon: Eye,
      content: {
        title: 'Network Mapper Diagnostics Cheatsheet',
        subtitle: 'Common reconnaissance and host discovery arguments',
        columns: ['FLAG', 'SCAN TYPE', 'DETAILED FUNCTION OUTCOMES'],
        rows: [
          ['-sS', 'TCP SYN Scan', 'Stealthy half-open scan, does not complete TCP handshake (requires root)'],
          ['-sT', 'TCP Connect Scan', 'Standard full connection scan, leaves logs on target systems'],
          ['-sU', 'UDP Scan', 'Probes UDP ports, often slow and requires reliable responses'],
          ['-sV', 'Service Version', 'Interrogates open ports to determine service and version info'],
          ['-O', 'OS Detection', 'Enables heuristic OS finger-printing based on packet responses'],
          ['-p-', 'All Ports', 'Scans all 65535 ports instead of default top 1000 ports'],
          ['-T4', 'Aggressive Timing', 'Speeds up scans by reducing timeouts (0=Paranoid to 5=Insane)'],
          ['-A', 'Aggressive Scan', 'Enables OS detection, version detection, scripts, and traceroute'],
          ['--script', 'NSE Scripts', 'Runs designated Nmap Scripting Engine categories (e.g., vuln, default)']
        ],
        summaryText: "Nmap is the foundational tool for mapping subnets, identifying live hosts, and profiling exposed services."
      }
    },
    { 
      id: 'owasp_top10', 
      name: 'OWASP Top 10 Vulns', 
      category: 'Reference', 
      icon: Shield,
      content: {
        title: 'Open Web Application Security Project',
        subtitle: 'Most critical web application security risks',
        columns: ['RANK', 'VULNERABILITY CATEGORY', 'DESCRIPTION & IMPACT'],
        rows: [
          ['A01', 'Broken Access Control', 'Users act outside intended permissions, leading to unauthorized data exposure'],
          ['A02', 'Cryptographic Failures', 'Weak crypto algorithms or key management exposing sensitive data in transit/rest'],
          ['A03', 'Injection (SQL, NoSQL, OS)', 'Untrusted data sent to an interpreter, enabling arbitrary command execution'],
          ['A04', 'Insecure Design', 'Flaws in application architecture and threat modeling lacking security controls'],
          ['A05', 'Security Misconfiguration', 'Default accounts, missing patches, verbose error messages exposing system details'],
          ['A06', 'Vulnerable Components', 'Using unpatched libraries, frameworks, or dependencies with known exploits'],
          ['A07', 'Auth Failures', 'Compromised passwords, session tokens, or flawed authentication mechanisms'],
          ['A08', 'Software/Data Integrity', 'Code and infrastructure lacking integrity verification (e.g., CI/CD pipelines)'],
          ['A09', 'Security Logging/Monitoring', 'Failure to log and alert on active breaches, prolonging attack dwell time'],
          ['A10', 'SSRF', 'Server-Side Request Forgery forcing backend servers to fetch arbitrary URLs']
        ],
        summaryText: "The OWASP Top 10 provides a standard awareness document for developers and security testing methodologies."
      }
    }
  ];

  // Perform search
  const filteredResources = useMemo(() => {
    return resources.filter(res => 
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeRes = useMemo(() => {
    return resources.find(r => r.id === selectedResId) || null;
  }, [selectedResId]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-obsidian relative">
      {/* CRT overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] z-10 opacity-30"></div>

      {/* Search Header */}
      <div className="p-4 bg-[#0a0a0a] border-b border-border-gray shrink-0 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="SEARCH REFERENCE RESOURCES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-border-gray focus:border-neon-green/80 text-neon-green text-xs font-mono uppercase px-10 py-2.5 rounded-xl focus:outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Cheat Cards Grid lists */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pb-28">
        {filteredResources.map((res, index) => {
          const Icon = res.icon;
          const styles = getResourceCategoryStyles(res.category);
          return (
            <motion.button
              key={res.id}
              onClick={() => handleSelectRes(res.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: Math.min(index * 0.015, 0.2) }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-stretch text-left bg-[#0c0c0c]/90 border ${styles.borderClass} p-3.5 group aspect-square relative select-none transition-all duration-300 rounded-2xl cursor-pointer ${styles.btnBg}`}
            >
              <div className={`absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[7.5px] font-mono tracking-wider font-extrabold transition-colors border ${styles.badge}`}>
                {res.category.toUpperCase()}
              </div>

              <div className="flex-1 flex items-center justify-start mt-2">
                <div className={`p-2.5 ${styles.iconBg} border transition-all duration-300 rounded-xl shadow-inner`}>
                  <Icon size={36} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-2.5 text-[11px] font-bold font-sans text-gray-200 group-hover:text-white line-clamp-2 leading-tight tracking-wide">
                {res.name}
              </div>
              <div className="mt-2 text-[8px] font-mono text-gray-400 group-hover:text-white flex items-center justify-between">
                <span className={`text-[7.5px] ${styles.accentText} font-bold tracking-wider`}>[OPEN SECURE ARCHIVE]</span>
                <ChevronRight size={10} className={`${styles.accentText}`} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Overlay Slide-out View Panel */}
      {activeRes && (
        <div className="absolute inset-0 bg-obsidian z-50 flex flex-col pt-14 pb-16 font-mono text-neon-green">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-dark-gray border-b border-teal-500 flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-teal-400 font-bold uppercase text-[10px] tracking-widest">
              <span>REFERENCE ARCHIVE // {activeRes.id.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleCloseRes} 
              className="text-teal-400 hover:text-white hover:bg-teal-400/15 border border-teal-400/40 hover:border-teal-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-xs font-mono font-bold uppercase active:scale-95"
            >
              <ArrowLeft size={14} className="stroke-[2.5px]" />
              <span>BACK</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start">
            <div className="border border-teal-500/20 bg-[#0c0c0c]/90 p-5 flex-1 flex flex-col rounded-2xl shadow-xl">
              {/* Title descriptions */}
              <div className="mb-4 pb-2 border-b border-border-gray/50 shrink-0">
                <h2 className="text-xs font-extrabold uppercase text-white tracking-widest flex items-center gap-1.5">
                  <FileText size={14} className="text-teal-400" />
                  {activeRes.content.title}
                </h2>
                <p className="text-[10px] text-gray-400 uppercase mt-0.5">{activeRes.content.subtitle}</p>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-hidden flex flex-col bg-black border border-border-gray text-[10px] sm:text-xs rounded-xl">
                {/* Columns Header */}
                <div className="grid grid-cols-12 bg-[#090909] border-b border-border-gray font-bold p-2 text-teal-400 shrink-0">
                  <span className="col-span-3 truncate">{activeRes.content.columns[0]}</span>
                  <span className="col-span-3 truncate">{activeRes.content.columns[1]}</span>
                  <span className="col-span-6 truncate">{activeRes.content.columns[2]}</span>
                </div>

                {/* Rows List */}
                <div className="flex-1 overflow-y-auto divide-y divide-border-gray/30">
                  {activeRes.content.rows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 p-2 hover:bg-[#070707] transition-colors leading-relaxed font-mono">
                      <span className="col-span-3 text-white font-bold">{row[0]}</span>
                      <span className="col-span-3 text-teal-400/80">{row[1]}</span>
                      <span className="col-span-6 text-gray-300">{row[2]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeRes.content.summaryText && (
                <div className="mt-4 p-2.5 bg-[#051109] border border-[#0d2a13] text-[9px] text-[#00FF41]/80 max-w-full italic shrink-0 rounded-xl leading-tight">
                  {activeRes.content.summaryText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
