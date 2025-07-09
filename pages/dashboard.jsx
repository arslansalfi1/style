import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (!storedUser) {
      window.location.href = '/login.html';
    } else {
      setUsername(storedUser);
      fetchKeys();
    }
  }, []);

  const fetchKeys = async () => {
    const res = await fetch('/api/keys/list');
    const data = await res.json();
    if (data.status) {
      setKeys(data.keys.filter(k => k.createdBy === username));
    }
  };

  const generateKey = async () => {
    const res = await fetch('/api/keys/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        expiry_time: 24,
        device_limit: 1
      })
    });

    const data = await res.json();
    if (data.status) {
      alert("Key Generated: " + data.key.key);
      fetchKeys();
    } else {
      alert(data.message);
    }
  };

  const handleAction = async (id, action) => {
    const res = await fetch(`/api/keys/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    if (data.status) {
      alert(`${action} successful`);
      fetchKeys();
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: '#0f172a', color: 'white' }}>
      <h2>Welcome {username} - Impossible Panel</h2>

      <button onClick={generateKey} style={{ marginBottom: '20px', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px' }}>
        Generate New Key
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b' }}>
        <thead>
          <tr>
            <th style={th}>Key</th>
            <th style={th}>Created</th>
            <th style={th}>Expiry (hr)</th>
            <th style={th}>Devices</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '15px' }}>No keys found.</td>
            </tr>
          )}
          {keys.map((key) => (
            <tr key={key.id}>
              <td style={td}>{key.key}</td>
              <td style={td}>{new Date(key.createdAt).toLocaleString()}</td>
              <td style={td}>{key.durationHours === 0 ? 'Unlimited' : key.durationHours}</td>
              <td style={td}>{key.connectedDevices.length}</td>
              <td style={td}>{key.status}</td>
              <td style={td}>
                {key.status === 'active' && (
                  <button style={{ ...btn, background: '#ef4444' }} onClick={() => handleAction(key.id, 'block')}>
                    Block
                  </button>
                )}
                {key.status === 'blocked' && (
                  <button style={{ ...btn, background: '#22c55e' }} onClick={() => handleAction(key.id, 'unblock')}>
                    Unblock
                  </button>
                )}
                <button style={{ ...btn, background: '#6b7280' }} onClick={() => handleAction(key.id, 'delete')}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: '10px',
  background: '#334155',
  border: '1px solid #334155'
};

const td = {
  padding: '10px',
  border: '1px solid #334155',
  textAlign: 'center'
};

const btn = {
  marginRight: '5px',
  padding: '5px 10px',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer'
};
