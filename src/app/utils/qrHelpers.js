import QRCode from 'qrcode';

// Format data for different QR code types
export const formatQRData = (type, data) => {
  switch (type) {
    case 'text':
    case 'url':
      return data.text || '';
    
    case 'vcard':
      return `BEGIN:VCARD
VERSION:3.0
FN:${data.fullName || ''}
TEL:${data.phone || ''}
EMAIL:${data.email || ''}
ADR:;;${data.address || ''};;;;
ORG:${data.organization || ''}
URL:${data.website || ''}
NOTE:${data.note || ''}
END:VCARD`;
    
    case 'wifi':
      const encryption = data.encryption || 'WPA';
      return `WIFI:T:${encryption};S:${data.ssid || ''};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};;`;
    
    case 'email':
      return `mailto:${data.email || ''}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`;
    
    case 'sms':
      return `SMSTO:${data.phone || ''}:${data.message || ''}`;
    
    case 'phone':
      return `tel:${data.phone || ''}`;
    
    default:
      return '';
  }
};

// Generate QR code with custom options
export const generateQRCode = async (text, options = {}) => {
  const {
    size = 300,
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    errorCorrectionLevel = 'M',
    margin = 4,
  } = options;

  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel,
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Generate QR code with logo
export const generateQRCodeWithLogo = async (text, logoDataUrl, options = {}) => {
  const {
    size = 300,
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    errorCorrectionLevel = 'H', // High error correction for logo embedding
    margin = 4,
    logoSize = 60,
  } = options;

  try {
    // Generate base QR code
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Generate QR code to canvas
    await QRCode.toCanvas(canvas, text, {
      width: size,
      margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel,
    });

    // Add logo in center
    if (logoDataUrl) {
      const logo = new Image();
      logo.src = logoDataUrl;
      await new Promise((resolve) => {
        logo.onload = resolve;
      });

      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;

      // Draw white background circle for logo
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, logoSize / 2 + 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw logo
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    }

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating QR code with logo:', error);
    throw error;
  }
};

// Download QR code
export const downloadQRCode = (dataUrl, filename = 'qrcode.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Convert data URL to SVG (simplified)
export const generateQRCodeSVG = async (text, options = {}) => {
  const {
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    errorCorrectionLevel = 'M',
    margin = 4,
  } = options;

  try {
    const svgString = await QRCode.toString(text, {
      type: 'svg',
      margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel,
    });
    return svgString;
  } catch (error) {
    console.error('Error generating SVG QR code:', error);
    throw error;
  }
};

// Local storage helpers for history
const HISTORY_KEY = 'qr_code_history';
const MAX_HISTORY = 50;

export const saveToHistory = (qrData) => {
  try {
    const history = getHistory();
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...qrData,
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newEntry;
  } catch (error) {
    console.error('Error saving to history:', error);
    return null;
  }
};

export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const deleteFromHistory = (id) => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting from history:', error);
    return false;
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// Validate URL
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Read file as data URL
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
