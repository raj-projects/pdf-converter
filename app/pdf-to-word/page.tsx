'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockFileConversion } from '@/lib/mockApi';
import Link from 'next/link';

export default function PDFToWordPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

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
        'docx',
        (progress, status) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors cursor-pointer">Home</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-gray-900 font-medium">PDF to Word</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mx-auto mb-6 shadow-lg">
            <i className="ri-file-word-line text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF to Word Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert your PDF files to editable Word documents while preserving formatting, images, and layout perfectly.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {!selectedFile && !downloadUrl && (
            <div className="p-8 md:p-12">
              <FileUpload
                acceptedTypes={['.pdf']}
                onFileSelect={handleFileSelect}
                maxSize={50}
                placeholder="Drop your PDF file here or click to browse"
                icon="ri-file-pdf-line"
              />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-3">
                    <i className="ri-shield-check-line text-green-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">100% Secure</h3>
                  <p className="text-sm text-gray-600">Your files are processed securely and deleted after 24 hours</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-3">
                    <i className="ri-layout-line text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Perfect Formatting</h3>
                  <p className="text-sm text-gray-600">Maintains original layout, fonts, and formatting</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-3">
                    <i className="ri-speed-line text-purple-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-sm text-gray-600">Convert files in seconds with our optimized engine</p>
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

              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">PDF</span>
                  <i className="ri-arrow-right-line text-2xl text-gray-400"></i>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">DOCX</span>
                </div>
              </div>

              {isConverting && (
                <div className="mb-8">
                  <ProgressBar progress={progress} status={status} />
                </div>
              )}

              {!isConverting && (
                <button
                  onClick={handleConvert}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                >
                  Convert to Word
                </button>
              )}
            </div>
          )}

          {downloadUrl && (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-6">
                <i className="ri-check-line text-green-600 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Conversion Complete!</h3>
              <p className="text-gray-600 mb-8">Your PDF has been successfully converted to Word format.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a
                  href={downloadUrl}
                  download={fileName}
                  className="flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-download-line"></i>
                  <span>Download Word File</span>
                </a>
                <button
                  onClick={resetConverter}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-refresh-line"></i>
                  <span>Convert Another File</span>
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
                    <h3 className="font-semibold text-red-800">Conversion Failed</h3>
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
            <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                Fully editable Word document
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                Preserved fonts and formatting
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                Images and tables intact
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Perfect for:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <i className="ri-check-line text-blue-500 mr-2"></i>
                Editing PDF documents
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-blue-500 mr-2"></i>
                Content extraction
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-blue-500 mr-2"></i>
                Document collaboration
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}