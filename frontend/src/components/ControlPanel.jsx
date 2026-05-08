import { useState } from 'react'
import { OP_INFO } from '../data/operations'

export default function ControlPanel({ selectedOp, onApply, loading, error, onShowInfo }) {
  const [params, setParams] = useState({})

  // Reset params when op changes
  const currentOpId = selectedOp?.id
  const [lastOpId, setLastOpId] = useState(null)
  if (currentOpId !== lastOpId) {
    setLastOpId(currentOpId)
    const defaults = {}
    selectedOp?.params?.forEach(p => { defaults[p.key] = p.default })
    setParams(defaults)
  }

  const handleApply = () => {
    if (!selectedOp) return
    onApply(selectedOp.moduleId, selectedOp.id, params)
  }

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  if (!selectedOp) {
    return (
      <div style={{
        padding: '24px 20px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        color: 'var(--text-muted)',
        fontSize: 13,
        textAlign: 'center',
      }}>
        ← Select an operation from the sidebar
      </div>
    )
  }

  const hasInfo = !!OP_INFO[selectedOp.id]

  return (
    <div style={{
      padding: '16px 20px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Operation Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: selectedOp.moduleColor,
          boxShadow: `0 0 8px ${selectedOp.moduleColor}`,
        }} />
        <span style={{ fontWeight: 700, fontSize: 15, flex: 1, color: 'var(--text-primary)' }}>
          {selectedOp.label}
        </span>
        {hasInfo && (
          <button
            id="info-btn"
            onClick={() => onShowInfo(selectedOp.id)}
            title="View theory"
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: 'var(--accent-cyan)', fontSize: 13,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)' }}
          >ℹ</button>
        )}
      </div>

      {/* Parameters */}
      {selectedOp.params.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
          {selectedOp.params.map((p) => (
            <div key={p.key}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 6, fontSize: 12,
                color: 'var(--text-secondary)',
              }}>
                <label>{p.label}</label>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
                  {params[p.key] ?? p.default}
                </span>
              </div>
              {p.type === 'range' ? (
                <input
                  id={`param-${p.key}`}
                  type="range"
                  min={p.min} max={p.max} step={p.step}
                  value={params[p.key] ?? p.default}
                  onChange={e => updateParam(p.key, parseFloat(e.target.value))}
                />
              ) : p.type === 'select' ? (
                <select
                  id={`param-${p.key}`}
                  value={params[p.key] ?? p.default}
                  onChange={e => updateParam(p.key, isNaN(e.target.value) ? e.target.value : Number(e.target.value))}
                >
                  {p.options.map((opt, i) => (
                    <option key={opt} value={opt}>{p.labels ? p.labels[i] : opt}</option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          No parameters — ready to apply.
        </p>
      )}

      {/* Apply Button */}
      <button
        id="apply-btn"
        className="btn-primary"
        onClick={handleApply}
        disabled={loading}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {loading ? (
          <>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />
            Processing...
          </>
        ) : '▶ Apply Operation'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 10,
          padding: '8px 12px',
          borderRadius: 8,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171',
          fontSize: 12,
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}
