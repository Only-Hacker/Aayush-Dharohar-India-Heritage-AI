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
      setError("Failed to identify the image. Please try again with a clearer picture.");
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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Dharohar Vision AI</h2>
        <p className="text-gray-600">
          Upload a photo of any Indian monument, art form, or cultural artifact. 
          Our AI will identify it and tell you its story.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="flex flex-col items-center justify-center">
            
            {/* Image Preview Area */}
            <div 
              className={`relative w-full max-w-md aspect-square rounded-xl flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 ${
                image ? 'border-orange-500 bg-gray-50' : 'border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50'
              }`}
            >
               {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div onClick={triggerFileInput} className="cursor-pointer flex flex-col items-center p-8 text-center">
                   <span className="text-6xl mb-4">📸</span>
                   <p className="text-gray-500 font-medium">Click to upload or capture</p>
                   <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, WEBP</p>
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
            <div className="mt-8 flex gap-4">
              <button 
                onClick={triggerFileInput}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {image ? 'Change Image' : 'Select Image'}
              </button>
              {image && (
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-full text-white font-medium shadow-lg transition-all ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:shadow-orange-200 hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : 'Identify Heritage'}
                </button>
              )}
            </div>
            
            {error && <p className="mt-4 text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="border-t border-gray-100 bg-orange-50/30 p-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                 <div>
                    <h3 className="text-3xl font-serif font-bold text-gray-900">{result.name}</h3>
                    <p className="text-orange-700 font-medium flex items-center gap-1 mt-1">
                      📍 {result.location}
                    </p>
                 </div>
                 <div className="bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-2xl">🏛️</span>
                 </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Historical Significance</h4>
                  <p className="text-gray-700 leading-relaxed">{result.historicalSignificance}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Did You Know?</h4>
                  <ul className="space-y-3">
                    {result.culturalFacts.map((fact, index) => (
                      <li key={index} className="flex gap-3 text-gray-700">
                        <span className="text-orange-500 flex-shrink-0">•</span>
                        <span>{fact}</span>
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