
'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockFileSplit } from '@/lib/mockApi';
import Link from 'next/link';

export default function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<'pages' | 'range'>('pages');
  const [pageRange, setPageRange] = useState('');
  const [splitPages, setSplitPages] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [splitFiles, setSplitFiles] = useState<{
    url: string;
    name: string;
    size: string;
  }[]>([]);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSplitFiles([]);
    setError('');
    setProgress(0);
    setStatus('');
  };

  const handleSplit = async () => {
    if (!selectedFile) return;

    let range = '';
    if (splitMode === 'pages') {
      if (!splitPages.trim()) {
        setError('Please specify pages to extract');
        return;
      }
      range = splitPages.trim();
    } else {
      if (!pageRange.trim()) {
        setError('Please specify page range');
        return;
      }
      range = pageRange.trim();
    }

    setIsSplitting(true);
    setError('');

    try {
      const result = await mockFileSplit(
        selectedFile,
        range,
        (progress, status) => {
          setProgress(progress);
          setStatus(status);
        }
      );

      if (result.success && result.downloadUrl && result.fileName) {
        // Simulate multiple split files
        const splitCount = splitMode === 'pages' ? splitPages.split(',').length : 1;
        const files = [];
        
        for (let i = 0; i < Math.min(splitCount, 3); i++) {
          files.push({
            url: result.downloadUrl,
            name: result.fileName.replace('.pdf', `_part${i + 1}.pdf`),
            size: (selectedFile.size / splitCount / 1024 / 1024).toFixed(2)
          });
        }
        
        setSplitFiles(files);
      } else {
        setError(result.error || 'Split failed');
      }
    } catch (err) {
      setError('An error occurred during splitting');
    }

    setIsSplitting(false);
  };

  const handleDownload = (file: { url: string; name: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    splitFiles.forEach(file => {
      setTimeout(() => handleDownload(file), 100);
    });
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setSplitFiles([]);
    setProgress(0);
    setStatus('');
    setError('');
    setPageRange('');
    setSplitPages('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <span className="text-teal-600">Split PDF</span>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center bg-teal-100 rounded-full mx-auto mb-4">
            <i className="ri-scissors-cut-line text-3xl text-teal-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Split PDF Pages</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Extract specific pages or page ranges from your PDF documents. Perfect for separating chapters or sections.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {!selectedFile && (
              <>
                <FileUpload
                  acceptedTypes={['.pdf']}
                  onFileSelect={handleFileSelect}
                  maxSize={25}
                  placeholder="Drop your PDF file here"
                  icon="ri-file-pdf-line"
                />

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-lg mx-auto mb-3">
                      <i className="ri-file-copy-line text-xl text-teal-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Extract Pages</h3>
                    <p className="text-sm text-gray-600">Extract specific pages or ranges</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-lg mx-auto mb-3">
                      <i className="ri-file-list-3-line text-xl text-teal-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Multiple Options</h3>
                    <p className="text-sm text-gray-600">Split by pages or ranges</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-lg mx-auto mb-3">
                      <i className="ri-shield-check-line text-xl text-teal-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                    <p className="text-sm text-gray-600">Files deleted after 24 hours</p>
                  </div>
                </div>
              </>
            )}

            {selectedFile && splitFiles.length === 0 && !isSplitting && (
              <div className="space-y-6">
                <div className="bg-teal-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Selected File</h3>
                    <button
                      onClick={resetConverter}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-lg">
                      <i className="ri-file-pdf-line text-xl text-red-600"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Split Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Split Options</h3>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSplitMode('pages')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                        splitMode === 'pages'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="text-center">
                        <i className="ri-file-list-line text-2xl mb-2 block"></i>
                        <div className="font-medium">Specific Pages</div>
                        <div className="text-sm text-gray-600">Extract individual pages</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setSplitMode('range')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                        splitMode === 'range'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="text-center">
                        <i className="ri-file-copy-2-line text-2xl mb-2 block"></i>
                        <div className="font-medium">Page Range</div>
                        <div className="text-sm text-gray-600">Extract a range of pages</div>
                      </div>
                    </button>
                  </div>

                  {splitMode === 'pages' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Numbers (comma separated)
                      </label>
                      <input
                        type="text"
                        value={splitPages}
                        onChange={(e) => setSplitPages(e.target.value)}
                        placeholder="e.g., 1, 3, 5-8, 12"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Examples: "1,3,5" or "1-5,8,10-12"
                      </p>
                    </div>
                  )}

                  {splitMode === 'range' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Range
                      </label>
                      <input
                        type="text"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        placeholder="e.g., 1-10 or 5-15"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: "start-end" (e.g., "1-5" for pages 1 to 5)
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSplit}
                    disabled={
                      (splitMode === 'pages' && !splitPages.trim()) ||
                      (splitMode === 'range' && !pageRange.trim())
                    }
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Split PDF
                  </button>
                </div>
              </div>
            )}

            {isSplitting && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-teal-100 rounded-full mx-auto mb-4">
                    <i className="ri-scissors-cut-line text-2xl text-teal-600 animate-pulse"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Splitting PDF</h3>
                  <p className="text-gray-600 mb-6">{status}</p>
                </div>
                <ProgressBar progress={progress} status={status} />
              </div>
            )}

            {splitFiles.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
                    <i className="ri-check-line text-2xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Split Successfully!</h3>
                  <p className="text-gray-600">Your PDF has been split into {splitFiles.length} files.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Split Files</h4>
                    <button
                      onClick={downloadAll}
                      className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap"
                    >
                      Download All
                    </button>
                  </div>
                  
                  {splitFiles.map((file, index) => (
                    <div key={index} className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg">
                            <i className="ri-file-pdf-line text-lg text-red-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">PDF • {file.size} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(file)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                          <i className="ri-download-line mr-1"></i>
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={resetConverter}
                    className="text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                  >
                    Split Another PDF
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                      <i className="ri-information-line text-yellow-600"></i>
                    </div>
                    <p className="text-sm text-yellow-800">
                      Your files will be automatically deleted after 24 hours for security purposes.
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
                    onClick={() => setError('')}
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
