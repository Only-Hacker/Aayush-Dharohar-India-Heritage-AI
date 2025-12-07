import React, { useState, useRef } from 'react';
import { identifyHeritageImage } from '../services/gemini';
import { IdentificationResult } from '../types';

const ImageIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      // Extract base64 data and mime type
      const response = await fetch(image);
      const blob = await response.blob();
      const base64Data = image.split(',')[1];
      
      const analysis = await identifyHeritageImage(base64Data, blob.type);
      setResult(analysis);
    } catch (err) {
      setError("Failed to identify the image. The AI might be having trouble seeing it clearly. Try another photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-4xl font-serif font-bold text-royalMaroon mb-4">Dharohar Vision</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Point your camera at any monument, temple, or artifact. 
          Let our AI unravel its history and secrets.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center justify-center">
            
            {/* Image Preview Area */}
            <div 
              onClick={!image ? triggerFileInput : undefined}
              className={`relative w-full max-w-lg aspect-video rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 group overflow-hidden ${
                image ? 'border-orange-500 bg-gray-50' : 'border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50 cursor-pointer'
              }`}
            >
               {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center p-8 text-center">
                   <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-4xl text-orange-600 group-hover:scale-110 transition-transform shadow-sm">📷</div>
                   <p className="text-gray-900 font-bold text-lg">Upload Photo</p>
                   <p className="text-gray-500 text-sm mt-1">Drag & drop or click to browse</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-wrap gap-4 w-full justify-center">
              <button 
                onClick={triggerFileInput}
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {image ? 'Change Photo' : 'Select Photo'}
              </button>
              {image && (
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`px-8 py-3 rounded-full text-white font-bold shadow-lg transition-all flex items-center gap-2 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:shadow-orange-200 hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning History...
                    </>
                  ) : 'Identify Monument'}
                </button>
              )}
            </div>
            
            {error && <p className="mt-4 text-red-600 bg-red-50 px-6 py-3 rounded-xl border border-red-100">{error}</p>}

          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="border-t border-gray-100 bg-gradient-to-b from-orange-50/50 to-white p-8 md:p-12 animate-slide-up">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                 <div>
                    <h3 className="text-4xl font-serif font-bold text-gray-900 mb-2">{result.name}</h3>
                    <p className="text-orange-700 font-medium flex items-center gap-2 text-lg">
                      <span className="bg-orange-100 p-1 rounded">📍</span> {result.location}
                    </p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                    <span className="text-4xl">🏛️</span>
                 </div>
              </div>
              
              <div className="grid gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Historical Significance</h4>
                  <p className="text-gray-700 leading-relaxed text-lg font-light">{result.historicalSignificance}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Cultural Insights</h4>
                  <ul className="space-y-4">
                    {result.culturalFacts.map((fact, index) => (
                      <li key={index} className="flex gap-4 text-gray-700 items-start">
                        <span className="text-blue-500 font-bold text-xl mt-0.5">•</span>
                        <span className="leading-relaxed">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageIdentifier;