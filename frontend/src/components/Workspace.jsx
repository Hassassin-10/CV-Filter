import { useRef, useState } from 'react'

function ImagePanel({ title, src, badge, badgeColor, actions }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--bg-card)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
          {badge && (
            <span className="badge" style={{
              background: `${badgeColor}18`,
              border: `1px solid ${badgeColor}40`,
              color: badgeColor,
            }}>{badge}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>{actions}</div>
      </div>

      {/* Image */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px`,
        minHeight: 220,
        padding: 8,
      }}>
        {src ? (
          <img
            src={src}
            alt={title}
            style={{
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 8,
              animation: 'fadeIn 0.3s ease',
            }}
          />
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>🖼</div>
            No image
          </div>
        )}
      </div>
    </div>
  )
}

export default function Workspace({
  originalImage, processedImage, activeOperation,
  onReset, onSwap, onNewImage,
}) {
  const [compareMode, setCompareMode] = useState(false)
  const [sliderX, setSliderX] = useState(50)
  const containerRef = useRef(null)

  const handleDownload = () => {
    if (!processedImage) return
    const a = document.createElement('a')
    a.href = processedImage
    a.download = `cvfilter_${activeOperation || 'result'}.png`
    a.click()
  }

  const handleMouseMove = (e) => {
    if (!compareMode || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setSliderX(Math.min(95, Math.max(5, x)))
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginRight: 4 }}>
          Workspace
        </span>
        <div style={{ flex: 1 }} />
        {processedImage && (
          <>
            <button
              id="compare-btn"
              className="btn-ghost"
              onClick={() => setCompareMode(c => !c)}
              style={{ fontSize: 12, color: compareMode ? 'var(--accent-cyan)' : undefined }}
            >
              {compareMode ? '⊡ Side by Side' : '⊠ Compare Slider'}
            </button>
            <button id="swap-btn" className="btn-ghost" onClick={onSwap} style={{ fontSize: 12 }}>
              ↺ Use as Original
            </button>
            <button id="reset-btn" className="btn-ghost" onClick={onReset} style={{ fontSize: 12 }}>
              ✕ Reset
            </button>
            <button id="download-btn" className="btn-primary" onClick={handleDownload} style={{ fontSize: 12 }}>
              ↓ Download
            </button>
          </>
        )}
        <button id="new-image-btn" className="btn-ghost" onClick={onNewImage} style={{ fontSize: 12 }}>
          ＋ New Image
        </button>
      </div>

      {/* Compare Slider Mode */}
      {compareMode && processedImage && originalImage ? (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          style={{
            position: 'relative', overflow: 'hidden',
            borderRadius: 16, border: '1px solid var(--border)',
            background: '#000', cursor: 'col-resize',
            minHeight: 300, flex: 1,
          }}
        >
          {/* Original (full) */}
          <img src={originalImage} alt="Original"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
          {/* Processed (clipped left) */}
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden',
            width: `${sliderX}%`,
          }}>
            <img src={processedImage} alt="Processed"
              style={{ width: `${100 / (sliderX / 100)}%`, height: '100%', objectFit: 'contain', maxWidth: 'none' }} />
          </div>
          {/* Divider Line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${sliderX}%`,
            width: 2, background: 'var(--accent-cyan)',
            boxShadow: '0 0 12px var(--accent-cyan)',
            transform: 'translateX(-50%)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--accent-cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#000', fontWeight: 700,
            }}>⟺</div>
          </div>
          {/* Labels */}
          <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 11, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: 99 }}>Original</span>
          <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 11, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: 99 }}>Processed</span>
        </div>
      ) : (
        /* Side-by-side Mode */
        <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0 }}>
          <ImagePanel
            title="Original"
            src={originalImage}
            badge="SOURCE"
            badgeColor="var(--accent-cyan)"
          />
          <ImagePanel
            title="Processed"
            src={processedImage}
            badge={activeOperation ? activeOperation.replace(/_/g, ' ').toUpperCase() : null}
            badgeColor="var(--accent-purple)"
            actions={processedImage && (
              <button id="dl-icon-btn" onClick={handleDownload}
                title="Download"
                style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: 'var(--accent-purple)',
                  cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>↓</button>
            )}
          />
        </div>
      )}
    </div>
  )
}
