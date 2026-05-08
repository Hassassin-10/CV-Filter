import { useState } from 'react'

export default function FFTPanel({ fftData }) {
  const [open, setOpen] = useState(true)

  if (!fftData) return null

  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid var(--border)',
      background: 'var(--bg-card)',
      overflow: 'hidden',
    }}>
      <div
        style={{
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', userSelect: 'none',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: 'var(--text-secondary)' }}>
          〰️ FFT Spectrum
        </span>
        <span style={{
          fontSize: 10, color: 'var(--text-muted)',
          transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>▶</span>
      </div>

      {open && (
        <div style={{ padding: 10, animation: 'fadeIn 0.2s ease' }}>
          <img
            src={fftData}
            alt="FFT Spectrum"
            style={{
              width: '100%', borderRadius: 8,
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'block',
            }}
          />
          <p style={{
            marginTop: 6, fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5,
          }}>
            Bright center = low frequencies · Edges = high frequencies
          </p>
        </div>
      )}
    </div>
  )
}
