"use client"
import { useState, useEffect } from 'react';
import { Download, Copy, Upload, X, Check } from 'lucide-react';
import {
    generateQRCode,
    generateQRCodeWithLogo,
    downloadQRCode,
    copyToClipboard,
    saveToHistory,
    readFileAsDataURL
} from '../utils/qrHelpers';

export default function QRGenerator({ data, type }) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Customization options
    const [size, setSize] = useState(300);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [errorCorrection, setErrorCorrection] = useState('M');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (data) {
            generateQR();
        }
    }, [data, size, fgColor, bgColor, errorCorrection, logo]);

    const generateQR = async () => {
        if (!data) return;

        setLoading(true);
        try {
            let qrUrl;
            if (logo) {
                qrUrl = await generateQRCodeWithLogo(data, logo, {
                    size,
                    fgColor,
                    bgColor,
                    errorCorrectionLevel: errorCorrection,
                    logoSize: size * 0.2,
                });
            } else {
                qrUrl = await generateQRCode(data, {
                    size,
                    fgColor,
                    bgColor,
                    errorCorrectionLevel: errorCorrection,
                });
            }
            setQrCodeUrl(qrUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (qrCodeUrl) {
            const filename = `qrcode-${type}-${Date.now()}.png`;
            downloadQRCode(qrCodeUrl, filename);

            // Save to history
            saveToHistory({
                type,
                data,
                qrCodeUrl,
                options: { size, fgColor, bgColor, errorCorrection },
            });
        }
    };

    const handleCopy = async () => {
        if (data) {
            const success = await copyToClipboard(data);
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const dataUrl = await readFileAsDataURL(file);
                setLogo(dataUrl);
                setLogoPreview(dataUrl);
                setErrorCorrection('H'); // High error correction for logo
            } catch (error) {
                console.error('Error uploading logo:', error);
            }
        }
    };

    const removeLogo = () => {
        setLogo(null);
        setLogoPreview(null);
        setErrorCorrection('M');
    };

    if (!data) {
        return (
            <div className="card text-center py-12">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-secondary">Enter data to generate QR code</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* QR Code Preview */}
            <div className="card text-center">
                <h3 className="text-lg font-semibold mb-4">QR Code Preview</h3>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : qrCodeUrl ? (
                    <div className="inline-block p-4 bg-white rounded-xl">
                        <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="mx-auto"
                            style={{ width: size, height: size }}
                        />
                    </div>
                ) : null}

                {/* Action Buttons */}
                {qrCodeUrl && (
                    <div className="flex gap-3 justify-center mt-6">
                        <button onClick={handleDownload} className="btn btn-primary">
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button onClick={handleCopy} className="btn btn-secondary">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Data'}
                        </button>
                    </div>
                )}
            </div>

            {/* Customization Options */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Customize QR Code</h3>

                <div className="space-y-4">
                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Size: {size}px
                        </label>
                        <input
                            type="range"
                            min="150"
                            max="1000"
                            step="50"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                        />
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Foreground Color
                            </label>
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Background Color
                            </label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Error Correction */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Error Correction Level
                        </label>
                        <select
                            value={errorCorrection}
                            onChange={(e) => setErrorCorrection(e.target.value)}
                            className="input"
                            disabled={logo !== null}
                        >
                            <option value="L">Low (7%)</option>
                            <option value="M">Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                        </select>
                        {logo && (
                            <p className="text-xs text-secondary mt-1">
                                High error correction required for logo
                            </p>
                        )}
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Add Logo (Optional)
                        </label>
                        {logoPreview ? (
                            <div className="flex items-center gap-3">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-12 h-12 object-cover rounded-lg border-2 border-border-color"
                                />
                                <button onClick={removeLogo} className="btn btn-ghost text-error">
                                    <X className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <label className="btn btn-secondary cursor-pointer">
                                <Upload className="w-4 h-4" />
                                Upload Logo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
