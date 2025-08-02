
'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockFileConversion } from "@/lib/mockApi"; 
import Link from 'next/link';

export default function PDFToJPGPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    quality: 'high',
    format: 'jpg',
    pages: 'all'
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
    setDownloadUrl('');
    setProgress(0);
    setStatus('');
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError('');
    
    try {
      const result = await mockFileConversion(
        selectedFile,
        "jpg",
        (progress: number, status: string) => {
          setProgress(progress);
          setStatus(status);
        }
      );

      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        setFileName(result.fileName || '');
      } else {
        setError(result.error || 'Conversion failed');
      }
    } catch (err) {
      setError('An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setDownloadUrl('');
    setProgress(0);
    setStatus('');
    setError('');
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-pink-300/10 to-purple-300/10 rounded-full blur-2xl"></div>
      </div>

      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-12">
          <Link href="/" className="hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
            <i className="ri-home-line mr-1"></i>Home
          </Link>
          <i className="ri-arrow-right-s-line text-gray-300"></i>
          <span className="text-gray-700 font-medium">PDF to JPG</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <i className="ri-image-2-line text-white text-5xl"></i>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <i className="ri-star-fill text-yellow-800 text-sm"></i>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6 leading-tight">
            PDF to JPG
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your PDF documents into stunning high-quality JPG images. 
            <span className="text-purple-600 font-semibold"> Extract, convert, and download </span>
            with professional results.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mt-10">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">5M+</div>
              <div className="text-sm text-gray-500">Converted</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">2s</div>
              <div className="text-sm text-gray-500">Average</div>
            </div>
          </div>
        </div>

        {/* Main Conversion Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-16 max-w-4xl mx-auto">
          {!selectedFile && !downloadUrl && (
            <div className="p-12 md:p-16">
              {/* Upload Area */}
              <div className="mb-12">
                <FileUpload
                  acceptedTypes={['.pdf']}
                  onFileSelect={handleFileSelect}
                  maxSize={50}
                  placeholder="Drop your PDF here for instant conversion"
                  icon="ri-file-pdf-2-line"
                />
              </div>

              {/* Conversion Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Quality Selector */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3">
                      <i className="ri-hd-line text-white"></i>
                    </div>
                    <h3 className="font-bold text-gray-800">Image Quality</h3>
                  </div>
                  <div className="space-y-2">
                    {['high', 'medium', 'low'].map((quality) => (
                      <label key={quality} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="quality"
                          value={quality}
                          checked={conversionOptions.quality === quality}
                          onChange={(e) => setConversionOptions(prev => ({...prev, quality: e.target.value}))}
                          className="mr-3 text-purple-600"
                        />
                        <span className="capitalize text-gray-700 font-medium">{quality} Quality</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Format Selector */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-pink-500 rounded-full mr-3">
                      <i className="ri-image-line text-white"></i>
                    </div>
                    <h3 className="font-bold text-gray-800">Output Format</h3>
                  </div>
                  <div className="space-y-2">
                    {[{value: 'jpg', label: 'JPG'}, {value: 'png', label: 'PNG'}].map((format) => (
                      <label key={format.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value={format.value}
                          checked={conversionOptions.format === format.value}
                          onChange={(e) => setConversionOptions(prev => ({...prev, format: e.target.value}))}
                          className="mr-3 text-pink-600"
                        />
                        <span className="text-gray-700 font-medium">{format.label} Format</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pages Selector */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full mr-3">
                      <i className="ri-file-list-3-line text-white"></i>
                    </div>
                    <h3 className="font-bold text-gray-800">Pages</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="pages"
                        value="all"
                        checked={conversionOptions.pages === 'all'}
                        onChange={(e) => setConversionOptions(prev => ({...prev, pages: e.target.value}))}
                        className="mr-3 text-red-600"
                      />
                      <span className="text-gray-700 font-medium">All Pages</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="pages"
                        value="first"
                        checked={conversionOptions.pages === 'first'}
                        onChange={(e) => setConversionOptions(prev => ({...prev, pages: e.target.value}))}
                        className="mr-3 text-red-600"
                      />
                      <span className="text-gray-700 font-medium">First Page Only</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: 'ri-flashlight-line', title: 'Lightning Fast', desc: 'Instant conversion', color: 'yellow' },
                  { icon: 'ri-shield-check-line', title: 'Secure', desc: 'Privacy protected', color: 'green' },
                  { icon: 'ri-download-cloud-2-line', title: 'Easy Download', desc: 'One-click save', color: 'blue' },
                  { icon: 'ri-smartphone-line', title: 'Mobile Ready', desc: 'Works everywhere', color: 'purple' }
                ].map((feature, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 flex items-center justify-center bg-${feature.color}-100 rounded-full mx-auto mb-3`}>
                      <i className={`${feature.icon} text-${feature.color}-600 text-xl`}></i>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFile && !downloadUrl && (
            <div className="p-12 md:p-16">
              {/* File Info */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl mb-8 border border-purple-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                    <i className="ri-file-pdf-2-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{selectedFile.name}</h3>
                    <p className="text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        {conversionOptions.quality.toUpperCase()} Quality
                      </span>
                      <span className="text-sm text-pink-600 bg-pink-100 px-2 py-1 rounded-full ml-2">
                        {conversionOptions.format.toUpperCase()} Format
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetConverter}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              {/* Progress */}
              {isConverting && (
                <div className="mb-8">
                  <ProgressBar progress={progress} status={status} />
                </div>
              )}

              {/* Convert Button */}
              {!isConverting && (
                <div className="text-center">
                  <button
                    onClick={handleConvert}
                    className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap cursor-pointer overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <i className="ri-magic-line mr-3 text-2xl"></i>
                      Convert to {conversionOptions.format.toUpperCase()}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <p className="text-gray-500 mt-4">
                    <i className="ri-shield-check-line mr-1"></i>
                    Your files are processed securely and deleted automatically
                  </p>
                </div>
              )}
            </div>
          )}

          {downloadUrl && (
            <div className="p-12 md:p-16 text-center">
              <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-8 shadow-2xl">
                <i className="ri-check-line text-white text-6xl"></i>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Conversion Complete!</h2>
              <p className="text-xl text-gray-600 mb-8">Your PDF has been successfully converted to JPG images.</p>
              
              {/* Download Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border border-green-200">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mr-4 shadow-lg">
                    <i className="ri-folder-zip-line text-white text-2xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">images.zip</h3>
                    <p className="text-gray-600">Contains all converted JPG images</p>
                  </div>
                </div>
                
                <a
                  href={downloadUrl}
                  download={fileName}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-download-2-line mr-3 text-xl"></i>
                  Download ZIP File
                  <i className="ri-external-link-line ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetConverter}
                  className="flex items-center justify-center px-8 py-4 bg-white border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Convert Another File
                </button>
              </div>
              
              <p className="text-gray-500 mt-6 text-sm">
                <i className="ri-time-line mr-1"></i>
                Files are automatically deleted after 24 hours for your privacy
              </p>
            </div>
          )}

          {error && (
            <div className="p-12 md:p-16">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
                    <i className="ri-error-warning-line text-red-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Conversion Failed</h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <button
                    onClick={resetConverter}
                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <i className="ri-image-2-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">High-Quality Output</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Crystal clear images
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Preserves original quality
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Professional results
              </li>
            </ul>
          </div>
          
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <i className="ri-stack-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Batch Processing</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Convert all pages at once
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Organized ZIP download
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Time-saving process
              </li>
            </ul>
          </div>
          
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
              <i className="ri-shield-check-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Private</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                Files auto-deleted after 24h
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                No data stored permanently
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-3"></i>
                SSL encrypted processing
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
