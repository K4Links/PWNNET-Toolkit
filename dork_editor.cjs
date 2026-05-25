const fs = require('fs');
let code = fs.readFileSync('src/components/Terminal.tsx', 'utf8');

const presetsData = `const dorkPresets: Record<string, {name: string, dorks: string[]}> = {
  index_of: {
    name: 'Open Directory Listings',
    dorks: [
      'intitle:"index of" admin',
      'intitle:"index of" backuper',
      'intitle:"index of" "parent directory" config',
      'intitle:"index of" "DCIM"'
    ]
  },
  admin_panel: {
    name: 'Admin Portals',
    dorks: [
      'inurl:admin login | inurl:wp-admin | inurl:dashboard | intitle:"Admin Panel"',
      'intitle:"Login - Admin" | inurl:admin/login.php',
      'inurl:cpanel | inurl:whm | inurl:plesk',
      'intitle:"Authentication Required" "Enter username and password"'
    ]
  },
  docs: {
    name: 'Confidential Docs',
    dorks: [
      'ext:pdf | ext:docx | ext:xls | ext:csv "confidential" | "strictly confidential"',
      'ext:pdf "not for public release" | "internal use only"',
      'ext:xls "payroll" | "passwords" | "social security"',
      'ext:pdf | ext:docx "do not distribute" | "proprietary"'
    ]
  },
  passwords: {
    name: 'Exposed Passwords',
    dorks: [
      'ext:txt | ext:csv "password" | "credentials" | "apikey" | "secret"',
      'ext:log "username" "password"',
      'inurl:passwords.txt | inurl:credentials.csv',
      'ext:env "DB_PASSWORD" | "DATABASE_URL"'
    ]
  },
  logs: {
    name: 'Server Error Logs',
    dorks: [
      'ext:log | ext:txt "error log" | "warning: mysql" | "exception"',
      'ext:log "access denied for user"',
      'ext:log "Failed password for root"',
      'ext:log "PHP Parse error" | "PHP Fatal error"'
    ]
  },
  databases: {
    name: 'Database Backups',
    dorks: [
      'ext:sql | ext:db | ext:dbf | ext:dump "insert into" | "create table"',
      'ext:sql inurl:backup',
      'ext:tar.gz | ext:zip "backup" "sql"',
      'ext:db "SQLite format 3"'
    ]
  },
  configs: {
    name: 'Environment Secrets',
    dorks: [
      'ext:env | ext:cfg | ext:ini "AWS_ACCESS_KEY" | "DB_PASSWORD" | "JWT_SECRET"',
      'ext:json "client_secret" "client_id"',
      'ext:xml "hibernate.connection.password"',
      'inurl:wp-config.php.bak | inurl:wp-config.php.txt'
    ]
  },
  webcam: {
    name: 'Live Webcams',
    dorks: [
      'inurl:"viewerframe?mode=" | inurl:"view/index.shtml" | intitle:"Live View / - AXIS"',
      'intitle:"Network Camera NetworkCamera"',
      'inurl:"nph-MotionJpeg?Resolution="',
      'intitle:"webcamXP 5" -download'
    ]
  },
  git_expose: {
    name: 'Git Directory Leak',
    dorks: [
      'inurl:".git" | intitle:"index of /.git"',
      'inurl:"/.git/config" "core"',
      'inurl:".git/HEAD" "ref: refs/heads/"',
      'intitle:"index of" ".git/logs/"'
    ]
  },
  jira_trello: {
    name: 'Jira / Trello Boards',
    dorks: [
      'site:trello.com | site:atlassian.net "password" | "secret" | "api key"',
      'site:trello.com "confidential" | "internal"',
      'site:atlassian.net "dashboard" "login"',
      'site:trello.com "aws" | "credentials"'
    ]
  },
  s3_buckets: {
    name: 'Open S3 Buckets',
    dorks: [
      'site:s3.amazonaws.com | site:storage.googleapis.com "admin" | "backup"',
      'site:s3.amazonaws.com "confidential" | "secret" | "password"',
      'site:s3.amazonaws.com ext:pdf | ext:xls | ext:csv',
      'site:s3.amazonaws.com intext:"ListBucketResult"'
    ]
  },
  pastebin: {
    name: 'Pastebin Leaks',
    dorks: [
      'site:pastebin.com "password" | "api_key" | "secret" | "db_pass"',
      'site:pastebin.com "BEGIN RSA PRIVATE KEY"',
      'site:pastebin.com "mysql:host="',
      'site:pastebin.com "admin@"'
    ]
  },
  cve: {
    name: 'Vulnerable Software',
    dorks: [
      'intext:"Apache Tomcat/8.5.32" | "nginx/1.14.0"',
      'intext:"Powered by WordPress 4.7.1" | "Powered by Joomla! 1.5"',
      'intitle:"phpMyAdmin" "Welcome to phpMyAdmin"',
      'inurl:"/cgi-bin/guestbook.cgi"'
    ]
  },
  api_endpoints: {
    name: 'Exposed APIs',
    dorks: [
      'inurl:api/v1 | inurl:api/v2 | inurl:swagger-ui.html | inurl:api-docs',
      'intitle:"Swagger UI" -github.com',
      'inurl:"/wp-json/wp/v2/users"',
      'inurl:"graphql" "query"'
    ]
  },
  cloud_credentials: {
    name: 'Cloud Credentials',
    dorks: [
      '"-----BEGIN RSA PRIVATE KEY-----" | "AIzaSy" | "AKIA" | "sk_live_"',
      '"ghp_" | "glpat-" | "sq0csp-"',
      '"xoxb-" | "xoxp-" | "EAACEdEose0cBA"',
      '"mongodb+srv://" "password"'
    ]
  }
};`;

