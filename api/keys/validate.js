import { getKeyByLicense } from '../../lib/db'; // فرض کریں یہاں ڈیٹا بیس سے کلید حاصل کرنے کا فنکشن ہے

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ status: false, reason: 'Invalid request method' });
  }

  const license = req.method === 'POST' ? req.body.license : req.query.license;
  const deviceId = req.method === 'POST' ? req.body.deviceId : req.query.deviceId;

  if (!license || !deviceId) {
    return res.status(400).json({ status: false, reason: 'Missing license or deviceId' });
  }

  // ڈیٹا بیس سے کی تفصیل حاصل کریں
  const keyData = await getKeyByLicense(license);

  if (!keyData) {
    return res.status(404).json({ status: false, reason: 'License not found' });
  }

  if (keyData.blocked) {
    return res.status(403).json({ status: false, reason: 'License is blocked' });
  }

  // device limit چیک کریں
  if (keyData.device_limit && keyData.devices) {
    const devices = keyData.devices; // فرض کریں یہ ارے ہے جس میں رجسٹرڈ ڈیوائس IDs ہیں
    if (!devices.includes(deviceId)) {
      if (devices.length >= keyData.device_limit) {
        return res.status(403).json({ status: false, reason: 'Device limit exceeded' });
      } else {
        // نیا ڈیوائس شامل کریں (یہاں آپ ڈیٹا بیس میں اپڈیٹ کا عمل کریں)
        devices.push(deviceId);
        await updateKeyDevices(license, devices); // فرض کریں یہ فنکشن موجود ہے
      }
    }
  }

  // اگر سب ٹھیک ہے تو کامیابی کا پیغام بھیجیں
  return res.json({
    status: true,
    license: license,
    device_limit: keyData.device_limit,
    devices: keyData.devices,
    expires: keyData.expires, // میعاد ختم ہونے کی تاریخ
  });
}
