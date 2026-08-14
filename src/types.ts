export type KeyboardLayoutMode = 'qwerty' | 'singlish' | 'wijesekara' | 'symbols' | 'emojis' | 'fonts';

export type ThemePreset =
  | 'rgb-chroma'
  | 'cyberpunk-neon'
  | 'amoled-gold'
  | 'frost-glass'
  | 'cosmic-nebula'
  | 'vaporwave'
  | 'emerald-glow'
  | 'cherry-blossom';

export type SoundEffectType =
  | 'cherry-blue'
  | 'mechanical-thud'
  | 'cyber-laser'
  | 'water-drop'
  | 'typewriter'
  | 'muted';

export type KeyAnimationEffect =
  | 'rgb-wave'
  | 'particle-spark'
  | 'ripple-glow'
  | 'keycap-pop'
  | 'laser-beam';

export interface KeyDefinition {
  label: string;
  subLabel?: string;
  value: string;
  type?: 'char' | 'action' | 'modifier' | 'space' | 'switch';
  action?: 'backspace' | 'enter' | 'shift' | 'layout' | 'space' | 'ai' | 'emoji' | 'symbols' | 'clipboard' | 'sound';
  width?: string; // flex ratio or tailwind width
}

export interface KeyboardTheme {
  id: ThemePreset;
  name: string;
  category: string;
  bgGradient: string;
  boardBg: string;
  keyBg: string;
  keyBgActive: string;
  keyBorder: string;
  keyText: string;
  keySubText: string;
  actionKeyBg: string;
  actionKeyText: string;
  accentColor: string;
  glowColor: string;
  animationClass: string;
}

export interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  category?: 'phrase' | 'sinhala' | 'copied' | 'custom';
}

export interface AiActionOption {
  id: string;
  label: string;
  sinhalaLabel: string;
  iconName: string;
  description: string;
}
