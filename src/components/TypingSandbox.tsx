import React, { useEffect, useState, useRef } from 'react';
import {
  Volume2,
  Copy,
  Trash2,
  Sparkles,
  Check,
  RotateCcw,
  Gauge,
  FileText,
  Languages,
} from 'lucide-react';
import { convertSinglishToSinhala, getSinglishWordSuggestions } from '../utils/singlishConverter';
import { soundSynth } from '../utils/audio';

interface TypingSandboxProps {
  text: string;
  onChangeText: (text: string) => void;
  layoutMode: string;
  onSelectSuggestion: (word: string) => void;
}

export const TypingSandbox: React.FC<TypingSandboxProps> = ({
  text,
  onChangeText,
  layoutMode,
  onSelectSuggestion,
}) => {
  const [copied, setCopied] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Real-time Singlish suggestions
  const words = text.split(/\s+/);
  const lastWord = words[words.length - 1] || '';
  const suggestions = layoutMode === 'singlish' && lastWord ? getSinglishWordSuggestions(lastWord) : [];
  const realtimeSinhalaPreview = layoutMode === 'singlish' ? convertSinglishToSinhala(text) : '';

  useEffect(() => {
    if (text.length > 0 && !startTime) {
      setStartTime(Date.now());
    } else if (text.length === 0) {
      setStartTime(null);
      setWpm(0);
    }

    if (startTime && text.length > 0) {
      const minutes = (Date.now() - startTime) / 60000;
      if (minutes > 0.05) {
        const calculatedWpm = Math.round(wordCount / minutes);
        setWpm(calculatedWpm);
      }
    }
  }, [text, startTime, wordCount]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundSynth.play('cherry-blue');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChangeText('');
    setStartTime(null);
    setWpm(0);
    soundSynth.play('mechanical-thud');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSpeak = () => {
    if (!text.trim() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;

    // Detect if text contains Sinhala unicode characters
    const hasSinhala = /[\u0D80-\u0DFF]/.test(text);
    utterance.lang = hasSinhala ? 'si-LK' : 'en-US';

    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/25 rounded-2xl p-4 sm:p-5 text-white shadow-2xl space-y-3">
      {/* Top Header with Live Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            <span>ZAYEA X Live Typing Sandbox</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30 uppercase">
              {layoutMode}
            </span>
          </h3>
        </div>

        {/* Speed and Count Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-bold text-cyan-300">{wpm}</span>
            <span className="text-[10px] text-slate-400">WPM</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-bold text-indigo-300">{wordCount}</span>
            <span className="text-[10px] text-slate-400">words</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="font-mono text-slate-300">{charCount}</span>
            <span className="text-[10px] text-slate-400 ml-1">chars</span>
          </div>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="typing-sandbox-textarea"
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={
            layoutMode === 'singlish'
              ? 'ටයිප් කරන්න... (e.g., oyaata kohomada -> ඔයාට කොහොමද, subha davasak -> සුභ දවසක්)'
              : layoutMode === 'wijesekara'
              ? 'විජේසේකර යතුරුපුවරුවෙන් ටයිප් කරන්න...'
              : 'Type here with animated keyboard or hardware keys...'
          }
          className="w-full h-28 sm:h-32 bg-slate-950/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl p-3.5 text-base sm:text-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-none font-sans leading-relaxed shadow-inner"
        />

        {/* Real-time Singlish Phonetic Live Preview Badge */}
        {layoutMode === 'singlish' && realtimeSinhalaPreview && (
          <div className="mt-2 p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Languages className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs text-indigo-200 font-semibold truncate">
                {realtimeSinhalaPreview}
              </span>
            </div>
            <button
              id="apply-singlish-preview-btn"
              onClick={() => {
                onChangeText(realtimeSinhalaPreview);
                soundSynth.play('cherry-blue');
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex-shrink-0 transition-all shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            >
              Apply Sinhala
            </button>
          </div>
        )}
      </div>

      {/* Live Phonetic Suggestions Strip */}
      {suggestions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Suggestions:
          </span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              id={`sug-btn-${idx}`}
              onClick={() => onSelectSuggestion(sug)}
              className="px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-semibold rounded-lg transition-all shadow-sm flex-shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            id="speak-text-btn"
            onClick={handleSpeak}
            disabled={!text.trim()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              speaking
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 disabled:opacity-40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{speaking ? 'Speaking...' : 'Listen TTS'}</span>
          </button>

          <button
            id="copy-text-btn"
            onClick={handleCopy}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>

        <button
          id="clear-text-btn"
          onClick={handleClear}
          disabled={!text.trim()}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-medium transition-all disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
