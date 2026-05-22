import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import net from 'net';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for port scanning
const checkPort = (port: number, host: string, timeout = 2000): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.on('connect', () => {
      status = true;
      socket.destroy();
    });

    socket.setTimeout(timeout);
    socket.on('timeout', () => {
      socket.destroy();
    });

    socket.on('error', () => {
      socket.destroy();
    });

    socket.on('close', () => {
      resolve(status);
    });

    socket.connect(port, host);
  });
};

// --- API ROUTES ---

// 1. Port Scanner
app.get('/api/net/portscan', async (req, res) => {
  const { target } = req.query;
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target is required' });
  }

  const commonPorts = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 23, service: 'Telnet' },
    { port: 25, service: 'SMTP' },
    { port: 53, service: 'DNS' },
    { port: 80, service: 'HTTP' },
    { port: 110, service: 'POP3' },
    { port: 143, service: 'IMAP' },
    { port: 443, service: 'HTTPS' },
    { port: 3306, service: 'MySQL' },
    { port: 8080, service: 'HTTP-Proxy' }
  ];

  try {
    const results = await Promise.all(
      commonPorts.map(async (p) => {
        const isOpen = await checkPort(p.port, target, 2500);
        return { ...p, isOpen };
      })
    );
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan ports' });
  }
});

// 2. Mail Servers (MX & TXT)
app.get('/api/net/mail', async (req, res) => {
  const { target } = req.query;
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target is required' });
  }

  try {
    let mxRecords = [];
    try {
      mxRecords = await resolveMx(target);
      // Sort by priority
      mxRecords.sort((a, b) => a.priority - b.priority);
    } catch (e) {
      // Ignored if no MX
    }

    let txtRecordsStr = [];
    try {
      const txtRecords = await resolveTxt(target);
      txtRecordsStr = txtRecords.map(t => t.join(''));
    } catch (e) {
      // Ignored if no TXT
    }

    // Filter TXT for SPF and DMARC
    const spf = txtRecordsStr.filter(r => r.startsWith('v=spf1'));
    
    // Attempt DMARC lookup if target is domain
    let dmarc = [];
    try {
      const dmarcTxt = await resolveTxt(`_dmarc.${target}`);
      dmarc = dmarcTxt.map(t => t.join('')).filter(r => r.startsWith('v=DMARC1'));
    } catch (e) {
      // Ignored
    }

    res.json({ mx: mxRecords, spf, dmarc });
  } catch (error) {
    res.status(500).json({ error: 'Failed DNS lookup' });
  }
});

// 3. MAC Vendor Lookup
app.get('/api/net/mac', async (req, res) => {
  const { address } = req.query;
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'MAC Address is required' });
  }

  try {
    // MacVendors API is free and doesn't require keys for simple GETs
    const response = await fetch(`https://api.macvendors.com/${encodeURIComponent(address)}`);
    if (response.ok) {
      const vendor = await response.text();
      res.json({ vendor });
    } else {
      res.status(404).json({ error: 'Vendor not found for this MAC address' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to lookup MAC' });
  }
});

// 4. Traceroute (using HackerTarget API)
app.get('/api/net/traceroute', async (req, res) => {
  const { target } = req.query;
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target is required' });
  }

  try {
    const response = await fetch(`https://api.hackertarget.com/mtr/?q=${encodeURIComponent(target)}`);
    if (response.ok) {
      const data = await response.text();
      // the api sometimes returns limit messages
      if (data.includes('error') || data.includes('API count exceeded')) {
        res.status(429).json({ error: 'API limit exceeded. Please try again later.' });
      } else {
        res.json({ result: data });
      }
    } else {
      res.status(500).json({ error: 'Failed to perform traceroute' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform traceroute' });
  }
});

// 5. Network Scanner (Lightweight Ping / Socket sweep of targeted CIDR base)
app.get('/api/net/netscan', async (req, res) => {
  const { target } = req.query;
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target is required' });
  }

  try {
    // Basic IP detection
    let scanIp = target;
    if (!/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(target)) {
       try {
         const dnsRes = await resolveTxt(target); // just to check if it resolves, fallback to lookup
       } catch(e) {}
       // Node defaults to callback dns.lookup, let's use dns.promises
       const lookRes = await dns.promises.lookup(target);
       scanIp = lookRes.address;
    }

    const parts = scanIp.split('.');
    if (parts.length === 4) {
      const base = `${parts[0]}.${parts[1]}.${parts[2]}`;
      const targetsToScan = [1, 2, 10, 20, 50, 100, Number(parts[3]), 254];
      // remove dups
      const uniqueTargets = [...new Set(targetsToScan)].slice(0, 5);

      const results = await Promise.all(
        uniqueTargets.map(async (lastOctet) => {
          const ip = `${base}.${lastOctet}`;
          const isAlive = await checkPort(80, ip, 1000) || await checkPort(443, ip, 1000);
          return { ip, isAlive };
        })
      );
      res.json({ targetIp: scanIp, alive: results.filter(r => r.isAlive) });
    } else {
      res.status(400).json({ error: 'Invalid IPv4 structure' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan subnet for target' });
  }
});

// 6. Shell/FTP connect banner grab
app.get('/api/net/shell', async (req, res) => {
  const { target } = req.query;
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target is required' });
  }

  const grabBanner = (port: number, host: string, timeout = 3000): Promise<{open: boolean, banner: string, error?: string}> => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let buf = '';
      let tcpError = '';

      socket.setTimeout(timeout);

      socket.on('data', (data) => {
        buf += data.toString();
        if (buf.length > 5) {
           socket.destroy();
        }
      });

      socket.on('connect', () => {
      });

      socket.on('timeout', () => {
        tcpError = 'ETIMEDOUT (Connection timed out)';
        socket.destroy();
      });

      socket.on('error', (err: any) => {
        tcpError = err.code || err.message || 'Connection failed';
        socket.destroy();
      });

      socket.on('close', () => {
        resolve({ 
          open: buf.length > 0 || socket.bytesRead > 0, 
          banner: buf.trim(),
          error: tcpError
        });
      });

      try {
        socket.connect(port, host);
      } catch (err: any) {
        resolve({ open: false, banner: '', error: err.message });
      }
    });
  };

  try {
    const [ssh, ftp] = await Promise.all([
      grabBanner(22, target),
      grabBanner(21, target)
    ]);
    res.json({ ssh, ftp });
  } catch (error) {
    res.status(500).json({ error: 'Banner grab failed' });
  }
});

// --- VITE DEV SERVER OR PROD STATIC ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
