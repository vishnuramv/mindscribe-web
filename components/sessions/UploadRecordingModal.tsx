import React, { useState, useRef, DragEvent } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Spinner from '../ui/Spinner';

interface UploadRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (file: File) => Promise<void>;
}

const UploadRecordingModal: React.FC<UploadRecordingModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClose = () => {
    setFile(null);
    setError(null);
    setIsProcessing(false);
    onClose();
  }

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onProcess(file);
      // The parent component will handle closing or navigation on success
    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred.');
      setIsProcessing(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload a session recording">
      <div className="text-center p-4">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-10">
            <Spinner />
            <p className="mt-4 text-gray-600">Processing your recording... Please wait.</p>
          </div>
        ) : (
          <>
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-10 transition-colors ${isDragging ? 'border-primary bg-primary-light' : 'border-gray-300 bg-gray-50'}`}
            >
              <Icon name="cloudUpload" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                className="hidden"
                accept="audio/*,video/*"
              />
              {file ? (
                <p className="text-gray-700 font-semibold">{file.name}</p>
              ) : (
                <>
                  <button onClick={handleBrowseClick} className="font-semibold text-primary hover:underline">
                    Browse your device
                  </button>
                  <p className="text-gray-500 mt-1">or drag a file here</p>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Upload audio or video recordings so we can create progress notes.
            </p>
             {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>Cancel</Button>
        <Button onClick={handleProcess} disabled={!file || isProcessing}>
          {isProcessing ? 'Processing...' : 'Continue with processing'}
        </Button>
      </div>
    </Modal>
  );
};

export default UploadRecordingModal;