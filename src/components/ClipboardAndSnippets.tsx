import React, { useState } from 'react';
import { ClipboardItem } from '../types';
import { Clipboard, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface ClipboardAndSnippetsProps {
  onInsertText: (text: string) => void;
}

const DEFAULT_PHRASES: ClipboardItem[] = [
  { id: '1', text: 'ස්තූතියි! (Thank you!)', timestamp: Date.now(), category: 'sinhala' },
  { id: '2', text: 'සුභ දවසක් වේවා! 🌸', timestamp: Date.now(), category: 'sinhala' },
  { id: '3', text: 'කොහොමද යාලුවේ?', timestamp: Date.now(), category: 'sinhala' },
  { id: '4', text: 'හරි, මම ඉක්මනින් එවන්නම්.', timestamp: Date.now(), category: 'sinhala' },
  { id: '5', text: 'මම දැන් වැඩක ඉන්නේ, පස්සේ කතා කරමු.', timestamp: Date.now(), category: 'sinhala' },
  { id: '6', text: 'Yes, absolutely! Let me check and update you.', timestamp: Date.now(), category: 'phrase' },
  { id: '7', text: 'Call me when you are free.', timestamp: Date.now(), category: 'phrase' },
  { id: '8', text: 'ZAYEA X Next-Gen Keyboard ⚡', timestamp: Date.now(), category: 'phrase' },
];

export const ClipboardAndSnippets: React.FC<ClipboardAndSnippetsProps> = ({ onInsertText }) => {
  const [items, setItems] = useState<ClipboardItem[]>(DEFAULT_PHRASES);
  const [newText, setNewText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      text: newText.trim(),
      timestamp: Date.now(),
      category: 'custom',
    };

    setItems([newItem, ...items]);
    setNewText('');
    soundSynth.play('cherry-blue');
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSelect = (item: ClipboardItem) => {
    onInsertText(item.text);
    setCopiedId(item.id);
    soundSynth.play('cherry-blue');
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clipboard className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Clipboard &amp; Quick Phrases (ක්ලිප්බෝර්ඩ් සහ කෙටි වැකි)
          </h3>
        </div>
        <span className="text-xs text-slate-400">{items.length} Phrases</span>
      </div>

      {/* Add Custom Snippet */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          id="custom-snippet-input"
          placeholder="Add custom phrase / අලුත් කෙටි වැකියක්..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          id="add-snippet-btn"
          disabled={!newText.trim()}
          className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </form>

      {/* Snippet Badges Grid */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
        {items.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                item.category === 'sinhala'
                  ? 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400 text-indigo-100'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 text-slate-200'
              }`}
            >
              <button
                id={`snippet-btn-${item.id}`}
                onClick={() => handleSelect(item)}
                className="flex items-center gap-1.5 text-left"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                )}
                <span className="truncate max-w-[220px]">{item.text}</span>
              </button>

              {item.category === 'custom' && (
                <button
                  id={`delete-snippet-${item.id}`}
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors ml-1 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
