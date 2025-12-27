"use client"
import { useState, useEffect } from 'react';
import { getHistory, deleteFromHistory, clearHistory, downloadQRCode } from '../utils/qrHelpers';
import { Download, Trash2, Search, Calendar } from 'lucide-react';

export default function QRHistory() {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const data = getHistory();
        setHistory(data);
    };

    const handleDelete = (id) => {
        deleteFromHistory(id);
        loadHistory();
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all history?')) {
            clearHistory();
            loadHistory();
        }
    };

    const handleDownload = (item) => {
        const filename = `qrcode-${item.type}-${item.id}.png`;
        downloadQRCode(item.qrCodeUrl, filename);
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.data.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || item.type === selectedType;
        return matchesSearch && matchesType;
    });

    const types = ['all', 'text', 'url', 'vcard', 'wifi', 'email', 'sms', 'phone'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">QR Code History</h2>
                        <p className="text-secondary text-sm">
                            {history.length} QR code{history.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                    {history.length > 0 && (
                        <button onClick={handleClearAll} className="btn btn-ghost text-error">
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            {history.length > 0 && (
                <div className="card">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search QR codes..."
                                className="input pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {types.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`badge cursor-pointer transition-all ${selectedType === type
                                            ? 'bg-accent-primary text-white'
                                            : 'hover:bg-bg-tertiary'
                                        }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* History Grid */}
            {filteredHistory.length > 0 ? (
                <div className="grid-auto">
                    {filteredHistory.map((item) => (
                        <div key={item.id} className="card group">
                            {/* QR Code Image */}
                            <div className="bg-white p-4 rounded-lg mb-4">
                                <img
                                    src={item.qrCodeUrl}
                                    alt="QR Code"
                                    className="w-full h-auto"
                                />
                            </div>

                            {/* Info */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="badge badge-info">
                                        {item.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-tertiary flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-secondary truncate" title={item.data}>
                                    {item.data}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownload(item)}
                                    className="btn btn-primary flex-1 text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="btn btn-ghost text-error"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    {history.length === 0 ? (
                        <>
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
                            <p className="text-secondary">
                                Generated QR codes will appear here
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                            <p className="text-secondary">
                                Try adjusting your search or filters
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
