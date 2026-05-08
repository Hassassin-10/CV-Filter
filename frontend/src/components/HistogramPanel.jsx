import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler)

export default function HistogramPanel({ histogramData }) {
  const [open, setOpen] = useState(true)
  const [channel, setChannel] = useState('all')

  if (!histogramData) return null

  const labels = histogramData.labels

  const datasets = []
  if (channel === 'all' || channel === 'r') {
    datasets.push({
      label: 'Red',
      data: histogramData.r,
      backgroundColor: 'rgba(239,68,68,0.45)',
      borderColor: 'rgba(239,68,68,0.8)',
      borderWidth: 0,
      fill: true,
    })
  }
  if (channel === 'all' || channel === 'g') {
    datasets.push({
      label: 'Green',
      data: histogramData.g,
      backgroundColor: 'rgba(16,185,129,0.45)',
      borderColor: 'rgba(16,185,129,0.8)',
      borderWidth: 0,
      fill: true,
    })
  }
  if (channel === 'all' || channel === 'b') {
    datasets.push({
      label: 'Blue',
      data: histogramData.b,
      backgroundColor: 'rgba(59,130,246,0.45)',
      borderColor: 'rgba(59,130,246,0.8)',
      borderWidth: 0,
      fill: true,
    })
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11, family: 'Inter' }, boxWidth: 12, boxHeight: 12 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(13,21,40,0.95)',
        borderColor: 'rgba(99,179,237,0.2)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 8,
      },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.08)' },
      },
      y: {
        ticks: { color: '#475569', font: { size: 10 }, maxTicksLimit: 5 },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.08)' },
      },
    },
  }

  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid var(--border)',
      background: 'var(--bg-card)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        style={{
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: 'var(--text-secondary)' }}>
          📊 Pixel Histogram
        </span>
        {open && (
          <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
            {['all','r','g','b'].map(c => (
              <button key={c}
                id={`hist-${c}`}
                onClick={() => setChannel(c)}
                style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  cursor: 'pointer',
                  background: channel === c ? (c === 'r' ? '#ef4444' : c === 'g' ? '#10b981' : c === 'b' ? '#3b82f6' : 'var(--accent-cyan)') : 'rgba(255,255,255,0.06)',
                  color: channel === c ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  transition: 'all 0.15s',
                }}
              >{c.toUpperCase()}</button>
            ))}
          </div>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: 10, transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </div>

      {open && (
        <div style={{ height: 140, padding: '8px 12px 12px', animation: 'fadeIn 0.2s ease' }}>
          <Bar data={{ labels, datasets }} options={options} />
        </div>
      )}
    </div>
  )
}
