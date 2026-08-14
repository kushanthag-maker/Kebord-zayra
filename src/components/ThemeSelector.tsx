import React from 'react';
import { THEME_PRESETS } from '../data/layouts';
import { KeyAnimationEffect, SoundEffectType, ThemePreset } from '../types';
import { Sparkles, Volume2, Zap, Palette, Flame } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface ThemeSelectorProps {
  currentTheme: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
  currentSound: SoundEffectType;
  onSelectSound: (sound: SoundEffectType) => void;
  currentAnimation: KeyAnimationEffect;
  onSelectAnimation: (anim: KeyAnimationEffect) => void;
  rgbSpeed: number;
  onRgbSpeedChange: (speed: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  currentSound,
  onSelectSound,
  currentAnimation,
  onSelectAnimation,
  rgbSpeed,
  onRgbSpeedChange,
}) => {
  const soundOptions: { id: SoundEffectType; label: string; icon: string }[] = [
    { id: 'cherry-blue', label: 'Cherry MX Blue (Clicky)', icon: '⌨️' },
    { id: 'mechanical-thud', label: 'Cream Switch (Thock)', icon: '🧈' },
    { id: 'cyber-laser', label: 'Cyber Synth Laser', icon: '⚡' },
    { id: 'water-drop', label: 'Water Drop Bubble', icon: '💧' },
    { id: 'typewriter', label: 'Vintage Typewriter', icon: '📜' },
    { id: 'muted', label: 'Mute Audio', icon: '🔇' },
  ];

  const animationOptions: { id: KeyAnimationEffect; label: string; desc: string }[] = [
    { id: 'particle-spark', label: 'Sparks & Confetti', desc: 'Explosive particle burst on every tap' },
    { id: 'ripple-glow', label: 'Cyber Wave Ripple', desc: 'Concentric glowing waves around keys' },
    { id: 'laser-beam', label: 'Laser Blast', desc: 'Vertical neon light streak upward' },
    { id: 'keycap-pop', label: '3D Mechanical Spring', desc: 'Springy mechanical depth bounce' },
    { id: 'rgb-wave', label: 'RGB Chroma Wave', desc: 'Flowing continuous spectrum backlight' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 space-y-6 text-white shadow-xl">
      {/* Themes Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Keyboard Themes &amp; Lighting (RGB)
            </h3>
          </div>
          <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/30">
            {THEME_PRESETS.length} Ultra Themes
          </span>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {THEME_PRESETS.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                id={`theme-btn-${t.id}`}
                onClick={() => {
                  onSelectTheme(t.id);
                  soundSynth.play(currentSound);
                }}
                className={`group relative p-3 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-800/90 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div
                  className="w-full h-8 rounded-lg mb-2 flex items-center justify-center font-black text-xs tracking-wider shadow-inner"
                  style={{
                    backgroundColor: t.accentColor,
                    color: t.id === 'cyberpunk-neon' || t.id === 'emerald-glow' || t.id === 'amoled-gold' ? '#000' : '#fff',
                  }}
                >
                  {t.name.split(' ')[0]}
                </div>
                <div className="font-semibold text-xs text-slate-100 truncate">{t.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{t.category}</div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keystroke Animation Effect */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Keystroke Animation Effect</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {animationOptions.map((anim) => {
            const isSelected = currentAnimation === anim.id;
            return (
              <button
                key={anim.id}
                id={`anim-btn-${anim.id}`}
                onClick={() => {
                  onSelectAnimation(anim.id);
                  soundSynth.play(currentSound);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400/80 bg-amber-950/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{anim.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{anim.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mechanical Sound Switch Selector */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Mechanical Switch Audio Engine</h3>
          </div>
          <span className="text-xs text-purple-300">Live Synthesizer</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {soundOptions.map((snd) => {
            const isSelected = currentSound === snd.id;
            return (
              <button
                key={snd.id}
                id={`sound-btn-${snd.id}`}
                onClick={() => {
                  onSelectSound(snd.id);
                  soundSynth.play(snd.id);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-base">{snd.icon}</span>
                <span className="text-xs font-medium truncate">{snd.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RGB Chroma Speed Slider */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Chroma RGB Flow Speed:</span>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <span className="text-[10px] text-slate-400">Slow</span>
          <input
            type="range"
            id="rgb-speed-slider"
            min="1"
            max="10"
            value={rgbSpeed}
            onChange={(e) => onRgbSpeedChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] text-slate-400">Fast ({rgbSpeed}x)</span>
        </div>
      </div>
    </div>
  );
};
