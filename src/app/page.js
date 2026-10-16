"use client"
import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import QRTypes from './components/QRTypes';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import VantaNet from './components/VantaNet';
import { QrCode, ScanLine, Palette, Image, Layers } from 'lucide-react';

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
  ];

  return (
    <div className="min-h-screen app-shell">
      <VantaNet />
      {/* Header */}
      <header className="site-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="brand-mark p-3 rounded-xl">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-accent-primary">QR Master</h1>
                <p className="text-[11px] sm:text-xs text-secondary">Professional QR Code Suite</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Navigation Tabs */}
        <div className="mb-8 animate-fade-in">
          <div className="tabs w-full max-w-md mx-auto flex-wrap sm:flex-nowrap">
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

        </div>

        {activeTab === 'generate' && (
          <section className="feature-strip mt-10" aria-labelledby="features-title">
            <div className="feature-strip-heading">
              <span className="feature-kicker">Built in</span>
              <h2 id="features-title">Everything you need to make a better QR code</h2>
            </div>
            <div className="feature-list">
              <div className="feature-item">
                <Palette className="feature-icon" aria-hidden="true" />
                <div>
                  <h3>Full customization</h3>
                  <p>Adjust size, colors, and error correction.</p>
                </div>
              </div>
              <div className="feature-item">
                <Image className="feature-icon" aria-hidden="true" />
                <div>
                  <h3>Logo embedding</h3>
                  <p>Add a recognizable mark to your code.</p>
                </div>
              </div>
              <div className="feature-item">
                <Layers className="feature-icon" aria-hidden="true" />
                <div>
                  <h3>Multiple formats</h3>
                  <p>Create WiFi, contact, email, and more.</p>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-secondary text-sm">
        <p>Made by SEIF EDDINE BEN ACHOUR • 2026 </p>
      </footer>
    </div>
  );
}
