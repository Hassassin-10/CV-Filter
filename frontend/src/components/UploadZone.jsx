import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

export default function UploadZone({ onImageLoaded }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => onImageLoaded(e.target.result)
    reader.readAsDataURL(file)
  }, [onImageLoaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'] },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      id="upload-zone"
      style={{
        border: `2px dashed ${isDragActive ? 'var(--accent-cyan)' : 'var(--border-accent)'}`,
        borderRadius: '20px',
        padding: '60px 40px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isDragActive
          ? 'rgba(0,212,255,0.07)'
          : 'rgba(13,21,40,0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <input {...getInputProps()} />

      {/* Animated Icon */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
        border: '1.5px solid var(--border-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
        fontSize: 32,
        transition: 'transform 0.3s',
        transform: isDragActive ? 'scale(1.15)' : 'scale(1)',
        animation: isDragActive ? 'none' : 'pulse-glow 2.5s ease-in-out infinite',
      }}>
        📷
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
        {isDragActive ? 'Drop your image here!' : 'Upload an Image to Begin'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        Drag & drop or click to browse · PNG, JPG, BMP, TIFF, WEBP
      </p>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {['5 Processing Modules', 'Real-time Filtering', 'FFT Visualization', 'Histogram Analysis'].map(f => (
          <span key={f} className="badge" style={{
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            color: 'var(--accent-cyan)',
          }}>✓ {f}</span>
        ))}
      </div>
    </div>
  )
}
