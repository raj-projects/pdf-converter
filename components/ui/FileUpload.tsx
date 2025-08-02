'use client';
import { useState, useRef } from 'react';

interface FileUploadProps {
  acceptedTypes: string[];
  onFileSelect: (file: File) => void;
  maxSize?: number;
  placeholder?: string;
  icon?: string;
}

export default function FileUpload({ 
  acceptedTypes, 
  onFileSelect, 
  maxSize = 10, 
  placeholder = "Drag and drop your file here",
  icon = "ri-upload-cloud-line"
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError('');

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Please select a valid file type: ${acceptedTypes.join(', ')}`);
      return;
    }

    onFileSelect(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
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
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
            <i className={`${icon} text-2xl text-gray-600`}></i>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">{placeholder}</p>
            <p className="text-sm text-gray-600 mb-4">or click to browse files</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span>Supported formats:</span>
              {acceptedTypes.map((type, index) => (
                <span key={type} className="bg-gray-100 px-2 py-1 rounded">
                  {type.replace('.', '').toUpperCase()}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Maximum file size: {maxSize}MB</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <div className="w-5 h-5 flex items-center justify-center mr-2">
              <i className="ri-error-warning-line text-red-500"></i>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}