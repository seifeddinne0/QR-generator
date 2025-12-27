"use client"
import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import QRTypes from './components/QRTypes';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import QRHistory from './components/QRHistory';
import { QrCode, ScanLine, History, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('generate');
  const [qrData, setQrData] = useState('');
  const [qrType, setQrType] = useState('text');

  const handleDataChange = (data, type) => {
    setQrData(data);
    setQrType(type);
  };

  const mainTabs = [
    { id: 'generate', label: 'Generate', icon: QrCode },
    { id: 'scan', label: 'Scan', icon: ScanLine },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-accent-primary to-accent-secondary p-3 rounded-xl shadow-glow">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">QR Master</h1>
                <p className="text-xs text-secondary">Professional QR Code Suite</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Navigation Tabs */}
        <div className="mb-8 animate-fade-in">
          <div className="tabs max-w-md mx-auto">
            {mainTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`tab ${activeTab === id ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-scale-in">
          {activeTab === 'generate' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Input */}
              <div>
                <QRTypes onDataChange={handleDataChange} />
              </div>

              {/* Right Column - Preview & Customization */}
              <div className="lg:sticky lg:top-24 h-fit">
                <QRGenerator data={qrData} type={qrType} />
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="max-w-2xl mx-auto">
              <QRScanner />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <QRHistory />
            </div>
          )}
        </div>

        {/* Features Banner */}
        {activeTab === 'generate' && (
          <div className="mt-12 glass rounded-2xl p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-accent-primary" />
              <h2 className="text-2xl font-bold">Premium Features</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-semibold mb-2">Full Customization</h3>
                <p className="text-sm text-secondary">
                  Customize colors, size, and error correction levels
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🖼️</div>
                <h3 className="font-semibold mb-2">Logo Embedding</h3>
                <p className="text-sm text-secondary">
                  Add your brand logo to QR codes
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-semibold mb-2">Multiple Types</h3>
                <p className="text-sm text-secondary">
                  Generate QR codes for WiFi, vCard, Email, and more
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-secondary text-sm">
        <p>Made with ❤️ by SEIF EDDINE BEN ACHOUR • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
