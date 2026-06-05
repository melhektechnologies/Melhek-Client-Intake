import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Film } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  hint?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  image: Image,
  video: Film,
};

function getFileIcon(file: File) {
  const type = file.type.split('/')[0];
  return ICON_MAP[type] || FileText;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function FileUploadZone({
  label, files, onChange, accept = '*/*', multiple = true, maxSizeMB = 10, hint,
}: FileUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const maxBytes = maxSizeMB * 1024 * 1024;
    const valid: File[] = [];
    for (const f of Array.from(newFiles)) {
      if (f.size > maxBytes) { setError(`${f.name} exceeds ${maxSizeMB}MB limit`); continue; }
      valid.push(f);
    }
    setError(null);
    onChange(multiple ? [...files, ...valid] : [valid[0]].filter(Boolean));
  }, [files, multiple, maxSizeMB, onChange]);

  const removeFile = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full">
      <label className="input-label">{label}</label>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all duration-250 p-8"
        style={{
          background: dragging ? 'rgba(127,169,255,0.08)' : 'rgba(7,15,60,0.3)',
          border: `2px dashed ${dragging ? 'rgba(127,169,255,0.6)' : 'rgba(127,169,255,0.2)'}`,
          boxShadow: dragging ? '0 0 20px rgba(127,169,255,0.1)' : 'none',
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 48, height: 48,
            background: dragging ? 'rgba(127,169,255,0.15)' : 'rgba(127,169,255,0.08)',
            border: '1px solid rgba(127,169,255,0.2)',
          }}
        >
          <Upload size={22} color={dragging ? 'var(--electric)' : 'var(--text-tertiary)'} />
        </div>
        <div className="text-center">
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {dragging ? 'Drop files here' : 'Drag & drop or click to browse'}
          </p>
          {hint && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</p>}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Max {maxSizeMB}MB per file
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="error-message mt-2">{error}</p>}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => {
            const Icon = getFileIcon(file);
            return (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(127,169,255,0.06)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 32, height: 32, background: 'rgba(127,169,255,0.1)' }}>
                  <Icon size={15} color="var(--electric)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="flex-shrink-0 p-1 rounded transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
