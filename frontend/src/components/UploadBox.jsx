import { useRef, useState } from 'react';

function UploadBox({ onUpload, disabled = false }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const pickFile = (files) => {
    const file = files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile || disabled) return;
    onUpload(selectedFile);
  };

  return (
    <form className="upload-box" onSubmit={handleSubmit}>
      <button
        className={`drop-zone ${dragActive ? 'is-active' : ''}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          pickFile(event.dataTransfer.files);
        }}
        disabled={disabled}
      >
        <span className="upload-icon" aria-hidden="true">+</span>
        <span className="drop-title">
          {selectedFile ? selectedFile.name : 'Choose a file to upload'}
        </span>
        <span className="drop-subtitle">
          Drag a document here or browse from your computer.
        </span>
      </button>

      <input
        ref={inputRef}
        className="file-input"
        type="file"
        onChange={(event) => pickFile(event.target.files)}
      />

      <button className="primary-button" type="submit" disabled={!selectedFile || disabled}>
        {disabled ? 'Uploading...' : 'Upload document'}
      </button>
    </form>
  );
}

export default UploadBox;
