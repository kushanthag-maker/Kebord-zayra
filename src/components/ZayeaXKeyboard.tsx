import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  KeyAnimationEffect,
  KeyboardLayoutMode,
  KeyboardTheme,
  KeyDefinition,
  SoundEffectType,
} from '../types';
import {
  QWERTY_ROWS,
  WIJESEKARA_ROWS,
  SYMBOLS_ROWS,
  EMOJI_CATEGORIES,
} from '../data/layouts';
import { soundSynth } from '../utils/audio';
import {
  Globe,
  Sparkles,
  Delete,
  CornerDownLeft,
  Smile,
  Type,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ZayeaXKeyboardProps {
  theme: KeyboardTheme;
  layoutMode: KeyboardLayoutMode;
  onChangeLayoutMode: (mode: KeyboardLayoutMode) => void;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  soundType: SoundEffectType;
  animationEffect: KeyAnimationEffect;
  rgbSpeed: number;
}

export const ZayeaXKeyboard: React.FC<ZayeaXKeyboardProps> = ({
  theme,
  layoutMode,
  onChangeLayoutMode,
  onKeyPress,
  onBackspace,
  onEnter,
  onSpace,
  soundType,
  animationEffect,
  rgbSpeed,
}) => {
  const [isShifted, setIsShifted] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState(soundType === 'muted');
  const [emojiCategoryIndex, setEmojiCategoryIndex] = useState(0);

  // Trigger Keystroke Visual Effects (Particles, Confetti, Laser)
  const triggerVisualEffect = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (animationEffect === 'particle-spark') {
        let x = 0.5;
        let y = 0.7;

        if (e && 'clientX' in e && e.clientX) {
          x = e.clientX / window.innerWidth;
          y = e.clientY / window.innerHeight;
        }

        confetti({
          particleCount: 15,
          spread: 45,
          startVelocity: 18,
          ticks: 35,
          origin: { x, y },
          colors: [theme.accentColor, '#00f2fe', '#f43f5e', '#a855f7', '#fbbf24'],
          disableForReducedMotion: true,
        });
      }
    },
    [animationEffect, theme.accentColor]
  );

  // Handle single key interaction
  const handleKeyInteraction = useCallback(
    (key: KeyDefinition, event?: React.MouseEvent | React.TouchEvent) => {
      // Audio & Haptic
      if (!soundMuted) {
        soundSynth.play(soundType);
      }
      soundSynth.triggerHaptic(18);
      triggerVisualEffect(event);

      setActiveKey(key.value || key.label);
      setTimeout(() => setActiveKey(null), 140);

      // Actions
      if (key.action === 'backspace') {
        onBackspace();
      } else if (key.action === 'enter') {
        onEnter();
      } else if (key.action === 'space') {
        onSpace();
      } else if (key.action === 'shift') {
        setIsShifted((prev) => !prev);
      } else if (key.action === 'layout') {
        if (key.value === 'singlish') {
          onChangeLayoutMode('singlish');
        } else if (key.value === 'qwerty') {
          onChangeLayoutMode('qwerty');
        } else if (key.value === 'wijesekara') {
          onChangeLayoutMode('wijesekara');
        }
      } else if (key.action === 'symbols') {
        onChangeLayoutMode(layoutMode === 'symbols' ? 'qwerty' : 'symbols');
      } else if (key.action === 'emoji') {
        onChangeLayoutMode(layoutMode === 'emojis' ? 'qwerty' : 'emojis');
      } else {
        // Regular character
        let out = key.value;
        if (isShifted) {
          out = key.subLabel || key.value.toUpperCase();
        }
        onKeyPress(out);
      }
    },
    [
      isShifted,
      layoutMode,
      onBackspace,
      onEnter,
      onKeyPress,
      onSpace,
      onChangeLayoutMode,
      soundMuted,
      soundType,
      triggerVisualEffect,
    ]
  );

  // Listen to physical hardware keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an external input element other than main textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          (document.activeElement.tagName === 'TEXTAREA' &&
            document.activeElement.id !== 'typing-sandbox-textarea'))
      ) {
        return;
      }

      if (!soundMuted) {
        soundSynth.play(soundType);
      }
      soundSynth.triggerHaptic(12);

      const k = e.key;
      setActiveKey(k);
      setTimeout(() => setActiveKey(null), 120);

      if (k === 'Backspace') {
        onBackspace();
      } else if (k === 'Enter') {
        onEnter();
      } else if (k === ' ') {
        onSpace();
      } else if (k === 'Shift') {
        setIsShifted(true);
      } else if (k.length === 1) {
        onKeyPress(k);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShifted(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [soundMuted, soundType, onBackspace, onEnter, onSpace, onKeyPress]);

  // Determine current key rows based on layout mode
  const getKeyRows = (): KeyDefinition[][] => {
    switch (layoutMode) {
      case 'wijesekara':
        return WIJESEKARA_ROWS;
      case 'symbols':
        return SYMBOLS_ROWS;
      case 'singlish':
      case 'qwerty':
      default:
        return QWERTY_ROWS;
    }
  };

  const rows = getKeyRows();

  return (
    <div
      className={`relative w-full rounded-3xl p-3 sm:p-5 transition-all duration-300 select-none ${theme.boardBg}`}
      style={{
        boxShadow: `0 0 40px ${theme.glowColor}, 0 20px 40px rgba(0,0,0,0.8)`,
      }}
    >
      {/* Dynamic Animated RGB Backlight Flow Underlay */}
      {theme.id === 'rgb-chroma' && (
        <div
          className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none blur-xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500 animate-rgb-flow"
          style={{ animationDuration: `${12 / rgbSpeed}s` }}
        />
      )}

      {/* Top Header / Mode Switch Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10 text-xs">
        {/* Layout Switch Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            id="layout-tab-qwerty"
            onClick={() => {
              onChangeLayoutMode('qwerty');
              soundSynth.play(soundType);
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              layoutMode === 'qwerty'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN (QWERTY)
          </button>

          <button
            id="layout-tab-singlish"
            onClick={() => {
              onChangeLayoutMode('singlish');
              soundSynth.play(soundType);
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              layoutMode === 'singlish'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇱🇰 Singlish
          </button>

          <button
            id="layout-tab-wijesekara"
            onClick={() => {
              onChangeLayoutMode('wijesekara');
              soundSynth.play(soundType);
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              layoutMode === 'wijesekara'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            විජේසේකර
          </button>

          <button
            id="layout-tab-symbols"
            onClick={() => {
              onChangeLayoutMode(layoutMode === 'symbols' ? 'qwerty' : 'symbols');
              soundSynth.play(soundType);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              layoutMode === 'symbols'
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ?123
          </button>

          <button
            id="layout-tab-emojis"
            onClick={() => {
              onChangeLayoutMode(layoutMode === 'emojis' ? 'qwerty' : 'emojis');
              soundSynth.play(soundType);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              layoutMode === 'emojis'
                ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(244,114,182,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            😊
          </button>
        </div>

        {/* Keyboard Branding & Audio Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-black tracking-widest text-cyan-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>ZAYEA X KEYBOARD</span>
          </div>

          <button
            id="toggle-sound-mute-btn"
            onClick={() => setSoundMuted(!soundMuted)}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundMuted
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={soundMuted ? 'Unmute Keyboard Audio' : 'Mute Keyboard Audio'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Keys Matrix OR Emoji Grid */}
      {layoutMode === 'emojis' ? (
        <div className="relative z-10 space-y-3 p-2">
          {/* Emoji Category Selector */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {EMOJI_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.name}
                id={`emoji-cat-${idx}`}
                onClick={() => setEmojiCategoryIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  emojiCategoryIndex === idx
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-white/10">
            {EMOJI_CATEGORIES[emojiCategoryIndex].emojis.map((em, idx) => (
              <button
                key={idx}
                id={`emoji-key-${idx}`}
                onClick={(e) => {
                  onKeyPress(em);
                  triggerVisualEffect(e);
                  if (!soundMuted) soundSynth.play('water-drop');
                }}
                className="h-11 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-110 active:scale-95 shadow-sm"
              >
                {em}
              </button>
            ))}
          </div>

          {/* Emoji Bottom Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              id="exit-emoji-btn"
              onClick={() => onChangeLayoutMode('qwerty')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Back to ABC
            </button>
            <button
              id="emoji-backspace-btn"
              onClick={onBackspace}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1"
            >
              <Delete className="w-4 h-4" />
              <span>Backspace</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 space-y-1.5 sm:space-y-2">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
              {row.map((key, keyIdx) => {
                const isSpecial =
                  key.type === 'action' || key.type === 'modifier' || key.type === 'switch';
                const isSpace = key.type === 'space';
                const isShiftKey = key.action === 'shift';
                const isActive = activeKey === key.value || activeKey === key.label;

                let displayLabel = key.label;
                if (isShifted && !isSpecial && key.subLabel) {
                  displayLabel = key.subLabel;
                } else if (isShifted && !isSpecial && key.label.length === 1) {
                  displayLabel = key.label.toUpperCase();
                }

                return (
                  <button
                    key={keyIdx}
                    id={`key-${rowIdx}-${keyIdx}`}
                    onMouseDown={(e) => handleKeyInteraction(key, e)}
                    onTouchStart={(e) => handleKeyInteraction(key, e)}
                    style={{
                      flex: key.width ? key.width.replace('flex-[', '').replace(']', '') : 1,
                    }}
                    className={`relative min-h-[46px] sm:min-h-[52px] rounded-xl flex flex-col items-center justify-center font-sans transition-all duration-100 transform active:scale-90 select-none overflow-hidden ${
                      isSpecial
                        ? `${theme.actionKeyBg} ${theme.actionKeyText}`
                        : isSpace
                        ? `${theme.keyBg} ${theme.keyText} font-bold tracking-wider`
                        : isActive
                        ? `${theme.keyBgActive}`
                        : `${theme.keyBg}`
                    } ${
                      isShiftKey && isShifted
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_15px_#06b6d4]'
                        : ''
                    } ${animationEffect === 'keycap-pop' ? 'hover:-translate-y-0.5' : ''}`}
                  >
                    {/* Keystroke ripple effect */}
                    {isActive && (
                      <span className="absolute inset-0 bg-white/30 rounded-xl animate-ping pointer-events-none" />
                    )}

                    {/* Laser Beam effect */}
                    {isActive && animationEffect === 'laser-beam' && (
                      <span className="absolute -top-12 inset-x-0 h-16 bg-gradient-to-t from-cyan-400 to-transparent blur-sm pointer-events-none animate-laser" />
                    )}

                    {/* Top sublabel (Shift preview) */}
                    {key.subLabel && !isSpecial && !isShifted && (
                      <span
                        className={`absolute top-1 right-1.5 text-[9px] font-mono leading-none ${theme.keySubText}`}
                      >
                        {key.subLabel}
                      </span>
                    )}

                    {/* Main Label */}
                    <span
                      className={`text-sm sm:text-base leading-none ${
                        isSpecial ? 'font-bold' : theme.keyText
                      }`}
                    >
                      {displayLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
