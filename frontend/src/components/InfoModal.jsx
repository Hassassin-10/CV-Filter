import { OP_INFO } from '../data/operations'

export default function InfoModal({ opId, onClose }) {
  if (!opId) return null
  const info = OP_INFO[opId]
  if (!info) return null

  return (
    <div
      id="info-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(6,11,24,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        id="info-modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 480, width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.08)',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
              color: 'var(--accent-cyan)', marginBottom: 4,
            }}>Theory & Formula</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
              {opId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </h2>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Formula */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(0,212,255,0.15)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          color: 'var(--accent-cyan)',
          lineHeight: 1.6,
          overflowX: 'auto',
        }}>
          {info.formula}
        </div>

        {/* Description */}
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          {info.desc}
        </p>

        {/* OpenCV Function */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' }}>
            OpenCV FUNCTION
          </div>
          <code style={{
            display: 'block',
            padding: '8px 12px',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 8,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: '#c084fc',
          }}>{info.cv2}</code>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', marginTop: 20 }}
        >Got it</button>
      </div>
    </div>
  )
}
