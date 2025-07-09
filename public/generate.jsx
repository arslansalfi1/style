import { useState } from 'react';
import { useRouter } from 'next/router';

export default function GeneratePage() {
  const [expiryOption, setExpiryOption] = useState('4h');
  const [customExpiry, setCustomExpiry] = useState('');
  const [key, setKey] = useState('');
  const [deviceLimit, setDeviceLimit] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const presetOptions = [
    { label: '4 Hours', value: '4h' },
    { label: '8 Hours', value: '8h' },
    { label: '1 Day', value: '1d' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '60 Days', value: '60d' },
    { label: 'Custom', value: 'custom' },
  ];

  const generateRandomKey = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let rand = '';
    for (let i = 0; i < 16; i++) {
      rand += charset[Math.floor(Math.random() * charset.length)];
    }
    setKey(rand);
  };

  const calculateExpiryHours = () => {
    switch (expiryOption) {
      case '4h': return 4;
      case '8h': return 8;
      case '1d': return 24;
      case '7d': return 168;
      case '30d': return 720;
      case '60d': return 1440;
      case 'custom': return parseInt(customExpiry) || 0;
      default: return 0;
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const expiry_time = calculateExpiryHours();

    const res = await fetch('/api/keys/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, expiry_time, device_limit: deviceLimit }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.status) {
      alert('Key generated successfully!');
      router.push('/dashboard');
    } else {
      alert(data.message || 'Failed to generate key.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20, background: '#1e293b', borderRadius: 12, color: 'white' }}>
      <h2>🔑 Generate License Key</h2>

      <label>⏰ Expiry Time:</label>
      <select
        value={expiryOption}
        onChange={(e) => setExpiryOption(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      >
        {presetOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {expiryOption === 'custom' && (
        <input
          type="number"
          placeholder="Custom expiry in hours"
          value={customExpiry}
          onChange={(e) => setCustomExpiry(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
      )}

      <label>🔐 License Key:</label>
      <input
        type="text"
        placeholder="Enter or generate key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button onClick={generateRandomKey} style={{ marginBottom: 20, padding: 8 }}>🎲 Generate Random Key</button>

      <label>📱 Device Limit:</label>
      <input
        type="number"
        placeholder="e.g. 1, 2, 5"
        value={deviceLimit}
        onChange={(e) => setDeviceLimit(parseInt(e.target.value))}
        style={{ width: '100%', padding: 8, marginBottom: 20 }}
      />

      <button onClick={handleGenerate} style={{ padding: 10, width: '100%', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}>
        {loading ? 'Generating...' : '🚀 Generate Key'}
      </button>
    </div>
  );
}