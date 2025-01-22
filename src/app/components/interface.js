"use client"
import { useState } from 'react';

export default function Interface() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (text.trim()) {
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="py-4 bg-white px-6 flex flex-col items-center justify-center lg:px-8 shadow-lg rounded-lg max-w-xl mx-auto">
      <div className="text-center top-0 mb-14">
        <h1 className="text-2xl font-bold text-gray-800">QR Code Generator</h1>
        <p className="text-gray-500 mt-2">This is a simple interface to generate QR Codes</p>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-center">
        <form onSubmit={handleGenerate} className="w-full lg:w-1/2">
          <div className="mt-4">
            <label className="text-sm text-gray-600">Enter the text to generate QR Code</label>
            <textarea
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border-2 text-black border-gray-200 p-2 rounded-lg focus:outline-none focus:border-indigo-500 mt-3 w-full"
              rows="3"
            ></textarea>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
            >
              Generate QR Code
            </button>
          </div>
        </form>
        <div className="mt-8 lg:mt-0 lg:ml-6 w-full lg:w-1/2 text-center">
          {qrCodeUrl && (
            <div>
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
              <div className="mt-4">
                <a
                  href={qrCodeUrl} 
                  download
                  target='_blank'
                  className="w-full font-light bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg text-center block"
                >
                  Download QR Code
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
