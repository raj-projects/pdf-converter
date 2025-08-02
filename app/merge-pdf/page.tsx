
'use client';
import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockFileMerge } from '@/lib/mockApi';
import Link from 'next/link';

export default function MergePdfPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [mergedFile, setMergedFile] = useState<{
    url: string;
    name: string;
    size: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const pdfFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      );
      handleFileSelection(pdfFiles);
    }
  };

  const handleFileSelection = (files: File[]) => {
    setError('');
    
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    if (files.length > 10) {
      setError('Maximum 10 files can be merged at once');
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each file must be less than 10MB');
      return;
    }

    setSelectedFiles(files);
    setMergedFile(null);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...selectedFiles];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setSelectedFiles(newFiles);
  };

  const moveFileDown = (index: number) => {
    if (index === selectedFiles.length - 1) return;
    const newFiles = [...selectedFiles];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setSelectedFiles(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) return;

    setIsMerging(true);
    setError('');

    try {
      const result = await mockFileMerge(
        selectedFiles,
        (progress, status) => {
          setProgress(progress);
          setStatus(status);
        }
      );

      if (result.success && result.downloadUrl && result.fileName) {
        const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        setMergedFile({
          url: result.downloadUrl,
          name: result.fileName,
          size: (totalSize / 1024 / 1024).toFixed(2)
        });
      } else {
        setError(result.error || 'Merge failed');
      }
    } catch (err) {
      setError('An error occurred during merging');
    }

    setIsMerging(false);
  };

  const handleDownload = () => {
    if (!mergedFile) return;
    
    const link = document.createElement('a');
    link.href = mergedFile.url;
    link.download = mergedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetConverter = () => {
    setSelectedFiles([]);
    setMergedFile(null);
    setProgress(0);
    setStatus('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <span className="text-purple-600">Merge PDF</span>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-4">
            <i className="ri-file-copy-2-line text-3xl text-purple-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merge PDF Files</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Combine multiple PDF documents into a single file. Perfect for consolidating reports, contracts, or documents.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {selectedFiles.length === 0 && (
              <>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                    isDragOver
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                      <i className="ri-file-add-line text-2xl text-gray-600"></i>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">Drop your PDF files here</p>
                      <p className="text-sm text-gray-600 mb-4">or click to select multiple files</p>
                      <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-500 mb-2">
                        PDF files only
                      </div>
                      <p className="text-xs text-gray-400">2-10 files, max 10MB each</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mx-auto mb-3">
                      <i className="ri-stack-line text-xl text-purple-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Multiple Files</h3>
                    <p className="text-sm text-gray-600">Merge up to 10 PDF files at once</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mx-auto mb-3">
                      <i className="ri-drag-move-2-line text-xl text-purple-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reorder</h3>
                    <p className="text-sm text-gray-600">Arrange files in your preferred order</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mx-auto mb-3">
                      <i className="ri-shield-check-line text-xl text-purple-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                    <p className="text-sm text-gray-600">Files deleted automatically after 24 hours</p>
                  </div>
                </div>
              </>
            )}

            {selectedFiles.length > 0 && !mergedFile && !isMerging && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <button
                    onClick={openFileDialog}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium whitespace-nowrap"
                  >
                    Add More Files
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg">
                            <i className="ri-file-pdf-line text-lg text-red-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveFileUp(index)}
                            disabled={index === 0}
                            className={`p-1 rounded ${
                              index === 0 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <i className="ri-arrow-up-line"></i>
                          </button>
                          <button
                            onClick={() => moveFileDown(index)}
                            disabled={index === selectedFiles.length - 1}
                            className={`p-1 rounded ${
                              index === selectedFiles.length - 1 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <i className="ri-arrow-down-line"></i>
                          </button>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedFiles.length >= 2 && (
                  <div className="text-center">
                    <button
                      onClick={handleMerge}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                    >
                      Merge {selectedFiles.length} Files
                    </button>
                  </div>
                )}

                {selectedFiles.length === 1 && (
                  <div className="text-center text-gray-600">
                    Add at least one more PDF file to merge
                  </div>
                )}
              </div>
            )}

            {isMerging && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-4">
                    <i className="ri-file-transfer-line text-2xl text-purple-600 animate-pulse"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Merging Files</h3>
                  <p className="text-gray-600 mb-6">{status}</p>
                </div>
                <ProgressBar progress={progress} status={status} />
              </div>
            )}

            {mergedFile && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
                    <i className="ri-check-line text-2xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Files Merged Successfully!</h3>
                  <p className="text-gray-600">Your PDF files have been combined into a single document.</p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-lg">
                        <i className="ri-file-pdf-line text-xl text-red-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{mergedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          Merged PDF • {mergedFile.size} MB
                        </p>
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
                    className="text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap"
                  >
                    Merge More Files
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
