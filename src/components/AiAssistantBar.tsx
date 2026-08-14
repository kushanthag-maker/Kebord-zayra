import React, { useState } from 'react';
import { Bot, Sparkles, Languages, Check, Copy, Wand2, MessageSquare, RefreshCw } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface AiAssistantBarProps {
  currentText: string;
  onApplyText: (text: string) => void;
  onAppendText: (text: string) => void;
}

export const AiAssistantBar: React.FC<AiAssistantBarProps> = ({
  currentText,
  onApplyText,
  onAppendText,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAiAction = async (action: string, promptText?: string) => {
    const textToProcess = promptText || currentText;
    if (!textToProcess.trim()) return;

    setLoading(true);
    setActiveAction(action);
    setResult(null);
    soundSynth.play('cyber-laser');

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToProcess,
          action,
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        setResult(data.text.trim());
      } else {
        setResult(data.fallback || 'Unable to generate response.');
      }
    } catch {
      setResult('Network error or server busy. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 text-white shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              ZAYEA X AI Smart Typing Assistant
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <p className="text-[11px] text-slate-400">Sinhala/English Translation, Tone Switch &amp; Replies</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>

      {/* Quick Action Pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          id="ai-btn-si-en"
          onClick={() => handleAiAction('translate_to_sinhala')}
          disabled={loading || !currentText.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-xs font-medium text-indigo-200 transition-all disabled:opacity-50"
        >
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>To Sinhala (සිංහලට)</span>
        </button>

        <button
          id="ai-btn-en-si"
          onClick={() => handleAiAction('translate_to_english')}
          disabled={loading || !currentText.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-xs font-medium text-indigo-200 transition-all disabled:opacity-50"
        >
          <Languages className="w-3.5 h-3.5 text-amber-400" />
          <span>To English</span>
        </button>

        <button
          id="ai-btn-rephrase-polite"
          onClick={() => handleAiAction('rephrase_friendly')}
          disabled={loading || !currentText.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all disabled:opacity-50"
        >
          <Wand2 className="w-3.5 h-3.5 text-pink-400" />
          <span>Polite &amp; Warm</span>
        </button>

        <button
          id="ai-btn-rephrase-formal"
          onClick={() => handleAiAction('rephrase_formal')}
          disabled={loading || !currentText.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Formal Tone</span>
        </button>

        <button
          id="ai-btn-smart-reply"
          onClick={() => handleAiAction('smart_reply')}
          disabled={loading || !currentText.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all disabled:opacity-50"
        >
          <MessageSquare className="w-3.5 h-3.5 text-yellow-400" />
          <span>Auto Reply Ideas</span>
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-slate-950/80 border border-indigo-500/40 rounded-xl p-3 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-indigo-300">
              AI Suggestion ({activeAction?.replace('_', ' ')})
            </span>
            <div className="flex items-center gap-2">
              <button
                id="ai-copy-result-btn"
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                id="ai-apply-result-btn"
                onClick={() => onApplyText(result)}
                className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px]"
              >
                Replace Text
              </button>
              <button
                id="ai-append-result-btn"
                onClick={() => onAppendText(' ' + result)}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-[10px]"
              >
                Append
              </button>
            </div>
          </div>
          <div className="text-sm text-slate-100 whitespace-pre-wrap font-sans leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
