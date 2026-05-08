import { useState } from 'react'
import { useImageProcessor } from './hooks/useImageProcessor'
import Sidebar from './components/Sidebar'
import UploadZone from './components/UploadZone'
import Workspace from './components/Workspace'
import ControlPanel from './components/ControlPanel'
import HistogramPanel from './components/HistogramPanel'
import FFTPanel from './components/FFTPanel'
import InfoModal from './components/InfoModal'

export default function App() {
  const {
    originalImage, processedImage,
    histogramData, fftData,
    loading, error, activeOperation,
    loadImage, applyOperation,
    resetToOriginal, swapToProcessed,
  } = useImageProcessor()

  const [selectedOp, setSelectedOp] = useState(null)
  const [infoOpId, setInfoOpId] = useState(null)

  const handleNewImage = () => {
    loadImage(null)
    setSelectedOp(null)
  }

  return (
    <div className="bg-grid" style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      {/* ─── Sidebar ─── */}
      <Sidebar
        selectedOp={selectedOp}
        onSelectOp={setSelectedOp}
        hasImage={!!originalImage}
      />

      {/* ─── Main Area ─── */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', minWidth: 0,
      }}>

        {/* Top Bar */}
        <header style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(13,21,40,0.8)',
          backdropFilter: 'blur(12px)',
          flexShrink: 0,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px',
          }}>
            Interactive Computer Vision Lab
          </div>
          <div style={{ flex: 1 }} />
          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: loading ? '#f59e0b' : originalImage ? '#10b981' : '#475569',
              animation: loading ? 'pulse-glow 1s ease infinite' : 'none',
            }} />
            {loading ? 'Processing...' : originalImage ? 'Image loaded' : 'No image'}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['basic','frequency','segmentation','color','morphology'].map((m,i) => (
              <span key={m} className="badge" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: 9,
              }}>M{i+1}</span>
            ))}
          </div>
        </header>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>

          {/* ─── Right Panel (controls + viz) ─── */}
          <aside style={{
            width: 280, minWidth: 280,
            borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
            background: 'var(--bg-secondary)',
            order: 2,
          }}>
            <ControlPanel
              selectedOp={selectedOp}
              onApply={applyOperation}
              loading={loading}
              error={error}
              onShowInfo={setInfoOpId}
            />
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              <HistogramPanel histogramData={histogramData} />
              <FFTPanel fftData={fftData} />

              {/* Quick Guide */}
              {!originalImage && (
                <div style={{
                  borderRadius: 14, border: '1px solid var(--border)',
                  background: 'var(--bg-card)', padding: '14px 16px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 10, textTransform: 'uppercase' }}>
                    Quick Guide
                  </div>
                  {[
                    ['1', 'Upload an image', 'var(--accent-cyan)'],
                    ['2', 'Select an operation', 'var(--accent-purple)'],
                    ['3', 'Adjust parameters', '#10b981'],
                    ['4', 'Click Apply', '#f59e0b'],
                    ['5', 'Download result', '#ec4899'],
                  ].map(([n, text, color]) => (
                    <div key={n} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: `${color}18`, border: `1px solid ${color}40`,
                        color, fontSize: 10, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{n}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Module Summary */}
              {!originalImage && (
                <div style={{
                  borderRadius: 14, border: '1px solid var(--border)',
                  background: 'var(--bg-card)', padding: '14px 16px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 10, textTransform: 'uppercase' }}>
                    Available Modules
                  </div>
                  {[
                    ['⚡', 'Basic Processing', '15 ops', '#00d4ff'],
                    ['〰️', 'Frequency Domain', '9 ops', '#7c3aed'],
                    ['✂️', 'Segmentation', '8 ops', '#10b981'],
                    ['🎨', 'Color Processing', '8 ops', '#f59e0b'],
                    ['🔷', 'Morphology', '8 ops', '#ec4899'],
                  ].map(([icon, label, count, color]) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                    }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                        background: `${color}15`, border: `1px solid ${color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                      }}>{icon}</span>
                      <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ─── Center Canvas ─── */}
          <div style={{
            flex: 1, overflow: 'auto', padding: 20,
            display: 'flex', flexDirection: 'column', gap: 16,
            order: 1, minWidth: 0,
          }}>
            {!originalImage ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <div style={{
                    display: 'inline-flex', gap: 10, alignItems: 'center',
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: 99, padding: '6px 16px',
                    marginBottom: 20,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse-glow 2s ease infinite' }} />
                    <span style={{ fontSize: 12, color: 'var(--accent-cyan)', fontWeight: 600 }}>Powered by OpenCV + Flask</span>
                  </div>
                  <h1 style={{
                    fontSize: 42, fontWeight: 800, lineHeight: 1.15,
                    background: 'linear-gradient(135deg, #fff 30%, var(--accent-cyan))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', marginBottom: 16, letterSpacing: '-1px',
                  }}>
                    Computer Vision<br/>Laboratory
                  </h1>
                  <p style={{
                    fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto',
                    lineHeight: 1.7,
                  }}>
                    Upload an image and explore 48+ image processing operations across 5 modules.
                    Perfect for VTU mini projects and academic demonstrations.
                  </p>
                </div>
                <UploadZone onImageLoaded={loadImage} />
              </div>
            ) : (
              <Workspace
                originalImage={originalImage}
                processedImage={processedImage}
                activeOperation={activeOperation}
                onReset={resetToOriginal}
                onSwap={swapToProcessed}
                onNewImage={handleNewImage}
              />
            )}
          </div>
        </div>
      </main>

      {/* ─── Info Modal ─── */}
      <InfoModal opId={infoOpId} onClose={() => setInfoOpId(null)} />
    </div>
  )
}
