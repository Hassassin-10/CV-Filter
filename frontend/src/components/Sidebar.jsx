import { useState } from 'react'
import { MODULES } from '../data/operations'

export default function Sidebar({ selectedOp, onSelectOp, hasImage }) {
  const [openModules, setOpenModules] = useState({ basic: true })

  const toggleModule = (id) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside style={{
      width: 272,
      minWidth: 272,
      height: '100vh',
      overflowY: 'auto',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>🔬</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>CV Filter</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Vision Lab</div>
          </div>
        </div>
      </div>

      {/* Operations Tree */}
      <div style={{ padding: '12px 0', flex: 1 }}>
        {!hasImage && (
          <div style={{
            margin: '4px 12px 12px',
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.15)',
            fontSize: 12,
            color: 'var(--text-secondary)',
          }}>
            ↑ Upload an image to enable operations
          </div>
        )}

        {MODULES.map((mod) => (
          <div key={mod.id} style={{ marginBottom: 2 }}>
            {/* Module Header */}
            <button
              onClick={() => toggleModule(mod.id)}
              disabled={!hasImage}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                cursor: hasImage ? 'pointer' : 'default',
                color: hasImage ? 'var(--text-primary)' : 'var(--text-muted)',
                textAlign: 'left',
                transition: 'all 0.2s',
                borderRadius: 0,
              }}
              onMouseEnter={e => { if (hasImage) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: hasImage ? `${mod.color}18` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hasImage ? mod.color + '30' : 'transparent'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>{mod.icon}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{mod.label}</span>
              <span style={{
                fontSize: 10, color: 'var(--text-muted)',
                transform: openModules[mod.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}>▶</span>
            </button>

            {/* Groups and Ops */}
            {openModules[mod.id] && hasImage && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                {mod.groups.map((grp) => (
                  <div key={grp.label}>
                    <div style={{
                      padding: '6px 16px 4px 48px',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}>{grp.label}</div>
                    {grp.ops.map((op) => {
                      const isActive = selectedOp?.id === op.id && selectedOp?.moduleId === mod.id
                      return (
                        <button
                          key={op.id}
                          id={`op-${op.id}`}
                          onClick={() => onSelectOp({ ...op, moduleId: mod.id, moduleColor: mod.color })}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '7px 16px 7px 48px',
                            background: isActive
                              ? `${mod.color}18`
                              : 'none',
                            border: 'none',
                            borderRight: isActive ? `3px solid ${mod.color}` : '3px solid transparent',
                            cursor: 'pointer',
                            color: isActive ? mod.color : 'var(--text-secondary)',
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                            textAlign: 'left',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' } }}
                          onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none' } }}
                        >
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                            background: isActive ? mod.color : 'var(--text-muted)',
                          }} />
                          {op.label}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border)',
        fontSize: 11,
        color: 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        CV Filter · Computer Vision Lab<br/>
        Flask + OpenCV + React
      </div>
    </aside>
  )
}
