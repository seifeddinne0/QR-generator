"use client"
import { useState } from 'react';
import { formatQRData } from '../utils/qrHelpers';
import { Link, Mail, Wifi, MessageSquare, Phone, User, FileText } from 'lucide-react';

export default function QRTypes({ onDataChange }) {
    const [activeType, setActiveType] = useState('text');
    const [formData, setFormData] = useState({});

    const handleTypeChange = (type) => {
        setActiveType(type);
        setFormData({});
        onDataChange('', type);
    };

    const handleInputChange = (field, value) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        const formatted = formatQRData(activeType, newData);
        onDataChange(formatted, activeType);
    };

    const types = [
        { id: 'text', label: 'Text', icon: FileText },
        { id: 'url', label: 'URL', icon: Link },
        { id: 'vcard', label: 'Contact', icon: User },
        { id: 'wifi', label: 'WiFi', icon: Wifi },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'sms', label: 'SMS', icon: MessageSquare },
        { id: 'phone', label: 'Phone', icon: Phone },
    ];

    return (
        <div className="space-y-6">
            {/* Type Tabs */}
            <div className="tabs">
                {types.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => handleTypeChange(id)}
                        className={`tab ${activeType === id ? 'active' : ''}`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Forms */}
            <div className="card animate-fade-in">
                {activeType === 'text' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Text Content</label>
                        <textarea
                            value={formData.text || ''}
                            onChange={(e) => handleInputChange('text', e.target.value)}
                            placeholder="Enter any text..."
                            className="input"
                            rows="4"
                        />
                    </div>
                )}

                {activeType === 'url' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Website URL</label>
                        <input
                            type="url"
                            value={formData.text || ''}
                            onChange={(e) => handleInputChange('text', e.target.value)}
                            placeholder="https://example.com"
                            className="input"
                        />
                    </div>
                )}

                {activeType === 'vcard' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={formData.fullName || ''}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="SEIF EDDINE BEN ACHOUR"
                                className="input"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="+216 95 273 413"
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="seifeddine@example.com"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Organization</label>
                            <input
                                type="text"
                                value={formData.organization || ''}
                                onChange={(e) => handleInputChange('organization', e.target.value)}
                                placeholder="Company Name"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Website</label>
                            <input
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                placeholder="https://example.com"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <input
                                type="text"
                                value={formData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="-tunisia-nabeul-bouargoub"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Note</label>
                            <textarea
                                value={formData.note || ''}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                placeholder="Additional information..."
                                className="input"
                                rows="2"
                            />
                        </div>
                    </div>
                )}

                {activeType === 'wifi' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Network Name (SSID) *</label>
                            <input
                                type="text"
                                value={formData.ssid || ''}
                                onChange={(e) => handleInputChange('ssid', e.target.value)}
                                placeholder="MyWiFiNetwork"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Password *</label>
                            <input
                                type="text"
                                value={formData.password || ''}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="WiFi password"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Encryption Type</label>
                            <select
                                value={formData.encryption || 'WPA'}
                                onChange={(e) => handleInputChange('encryption', e.target.value)}
                                className="input"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="hidden"
                                checked={formData.hidden || false}
                                onChange={(e) => handleInputChange('hidden', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="hidden" className="text-sm">Hidden Network</label>
                        </div>
                    </div>
                )}

                {activeType === 'email' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address *</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="recipient@example.com"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject || ''}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                placeholder="Email subject"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <textarea
                                value={formData.body || ''}
                                onChange={(e) => handleInputChange('body', e.target.value)}
                                placeholder="Email message..."
                                className="input"
                                rows="4"
                            />
                        </div>
                    </div>
                )}

                {activeType === 'sms' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+1234567890"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <textarea
                                value={formData.message || ''}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder="SMS message..."
                                className="input"
                                rows="4"
                            />
                        </div>
                    </div>
                )}

                {activeType === 'phone' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1234567890"
                            className="input"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
