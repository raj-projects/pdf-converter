
'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockFileConversion } from '@/lib/mockApi';
import Link from 'next/link';

export default function JpgToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [convertedFile, setConvertedFile] = useState<{
    url: string;
    name: string;
    size: string;
  } | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setConvertedFile(null);
    setError('');
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
        'pdf',
        (progress, status) => {
          setProgress(progress);
          setStatus(status);
        }
      );

      if (result.success && result.downloadUrl && result.fileName) {
        setConvertedFile({
          url: result.downloadUrl,
          name: result.fileName,
          size: (selectedFile.size / 1024 / 1024).toFixed(2)
        });
      } else {
        setError(result.error || 'Conversion failed');
      }
    } catch (err) {
      setError('An error occurred during conversion');
    }

    setIsConverting(false);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    
    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConvertedFile(null);
    setProgress(0);
    setStatus('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-orange-600">JPG to PDF</span>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center bg-orange-100 rounded-full mx-auto mb-4">
            <i className="ri-image-line text-3xl text-orange-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Convert JPG to PDF
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your JPG images into professional PDF documents instantly.
            Perfect for creating portfolios, reports, or archiving images.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {!selectedFile && (
              <>
                <FileUpload
                  acceptedTypes={[".jpg", ".jpeg"]}
                  onFileSelect={handleFileSelect}
                  maxSize={10}
                  placeholder="Drop your JPG image here"
                  icon="ri-image-add-line"
                />

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg mx-auto mb-3">
                      <i className="ri-file-pdf-line text-xl text-orange-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      High Quality
                    </h3>
                    <p className="text-sm text-gray-600">
                      Preserves original image quality in PDF format
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg mx-auto mb-3">
                      <i className="ri-shield-check-line text-xl text-orange-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                    <p className="text-sm text-gray-600">
                      Files deleted automatically after 24 hours
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg mx-auto mb-3">
                      <i className="ri-flashlight-line text-xl text-orange-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fast</h3>
                    <p className="text-sm text-gray-600">
                      Convert images in seconds
                    </p>
                  </div>
                </div>
              </>
            )}

            {selectedFile && !convertedFile && !isConverting && (
              <div className="space-y-6">
                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Selected File
                    </h3>
                    <button
                      onClick={resetConverter}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg">
                      <i className="ri-image-line text-xl text-orange-600"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-lg">
                      <i className="ri-image-line text-orange-600"></i>
                      <span className="text-sm font-medium">JPG</span>
                    </div>
                    <i className="ri-arrow-right-line text-gray-400 text-xl"></i>
                    <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-lg">
                      <i className="ri-file-pdf-line text-red-600"></i>
                      <span className="text-sm font-medium">PDF</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConvert}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Convert to PDF
                  </button>
                </div>
              </div>
            )}

            {isConverting && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-full mx-auto mb-4">
                    <i className="ri-file-transfer-line text-2xl text-orange-600 animate-pulse"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Converting Image
                  </h3>
                  <p className="text-gray-600 mb-6">{status}</p>
                </div>
                <ProgressBar progress={progress} />
              </div>
            )}

            {convertedFile && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
                    <i className="ri-check-line text-2xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Conversion Complete!
                  </h3>
                  <p className="text-gray-600">
                    Your JPG has been converted to PDF successfully.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-lg">
                        <i className="ri-file-pdf-line text-xl text-red-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {convertedFile.name}
                        </p>
                        <p className="text-sm text-gray-600">PDF Document</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      <i className="ri-download-line mr-2"></i>
                      Download
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={resetConverter}
                    className="text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap"
                  >
                    Convert Another Image
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                      <i className="ri-information-line text-yellow-600"></i>
                    </div>
                    <p className="text-sm text-yellow-800">
                      Your files will be automatically deleted after 24 hours
                      for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-error-warning-line text-red-500"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
