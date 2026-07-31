import React from 'react';
import { Palette, Check, Sparkles, Leaf, Moon, Sun, Flame, Waves, Crown, Coffee, Eye, ShieldCheck, Zap } from 'lucide-react';

export default function ThemeSection({ currentTheme, onSelectTheme, lang = 'en' }) {
  const themes = [
    {
      id: 'emerald',
      name: 'Nature Oasis',
      tagline: 'Lush Forest & Organic Botanical Greens',
      icon: '🌿',
      iconComponent: Leaf,
      badge: 'Nature Special',
      badgeColor: '#10b981',
      palette: ['#062016', '#0b3424', '#10b981', '#34d399', '#f0fdf4'],
      previewBg: '#0b3424',
      previewText: '#f0fdf4',
      previewAccent: '#10b981',
      description: 'Soothing organic greens and forest tones designed for restful, high-focus document analysis.'
    },
    {
      id: 'light',
      name: 'Light Studio',
      tagline: 'Clean, Crisp Studio Canvas',
      icon: '☀️',
      iconComponent: Sun,
      badge: 'Classic',
      badgeColor: '#4f46e5',
      palette: ['#f8fafc', '#ffffff', '#4f46e5', '#6366f1', '#0f172a'],
      previewBg: '#ffffff',
      previewText: '#0f172a',
      previewAccent: '#4f46e5',
      description: 'High-contrast light interface optimized for daytime reading and clear typography.'
    },
    {
      id: 'midnight',
      name: 'Midnight Dark',
      tagline: 'Deep Obsidian & Eclipse Indigo',
      icon: '🌙',
      iconComponent: Moon,
      badge: 'Popular Dark',
      badgeColor: '#6366f1',
      palette: ['#0b0f19', '#111827', '#6366f1', '#818cf8', '#f8fafc'],
      previewBg: '#111827',
      previewText: '#f8fafc',
      previewAccent: '#6366f1',
      description: 'Sleek dark theme reducing eye strain during night-time editing sessions.'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      tagline: 'Electric Cyan & Magenta Neon Glow',
      icon: '🔮',
      iconComponent: Zap,
      badge: 'Futuristic',
      badgeColor: '#06b6d4',
      palette: ['#09090b', '#18181b', '#06b6d4', '#ec4899', '#f4f4f5'],
      previewBg: '#18181b',
      previewText: '#f4f4f5',
      previewAccent: '#06b6d4',
      description: 'High-energy cyberpunk aesthetic with glowing cyan accents and vibrant contrast.'
    },
    {
      id: 'sunset',
      name: 'Sunset Amber',
      tagline: 'Warm Gold & Crimson Twilight',
      icon: '🌅',
      iconComponent: Flame,
      badge: 'Warm Tone',
      badgeColor: '#f59e0b',
      palette: ['#1c1917', '#292524', '#f59e0b', '#fbbf24', '#fff7ed'],
      previewBg: '#292524',
      previewText: '#fff7ed',
      previewAccent: '#f59e0b',
      description: 'Warm evening spectrum creating a comfortable amber atmosphere for reading.'
    },
    {
      id: 'ocean',
      name: 'Ocean Deep',
      tagline: 'Deep Sapphire & Aqua Azure',
      icon: '🌊',
      iconComponent: Waves,
      badge: 'Calming',
      badgeColor: '#0ea5e9',
      palette: ['#0b1329', '#112240', '#0ea5e9', '#38bdf8', '#f0f9ff'],
      previewBg: '#112240',
      previewText: '#f0f9ff',
      previewAccent: '#0ea5e9',
      description: 'Tranquil deep ocean gradients bringing clarity and calm to document reviews.'
    },
    {
      id: 'royal',
      name: 'Royal Violet',
      tagline: 'Luxe Amethyst & Purple Velvet',
      icon: '💜',
      iconComponent: Crown,
      badge: 'Luxury',
      badgeColor: '#a855f7',
      palette: ['#140726', '#2e1065', '#a855f7', '#c084fc', '#faf5ff'],
      previewBg: '#2e1065',
      previewText: '#faf5ff',
      previewAccent: '#a855f7',
      description: 'Opulent violet palette providing a majestic experience for professional tools.'
    },
    {
      id: 'coffee',
      name: 'Coffee Roast',
      tagline: 'Warm Espresso & Toasted Cinnamon',
      icon: '☕',
      iconComponent: Coffee,
      badge: 'Cozy',
      badgeColor: '#d97706',
      palette: ['#171412', '#29231d', '#d97706', '#fbbf24', '#fef3c7'],
      previewBg: '#29231d',
      previewText: '#fef3c7',
      previewAccent: '#d97706',
      description: 'Rich coffee shop tones designed for warm, cozy document workspaces.'
    }
  ];

  const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="main-card theme-section-wrapper" style={{ transition: 'all 0.3s ease' }}>
      {/* Header Bar */}
      <div className="card-header-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <div className="card-title">
          <Palette size={22} style={{ color: currentThemeObj.previewAccent }} />
          <span>Studio Themes & Nature Customizer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-tag" style={{ background: currentThemeObj.previewAccent + '22', color: currentThemeObj.previewAccent, fontWeight: 700 }}>
            Active: {currentThemeObj.icon} {currentThemeObj.name}
          </span>
        </div>
      </div>

      {/* Nature Special Spotlight Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
        borderRadius: '16px',
        padding: '20px 24px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '14px' }}>
            <Leaf size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>
              🌿 Nature Oasis Theme (Organic Green Mode)
            </div>
            <div style={{ fontSize: '13.5px', opacity: 0.9, marginTop: '2px' }}>
              Switch to soothing botanical greens inspired by natural leaves and forests for reduced fatigue.
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectTheme('emerald')}
          style={{
            background: currentTheme === 'emerald' ? '#ffffff' : 'rgba(255,255,255,0.95)',
            color: '#064e3b',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          {currentTheme === 'emerald' ? (
            <>
              <Check size={18} color="#059669" /> Active Nature Theme
            </>
          ) : (
            <>
              <Sparkles size={18} color="#10b981" /> Activate Nature Theme
            </>
          )}
        </button>
      </div>

      {/* Grid of Theme Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '8px' }}>
        {themes.map((th) => {
          const isActive = currentTheme === th.id;
          const IconComp = th.iconComponent;

          return (
            <div
              key={th.id}
              onClick={() => onSelectTheme(th.id)}
              style={{
                background: isActive ? 'var(--sidebar-active-bg)' : 'var(--card-bg)',
                border: isActive ? `2px solid ${th.previewAccent}` : '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '18px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: isActive ? `0 8px 24px ${th.previewAccent}33` : 'none'
              }}
              className="theme-card-item"
            >
              {/* Card Top Title & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{th.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{th.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{th.tagline}</p>
                  </div>
                </div>

                {isActive && (
                  <span style={{
                    background: th.previewAccent,
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} />
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {th.description}
              </p>

              {/* Color Swatch Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>Palette:</span>
                {th.palette.map((color, i) => (
                  <span
                    key={i}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: color,
                      border: '1px solid rgba(0,0,0,0.15)',
                      display: 'inline-block'
                    }}
                    title={color}
                  />
                ))}
              </div>

              {/* Mini Interactive Preview Box */}
              <div style={{
                background: th.previewBg,
                color: th.previewText,
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '12px',
                border: `1px solid ${th.previewAccent}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '4px'
              }}>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconComp size={14} color={th.previewAccent} /> Preview Sample
                </span>
                <span style={{
                  background: th.previewAccent,
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  {isActive ? 'ACTIVE' : 'SELECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
