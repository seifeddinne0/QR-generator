"use client"
import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, Copy, ExternalLink, Check, X } from 'lucide-react';
import { copyToClipboard, isValidUrl } from '../utils/qrHelpers';

export default function QRScanner() {
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [copied, setCopied] = useState(false);
    const scannerRef = useRef(null);
    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        return () => {
            // Cleanup scanner on unmount
            if (html5QrcodeScannerRef.current) {
                html5QrcodeScannerRef.current.clear();
            }
        };
    }, []);

    const startScanning = () => {
        setScanning(true);
        setScannedData(null);

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
        };

        html5QrcodeScannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            config,
            false
        );

        html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
    };

    const onScanSuccess = (decodedText, decodedResult) => {
        setScannedData(decodedText);
        stopScanning();
    };

    const onScanError = (errorMessage) => {
        // Ignore errors during scanning
    };

    const stopScanning = () => {
        if (html5QrcodeScannerRef.current) {
            html5QrcodeScannerRef.current.clear();
            html5QrcodeScannerRef.current = null;
        }
        setScanning(false);
    };

    const handleCopy = async () => {
        if (scannedData) {
            const success = await copyToClipboard(scannedData);
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    const handleOpenUrl = () => {
        if (scannedData && isValidUrl(scannedData)) {
            window.open(scannedData, '_blank');
        }
    };

    const detectDataType = (data) => {
        if (!data) return 'unknown';
        if (isValidUrl(data)) return 'url';
        if (data.startsWith('BEGIN:VCARD')) return 'vcard';
        if (data.startsWith('WIFI:')) return 'wifi';
        if (data.startsWith('mailto:')) return 'email';
        if (data.startsWith('SMSTO:')) return 'sms';
        if (data.startsWith('tel:')) return 'phone';
        return 'text';
    };

    const dataType = detectDataType(scannedData);

    return (
        <div className="space-y-6">
            <div className="card text-center">
                <div className="mb-6">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-accent-primary" />
                    <h2 className="text-2xl font-bold mb-2">QR Code Scanner</h2>
                    <p className="text-secondary">
                        Scan QR codes using your device camera
                    </p>
                </div>

                {!scanning && !scannedData && (
                    <button onClick={startScanning} className="btn btn-primary">
                        <Camera className="w-5 h-5" />
                        Start Scanning
                    </button>
                )}

                {scanning && (
                    <div>
                        <div id="qr-reader" className="mx-auto max-w-md"></div>
                        <button onClick={stopScanning} className="btn btn-secondary mt-4">
                            <X className="w-5 h-5" />
                            Stop Scanning
                        </button>
                    </div>
                )}

                {scannedData && (
                    <div className="animate-scale-in">
                        <div className="bg-success/10 border border-success/30 rounded-xl p-6 mb-4">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Check className="w-6 h-6 text-success" />
                                <h3 className="text-lg font-semibold text-success">QR Code Scanned!</h3>
                            </div>
                            <div className="badge badge-success mb-4">
                                Type: {dataType.toUpperCase()}
                            </div>
                            <div className="bg-bg-secondary rounded-lg p-4 text-left">
                                <p className="text-sm font-mono break-all">{scannedData}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center flex-wrap">
                            <button onClick={handleCopy} className="btn btn-secondary">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>

                            {dataType === 'url' && (
                                <button onClick={handleOpenUrl} className="btn btn-primary">
                                    <ExternalLink className="w-4 h-4" />
                                    Open URL
                                </button>
                            )}

                            <button onClick={() => setScannedData(null)} className="btn btn-ghost">
                                Scan Another
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-3">How to Use</h3>
                <ul className="space-y-2 text-sm text-secondary">
                    <li className="flex items-start gap-2">
                        <span className="text-accent-primary mt-1">•</span>
                        <span>Click "Start Scanning" to activate your camera</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent-primary mt-1">•</span>
                        <span>Point your camera at a QR code</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent-primary mt-1">•</span>
                        <span>The QR code will be automatically detected and decoded</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent-primary mt-1">•</span>
                        <span>You can copy the content or open URLs directly</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
