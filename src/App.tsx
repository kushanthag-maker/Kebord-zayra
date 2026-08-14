import React, { useState } from 'react';
import {
  KeyboardLayoutMode,
  ThemePreset,
  SoundEffectType,
  KeyAnimationEffect,
} from './types';
import { THEME_PRESETS } from './data/layouts';
import { ZayeaXKeyboard } from './components/ZayeaXKeyboard';
import { TypingSandbox } from './components/TypingSandbox';
import { ThemeSelector } from './components/ThemeSelector';
import { AiAssistantBar } from './components/AiAssistantBar';
import { ClipboardAndSnippets } from './components/ClipboardAndSnippets';
import { FancyFontPicker } from './components/FancyFontPicker';
import { AndroidExportModal } from './components/AndroidExportModal';
import { convertSinglishToSinhala } from './utils/singlishConverter';
import {
  Download,
  Sparkles,
  Bot,
  Type,
  Clipboard,
  Palette,
  Github,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { soundSynth } from './utils/audio';

export default function App() {
  const [typedText, setTypedText] = useState('');
  const [currentThemeId, setCurrentThemeId] = useState<ThemePreset>('rgb-chroma');
  const [layoutMode, setLayoutMode] = useState<KeyboardLayoutMode>('singlish');
  const [soundType, setSoundType] = useState<SoundEffectType>('cherry-blue');
  const [animationEffect, setAnimationEffect] = useState<KeyAnimationEffect>('particle-spark');
  const [rgbSpeed, setRgbSpeed] = useState<number>(4);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<'themes' | 'ai' | 'clipboard' | 'fonts'>('themes');

  const currentTheme =
    THEME_PRESETS.find((t) => t.id === currentThemeId) || THEME_PRESETS[0];

  // Character typed handler
  const handleKeyPress = (char: string) => {
    setTypedText((prev) => prev + char);
  };

  // Backspace handler
  const handleBackspace = () => {
    setTypedText((prev) => (prev.length > 0 ? prev.slice(0, -1) : ''));
  };

  // Enter / newline handler
  const handleEnter = () => {
    setTypedText((prev) => prev + '\n');
  };

  // Space handler with Singlish auto-conversion if in Singlish mode
  const handleSpace = () => {
    if (layoutMode === 'singlish') {
      // Convert the last word to Sinhala automatically upon pressing space
      const words = typedText.split(/(\s+)/);
      if (words.length > 0) {
        const lastWord = words[words.length - 1];
        if (lastWord && lastWord.trim().length > 0) {
          const converted = convertSinglishToSinhala(lastWord);
          words[words.length - 1] = converted;
          setTypedText(words.join('') + ' ');
          return;
        }
      }
    }
    setTypedText((prev) => prev + ' ');
  };

  // Suggestion selected
  const handleSelectSuggestion = (word: string) => {
    const words = typedText.split(/\s+/);
    words[words.length - 1] = word;
    setTypedText(words.join(' ') + ' ');
    soundSynth.play('cherry-blue');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient} text-slate-100 flex flex-col font-sans transition-all duration-500`}
    >
      {/* Top Cyber Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center font-black text-slate-950 text-base shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                ZX
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wider text-white">
                  ZAYEA <span className="text-cyan-400">X</span>
                </h1>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Next-Gen Animated Sinhala &amp; RGB Custom Keyboard
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🇱🇰 Sinhala &amp; Singlish Live</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Section 1: Live Interactive Typing Sandbox */}
        <section id="typing-sandbox-section">
          <TypingSandbox
            text={typedText}
            onChangeText={setTypedText}
            layoutMode={layoutMode}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </section>

        {/* Section 2: ZAYEA X Animated Virtual Keyboard */}
        <section id="keyboard-surface-section">
          <ZayeaXKeyboard
            theme={currentTheme}
            layoutMode={layoutMode}
            onChangeLayoutMode={setLayoutMode}
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onEnter={handleEnter}
            onSpace={handleSpace}
            soundType={soundType}
            animationEffect={animationEffect}
            rgbSpeed={rgbSpeed}
          />
        </section>

        {/* Section 3: Feature Studio Hub (Themes, AI Assistant, Clipboard, Fancy Fonts) */}
        <section id="feature-hub-section" className="space-y-4">
          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl overflow-x-auto">
            <button
              id="hub-tab-themes"
              onClick={() => setActivePanelTab('themes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activePanelTab === 'themes'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Themes &amp; RGB Lighting</span>
            </button>

            <button
              id="hub-tab-ai"
              onClick={() => setActivePanelTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activePanelTab === 'ai'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>ZAYEA X AI Assistant</span>
            </button>

            <button
              id="hub-tab-clipboard"
              onClick={() => setActivePanelTab('clipboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activePanelTab === 'clipboard'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Phrases &amp; Clipboard</span>
            </button>

            <button
              id="hub-tab-fonts"
              onClick={() => setActivePanelTab('fonts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activePanelTab === 'fonts'
                  ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Fancy Fonts</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div>
            {activePanelTab === 'themes' && (
              <ThemeSelector
                currentTheme={currentThemeId}
                onSelectTheme={setCurrentThemeId}
                currentSound={soundType}
                onSelectSound={setSoundType}
                currentAnimation={animationEffect}
                onSelectAnimation={setAnimationEffect}
                rgbSpeed={rgbSpeed}
                onRgbSpeedChange={setRgbSpeed}
              />
            )}

            {activePanelTab === 'ai' && (
              <AiAssistantBar
                currentText={typedText}
                onApplyText={setTypedText}
                onAppendText={(t) => setTypedText((prev) => prev + t)}
              />
            )}

            {activePanelTab === 'clipboard' && (
              <ClipboardAndSnippets
                onInsertText={(phrase) => setTypedText((prev) => prev + (prev ? ' ' : '') + phrase)}
              />
            )}

            {activePanelTab === 'fonts' && (
              <FancyFontPicker
                currentText={typedText}
                onApplyFont={(formatted) => setTypedText(formatted)}
              />
            )}
          </div>
        </section>

        {/* Section 4: Quick Android 1-Minute APK Banner */}
        <section className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Export Ready-to-Build Android Source &amp; GitHub Actions
              </h3>
              <p className="text-xs text-slate-300">
                Push to GitHub repo → GitHub Actions automatically builds and uploads the debug APK in ~1 min!
              </p>
            </div>
          </div>

          <button
            id="banner-open-export-modal-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Open APK Exporter</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>⚡ ZAYEA X Keyboard • Next-Gen Animated Android &amp; Web Keyboard Studio</span>
          <span className="text-slate-400">Sinhala (සිංහල), Singlish &amp; English QWERTY</span>
        </div>
      </footer>

      {/* Export Android Project & GitHub Workflow Modal */}
      <AndroidExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeThemeName={currentTheme.name}
      />
    </div>
  );
}