const presetsHtml = `                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
                      {Object.keys(dorkPresets).map((presetKey) => {
                        const preset = dorkPresets[presetKey];
                        return (
                          <div key={presetKey} className="flex flex-col border border-neon-green/20 rounded-xl overflow-hidden bg-black focus-within:border-neon-green">
                            <button
                                onClick={() => { setDorkType(presetKey); setSubDork(0); }}
                                className={\`p-2 text-left font-mono text-[9px] sm:text-[10px] uppercase transition-all select-none cursor-pointer leading-tight \${
                                dorkType === presetKey
                                    ? 'bg-neon-green/15 text-white font-bold'
                                    : 'text-gray-300 hover:text-neon-green hover:bg-neon-green/5'
                                }\`}
                            >
                                {preset.name}
                            </button>
                            {dorkType === presetKey && (
                                <select 
                                  className="bg-[#050505] text-neon-green text-[9px] outline-none border-t border-neon-green/20 p-1 font-mono uppercase w-full cursor-pointer"
                                  value={subDork}
                                  onChange={(e) => setSubDork(Number(e.target.value))}
                                >
                                    {preset.dorks.map((d, idx) => (
                                        <option key={idx} value={idx}>DORK OPTION {idx + 1}</option>
                                    ))}
                                </select>
                            )}
                          </div>
                      )})}
                    </div></div>`; // Adding extra closing div to match what we replaced

code = code.replace(/\{\[\s*\{\s*id:\s*'index_of'[\s\S]*?\{\s*id:\s*'cloud_credentials'[\s\S]*?\}\)\}\s*<\/div>/, presetsHtml);

const dorkLogicReplacement = `
                      const root = dorkTarget ? 'site:' + dorkTarget + ' ' : '';
                      const presetInfo = dorkPresets[dorkType] || dorkPresets['index_of'];
                      const dorkArr = presetInfo.dorks;
                      const selectedDork = dorkArr[subDork] || dorkArr[0];
                      return root + selectedDork;
`;

// Replace compiler display
code = code.replace(/\{\(\(\) => \{\s*const root = dorkTarget \? \`site:\$\{dorkTarget\}\s\` : '';\s*switch \(dorkType\) \{[\s\S]*?\}\)\(\)\}/, '{(() => {' + dorkLogicReplacement + '\n})()}');

// Replace copy logic
code = code.replace(/const root = dorkTarget \? \`site:\$\{dorkTarget\}\s\` : '';\s*let qr = root;\s*switch \(dorkType\) \{[\s\S]*?copyToClipboard\(qr\);/, dorkLogicReplacement.replace('return root + selectedDork;', 'const qr = root + selectedDork;\ncopyToClipboard(qr);'));

// Replace launch logic
code = code.replace(/\{\(\(\) => \{\s*const root = dorkTarget \? \`site:\$\{dorkTarget\}\s\` : '';\s*let qr = root;\s*switch \(dorkType\) \{[\s\S]*?\}\)\(\)\}/, '{(() => {' + dorkLogicReplacement.replace('return root + selectedDork;', 'const qr = root + selectedDork;\nconst url = `https://www.google.com/search?q=${encodeURIComponent(qr)}`; return (<a href={url} target="_blank" rel="noopener noreferrer" className="border flex flex-col justify-center border-neon-green bg-neon-green/15 hover:bg-neon-green/35 text-neon-green hover:text-white px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest text-center transition-all font-bold active:scale-95 shadow-md shadow-neon-green/5 cursor-pointer w-full leading-tight">LAUNCH SEARCH</a>);') + '\n})()}');

// Inject constants at start of component
code = code.replace('const [dorkTarget, setDorkTarget] = useState(\'\');', presetsData + '\n  const [dorkTarget, setDorkTarget] = useState(\'\');');

fs.writeFileSync('src/components/Terminal.tsx', code);
console.log('updated');
