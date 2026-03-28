import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decodeScoreCard, getScoreRank } from '@/lib/scoring';
import { Droplets, Trophy, Flame, Target, Zap, ExternalLink } from 'lucide-react';

function Counter({ value, duration = 1500 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value <= 0) return;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setN(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return n;
}

export function SharedScorePage() {
  const [params] = useSearchParams();
  const [phase, setPhase] = useState(0);

  const data = useMemo(() => decodeScoreCard(params.get('d') || ''), [params]);

  useEffect(() => {
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 600);
    setTimeout(() => setPhase(3), 1100);
  }, []);

  if (!data) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'DM Sans', sans-serif", background: '#f8f9fa', color: '#1a1a2e' }}>
        <svg width="48" height="48" viewBox="0 0 64 64" style={{ marginBottom: 16, opacity: 0.3 }}>
          <circle cx="32" cy="32" r="30" fill="#3b82f6" opacity="0.15" />
          <path d="M32 14c0 0-14 14-14 24a14 14 0 0 0 28 0c0-10-14-24-14-24z" fill="#3b82f6" opacity="0.4" />
        </svg>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Card not found</h1>
        <p style={{ fontSize: 13, color: '#666', marginTop: 6 }}>This link may be invalid or expired</p>
        <a href="/" style={{ marginTop: 20, padding: '8px 20px', borderRadius: 12, background: '#4f46e5', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Try AquaPulse</a>
      </div>
    );
  }

  const rank = getScoreRank(data.s);
  const size = 140;
  const sw = 8;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = phase >= 2 ? c - (data.s / 100) * c : c;

  const stats = [
    { icon: '🔥', val: data.st, unit: 'day streak' },
    { icon: '🏆', val: data.ms, unit: 'best streak' },
    { icon: '🎯', val: data.g, unit: 'goals / 30' },
    { icon: '⚡', val: data.tl || '0', unit: 'liters total' },
  ];

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "'DM Sans', 'Outfit', sans-serif",
      background: '#0a0a0f', color: '#f0f0f5',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 340, borderRadius: 24,
        background: '#14141f', border: `1px solid ${rank.color}25`,
        boxShadow: `0 0 80px ${rank.color}08, 0 20px 40px rgba(0,0,0,0.4)`,
        overflow: 'hidden',
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
      }}>
        {/* Accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${rank.color}, ${rank.color}60, transparent)` }} />

        <div style={{ padding: '24px 20px 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${rank.color}, ${rank.color}80)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#fff',
                fontFamily: "'Outfit', sans-serif",
              }}>
                {data.n?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{data.n}</div>
                <div style={{ fontSize: 10, color: '#666', letterSpacing: '0.05em' }}>HYDRATION ACHIEVEMENT</div>
              </div>
            </div>
            <div style={{
              padding: '3px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700,
              background: `${rank.color}15`, color: rank.color, letterSpacing: '0.03em',
            }}>
              {rank.emoji} {rank.label}
            </div>
          </div>

          {/* Score ring */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px', position: 'relative' }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', width: 100, height: 100, borderRadius: '50%',
              background: rank.color, filter: 'blur(40px)',
              opacity: phase >= 2 ? 0.12 : 0, transition: 'opacity 1s ease',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />
            <div style={{ position: 'relative', width: size, height: size }}>
              <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e1e2a" strokeWidth={sw} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                  stroke={rank.color} strokeWidth={sw} strokeLinecap="round"
                  strokeDasharray={c} strokeDashoffset={offset}
                  style={{
                    transition: 'stroke-dashoffset 1.8s cubic-bezier(0.23, 1, 0.32, 1)',
                    filter: `drop-shadow(0 0 8px ${rank.color}40)`,
                  }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{rank.emoji}</span>
                <span style={{
                  fontSize: 44, fontWeight: 900, fontFamily: "'Outfit', sans-serif",
                  color: rank.color, lineHeight: 1, letterSpacing: '-0.03em',
                }}>
                  {rank.rank}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#888', fontFamily: "'Outfit', sans-serif" }}>
                  <Counter value={data.s} /> pts
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16,
            opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          }}>
            {stats.map((s) => (
              <div key={s.unit} style={{
                padding: '10px 12px', borderRadius: 12, background: '#1a1a28',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.unit}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Goal bar */}
          <div style={{
            padding: '10px 14px', borderRadius: 12, background: '#1a1a28',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
            opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.5s ease 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13 }}>💧</span>
              <span style={{ fontSize: 10, color: '#888' }}>Daily Goal</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
              {data.gl}<span style={{ fontSize: 10, color: '#666', marginLeft: 2 }}>ml</span>
            </span>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 12, borderTop: '1px solid #1e1e2a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="#3b82f6" />
                <path d="M32 14c0 0-14 14-14 24a14 14 0 0 0 28 0c0-10-14-24-14-24z" fill="white" opacity="0.9" />
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#666' }}>AquaPulse</span>
            </div>
            <span style={{ fontSize: 9, color: '#555' }}>{data.d}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        width: '100%', maxWidth: 340, marginTop: 16, textAlign: 'center',
        opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
      }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', padding: '12px', borderRadius: 14,
          background: `linear-gradient(135deg, ${rank.color}, ${rank.color}bb)`,
          color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600,
          boxShadow: `0 4px 20px ${rank.color}30`,
        }}>
          💧 Track Your Hydration — Free
        </a>
        <p style={{ fontSize: 9, color: '#555', marginTop: 8 }}>
          Made by <a href="https://1619.in" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>1619.in</a>
        </p>
      </div>
    </div>
  );
}
