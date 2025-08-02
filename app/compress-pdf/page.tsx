'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockFileCompress } from '@/lib/mockApi';
import Link from 'next/link';

export default function CompressPDFPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
    setDownloadUrl('');
    setProgress(0);
    setStatus('');
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError('');
    
    try {
      const result = await mockFileCompress(
        selectedFile,
        (progress, status) => {
          setProgress(progress);
          setStatus(status);
        }
      );

      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        setFileName(result.fileName || '');
      } else {
        setError(result.error || 'Compression failed');
      }
    } catch (err) {
      setError('An error occurred during compression');
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

  const getCompressionInfo = (level: string) => {
    switch (level) {
      case 'low':
        return { reduction: '30-50%', quality: 'Highest quality, smaller reduction' };
      case 'medium':
        return { reduction: '50-70%', quality: 'Good quality, balanced compression' };
      case 'high':
        return { reduction: '70-90%', quality: 'Maximum compression, good quality' };
      default:
        return { reduction: '50-70%', quality: 'Good quality, balanced compression' };
    }
  };

  const compressionInfo = getCompressionInfo(compressionLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors cursor-pointer">Home</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-gray-900 font-medium">Compress PDF</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl mx-auto mb-6 shadow-lg">
            <i className="ri-compress-line text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF Compressor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reduce PDF file size without compromising quality. Perfect for email attachments, web uploads, and storage optimization.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
          {!selectedFile && !downloadUrl && (
            <div className="p-8 md:p-12">
              <FileUpload
                acceptedTypes={['.pdf']}
                onFileSelect={handleFileSelect}
                maxSize={100}
                placeholder="Drop your PDF file here or click to browse"
                icon="ri-file-pdf-line"
              />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-full mx-auto mb-3">
                    <i className="ri-file-reduce-line text-teal-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Compression</h3>
                  <p className="text-sm text-gray-600">Advanced algorithms maintain quality while reducing size</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-3">
                    <i className="ri-mail-line text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Ready</h3>
                  <p className="text-sm text-gray-600">Perfect size for email attachments and sharing</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-3">
                    <i className="ri-save-line text-green-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Save Storage</h3>
                  <p className="text-sm text-gray-600">Reduce storage costs and improve upload speeds</p>
                </div>
              </div>
            </div>
          )}

          {selectedFile && !downloadUrl && (
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-lg">
                    <i className="ri-file-pdf-line text-red-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={resetConverter}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              {/* Compression Level Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Compression Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['low', 'medium', 'high'].map((level) => {
                    const info = getCompressionInfo(level);
                    return (
                      <button
                        key={level}
                        onClick={() => setCompressionLevel(level)}
                        className={`p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                          compressionLevel === level
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold capitalize text-gray-900">{level} Compression</span>
                          {compressionLevel === level && (
                            <i className="ri-check-line text-teal-600"></i>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{info.reduction} size reduction</p>
                        <p className="text-xs text-gray-500">{info.quality}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <i className="ri-arrow-right-line text-2xl text-gray-400"></i>
                  <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium">
                    ~{((selectedFile.size / 1024 / 1024) * (1 - parseInt(compressionInfo.reduction) / 100)).toFixed(1)} MB
                  </span>
                </div>
              </div>

              {isConverting && (
                <div className="mb-8">
                  <ProgressBar progress={progress} status={status} />
                </div>
              )}

              {!isConverting && (
                <button
                  onClick={handleCompress}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                >
                  Compress PDF
                </button>
              )}
            </div>
          )}

          {downloadUrl && (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-6">
                <i className="ri-check-line text-green-600 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Compression Complete!</h3>
              <p className="text-gray-600 mb-4">Your PDF has been successfully compressed.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Original Size</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <i className="ri-arrow-right-line text-gray-400"></i>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Compressed Size</p>
                    <p className="text-lg font-semibold text-teal-600">
                      {((selectedFile!.size / 1024 / 1024) * 0.4).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Saved</p>
                    <p className="text-lg font-semibold text-green-600">60%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a
                  href={downloadUrl}
                  download={fileName}
                  className="flex items-center space-x-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-download-line"></i>
                  <span>Download Compressed PDF</span>
                </a>
                <button
                  onClick={resetConverter}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-refresh-line"></i>
                  <span>Compress Another File</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                <i className="ri-time-line mr-1"></i>
                File will be automatically deleted in 24 hours
              </div>
            </div>
          )}

          {error && (
            <div className="p-8 md:p-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mr-3">
                    <i className="ri-error-warning-line text-red-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Compression Failed</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
                <button
                  onClick={resetConverter}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Compression Benefits:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                Faster email attachments
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                Reduced storage costs
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                Quicker file transfers
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Quality Maintained:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-blue-500 mr-2"></i>
                Text remains crisp
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-blue-500 mr-2"></i>
                Images optimized
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-blue-500 mr-2"></i>
                Professional appearance
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}