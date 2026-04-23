"use client";
import { useState, useRef } from "react";
export default function VideoUpload({ onFileSelect, disabled = false, videoPreview, selectedFileName, }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const ALLOWED_FORMATS = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
    const validateFile = (file) => {
        if (!ALLOWED_FORMATS.includes(file.type)) {
            return "Only MP4, WebM, OGG, and MOV formats are supported";
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File size must be less than 500MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
        }
        return null;
    };
    const handleFile = (file) => {
        setError(null);
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = e.target?.result;
            onFileSelect(file, preview);
            setUploadProgress(0);
        };
        reader.readAsDataURL(file);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };
    const handleFileInput = (e) => {
        const files = Array.from(e.currentTarget.files || []);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };
    return (<div className="space-y-4">
      {!videoPreview && (<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => !disabled && fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileInput} className="hidden" disabled={disabled}/>

          <div className="space-y-2">
            <div className="text-4xl">🎥</div>
            <div>
              <p className="text-gray-700 font-medium">
                {isDragging ? "Drop your video here" : "Drag and drop your video"}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">
              MP4, WebM, OGG, MOV • Max 500MB
            </p>
          </div>
        </div>)}

      {error && (<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>)}

      {videoPreview && (<div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video src={videoPreview} controls className="w-full aspect-video"/>
          </div>

          {selectedFileName && (<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">📹</span>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{selectedFileName}</p>
                  <p className="text-gray-500">Ready to upload</p>
                </div>
              </div>
              <button type="button" onClick={() => {
                    fileInputRef.current?.click();
                }} className="text-xs text-blue-600 hover:text-blue-700 font-medium" disabled={disabled}>
                Change
              </button>
            </div>)}

          {uploadProgress > 0 && uploadProgress < 100 && (<div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Uploading</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}/>
              </div>
            </div>)}
        </div>)}
    </div>);
}
