import { SoundEffectType } from '../types';

class KeyboardSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private volume: number = 0.6;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public getVolume(): number {
    return this.volume;
  }

  public play(type: SoundEffectType) {
    if (type === 'muted' || this.volume <= 0) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'cherry-blue': {
          // Sharp tactile click + low bottom-out clack
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(1800, now);
          osc1.frequency.exponentialRampToValueAtTime(120, now + 0.025);

          gain1.gain.setValueAtTime(this.volume * 0.7, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.04);

          // Sub-click
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'square';
          osc2.frequency.setValueAtTime(3200, now);
          osc2.frequency.exponentialRampToValueAtTime(600, now + 0.015);
          gain2.gain.setValueAtTime(this.volume * 0.35, now);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now);
          osc2.stop(now + 0.025);
          break;
        }

        case 'mechanical-thud': {
          // Deep creamy thock
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

          gain.gain.setValueAtTime(this.volume * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.075);
          break;
        }

        case 'cyber-laser': {
          // Futuristic synth blip
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

          gain.gain.setValueAtTime(this.volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.065);
          break;
        }

        case 'water-drop': {
          // Bubble pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

          gain.gain.setValueAtTime(this.volume * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.055);
          break;
        }

        case 'typewriter': {
          // Vintage metallic strike
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(2400, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

          gain.gain.setValueAtTime(this.volume * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.055);
          break;
        }
      }
    } catch {
      // AudioContext might be restricted prior to user gesture
    }
  }

  public triggerHaptic(duration = 15) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Ignore haptic errors on unsupported devices
      }
    }
  }
}

export const soundSynth = new KeyboardSoundSynthesizer();
