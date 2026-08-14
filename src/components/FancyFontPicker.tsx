import React, { useState } from 'react';
import { transformToFancyFont } from '../data/layouts';
import { Sparkles, Copy, Check, Type } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface FancyFontPickerProps {
  currentText: string;
  onApplyFont: (text: string) => void;
}

export const FancyFontPicker: React.FC<FancyFontPickerProps> = ({ currentText, onApplyFont }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const sample = currentText.trim() || 'ZAYEA X Cyber';

  const fontStyles = [
    { key: 'sansBold', name: 'Sans Bold (Heavy)', preview: transformToFancyFont(sample, 'sansBold') },
    { key: 'bold', name: 'Serif Bold (Classic)', preview: transformToFancyFont(sample, 'bold') },
    { key: 'script', name: 'Script / Cursive (Elegant)', preview: transformToFancyFont(sample, 'script') },
    { key: 'gothic', name: 'Gothic / Fraktur (Dark)', preview: transformToFancyFont(sample, 'gothic') },
    { key: 'cyberMono', name: 'Cyber Monospace (Code)', preview: transformToFancyFont(sample, 'cyberMono') },
    { key: 'bubbles', name: 'Circled Bubbles (Aesthetic)', preview: transformToFancyFont(sample, 'bubbles') },
    { key: 'italic', name: 'Italic Slanted', preview: transformToFancyFont(sample, 'italic') },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundSynth.play('cherry-blue');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 text-white shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Fancy Bio &amp; Gaming Fonts (විශේෂ අකුරු මෝස්තර)
          </h3>
        </div>
        <span className="text-xs text-pink-300">Live Converter</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {fontStyles.map((item) => {
          const isCopied = copiedKey === item.key;
          return (
            <div
              key={item.key}
              className="bg-slate-950/70 border border-slate-800 hover:border-pink-500/40 rounded-xl p-2.5 flex items-center justify-between gap-2 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400">{item.name}</div>
                <div className="text-sm text-pink-200 truncate font-mono select-all">
                  {item.preview}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id={`apply-font-${item.key}`}
                  onClick={() => {
                    onApplyFont(item.preview);
                    soundSynth.play('cherry-blue');
                  }}
                  className="px-2 py-1 bg-pink-950/60 hover:bg-pink-900 border border-pink-500/30 text-pink-300 text-[10px] font-semibold rounded-lg"
                >
                  Insert
                </button>
                <button
                  id={`copy-font-${item.key}`}
                  onClick={() => handleCopy(item.preview, item.key)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
