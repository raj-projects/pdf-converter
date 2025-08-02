
export interface ConversionResult {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  error?: string;
}

export const mockFileConversion = async (
  file: File,
  targetFormat: string,
  onProgress: (progress: number, status: string) => void
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    let progress = 0;

    const updateProgress = () => {
      if (progress < 30) {
        onProgress(progress, 'Uploading file...');
        progress += Math.random() * 5 + 2;
      } else if (progress < 70) {
        onProgress(progress, 'Converting file...');
        progress += Math.random() * 8 + 3;
      } else if (progress < 95) {
        onProgress(progress, 'Finalizing conversion...');
        progress += Math.random() * 5 + 2;
      } else {
        onProgress(100, 'Conversion complete!');

        // Simulate file conversion result with proper extension
        const originalName = file.name.split('.')[0];
        const convertedFileName = `${originalName}_converted.${targetFormat}`;

        // Create proper MIME type based on target format
        let mimeType = 'application/octet-stream';
        if (targetFormat === 'pdf') mimeType = 'application/pdf';
        else if (targetFormat === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';

        resolve({
          success: true,
          downloadUrl: URL.createObjectURL(new Blob(['Mock converted file content'], { type: mimeType })),
          fileName: convertedFileName
        });
        return;
      }

      setTimeout(updateProgress, Math.random() * 300 + 200);
    };

    updateProgress();
  });
};

export const mockFileCompress = async (
  file: File,
  onProgress: (progress: number, status: string) => void
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    let progress = 0;

    const updateProgress = () => {
      if (progress < 40) {
        onProgress(progress, 'Analyzing file...');
        progress += Math.random() * 6 + 3;
      } else if (progress < 80) {
        onProgress(progress, 'Compressing PDF...');
        progress += Math.random() * 8 + 4;
      } else if (progress < 95) {
        onProgress(progress, 'Optimizing size...');
        progress += Math.random() * 3 + 2;
      } else {
        onProgress(100, 'Compression complete!');

        const originalName = file.name.split('.')[0];
        const compressedFileName = `${originalName}_compressed.pdf`;

        resolve({
          success: true,
          downloadUrl: URL.createObjectURL(new Blob(['Mock compressed file content'], { type: 'application/pdf' })),
          fileName: compressedFileName
        });
        return;
      }

      setTimeout(updateProgress, Math.random() * 250 + 150);
    };

    updateProgress();
  });
};

export const mockFileMerge = async (
  files: File[],
  onProgress: (progress: number, status: string) => void
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    let progress = 0;

    const updateProgress = () => {
      if (progress < 20) {
        onProgress(progress, 'Preparing files...');
        progress += Math.random() * 4 + 2;
      } else if (progress < 60) {
        onProgress(progress, 'Merging PDFs...');
        progress += Math.random() * 6 + 4;
      } else if (progress < 90) {
        onProgress(progress, 'Creating merged document...');
        progress += Math.random() * 5 + 3;
      } else {
        onProgress(100, 'Merge complete!');

        resolve({
          success: true,
          downloadUrl: URL.createObjectURL(new Blob(['Mock merged file content'], { type: 'application/pdf' })),
          fileName: 'merged_document.pdf'
        });
        return;
      }

      setTimeout(updateProgress, Math.random() * 300 + 200);
    };

    updateProgress();
  });
};

export const mockFileSplit = async (
  file: File,
  pageRange: string,
  onProgress: (progress: number, status: string) => void
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    let progress = 0;

    const updateProgress = () => {
      if (progress < 30) {
        onProgress(progress, 'Reading PDF pages...');
        progress += Math.random() * 5 + 3;
      } else if (progress < 70) {
        onProgress(progress, 'Extracting pages...');
        progress += Math.random() * 7 + 4;
      } else if (progress < 95) {
        onProgress(progress, 'Creating new documents...');
        progress += Math.random() * 4 + 2;
      } else {
        onProgress(100, 'Split complete!');

        const originalName = file.name.split('.')[0];
        const splitFileName = `${originalName}_pages_${pageRange}.pdf`;

        resolve({
          success: true,
          downloadUrl: URL.createObjectURL(new Blob(['Mock split file content'], { type: 'application/pdf' })),
          fileName: splitFileName
        });
        return;
      }

      setTimeout(updateProgress, Math.random() * 280 + 180);
    };

    updateProgress();
  });
};
