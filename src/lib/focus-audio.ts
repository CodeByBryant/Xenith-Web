// ═══════════════════════════════════════════════════════════════════════
// Focus Timer Audio Player
// Generates white/brown noise and plays ambient sounds
// ═══════════════════════════════════════════════════════════════════════

import { toast } from "sonner";

export type AudioType = "none" | "white-noise" | "brown-noise" | "rain" | "lofi";

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

class FocusAudioPlayer {
  private audioContext: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private currentType: AudioType = "none";
  private htmlAudio: HTMLAudioElement | null = null;

  get isPlaying() {
    return this.currentType !== "none";
  }

  get activeType() {
    return this.currentType;
  }

  private createAudioContext() {
    const AudioContextCtor =
      window.AudioContext || (window as WindowWithWebkitAudioContext).webkitAudioContext;
    if (!AudioContextCtor) {
      throw new Error("Web Audio API is not supported in this browser");
    }
    return new AudioContextCtor();
  }

  async play(type: AudioType, volume: number = 0.3) {
    this.stop();
    
    if (type === "none") return;
    
    this.currentType = type;

    if (type === "white-noise" || type === "brown-noise") {
      this.playNoise(type, volume);
    } else {
      this.playAmbient(type, volume);
    }
  }

  private playNoise(type: "white-noise" | "brown-noise", volume: number) {
    try {
      this.audioContext = this.createAudioContext();
      const ctx = this.audioContext;
      
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === "white-noise") {
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      } else {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
        }
      }

      this.noiseNode = ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.gainNode = ctx.createGain();
      this.gainNode.gain.value = volume;

      this.noiseNode.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);
      this.noiseNode.start(0);
    } catch (error) {
      console.error("Failed to play noise:", error);
    }
  }

  private playAmbient(type: "rain" | "lofi", volume: number) {
    // Use license-free audio from freesound or generate continuous noise
    // For now, we'll just generate continuous noise for rain
    if (type === "rain") {
      // Generate rain-like noise (filtered white noise)
      try {
        this.audioContext = this.createAudioContext();
        const ctx = this.audioContext;
        
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate filtered white noise for rain effect
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.5;
        }

        this.noiseNode = ctx.createBufferSource();
        this.noiseNode.buffer = buffer;
        this.noiseNode.loop = true;

        // Add low-pass filter for rain effect
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 2000;

        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = volume * 0.6;

        this.noiseNode.connect(filter);
        filter.connect(this.gainNode);
        this.gainNode.connect(ctx.destination);
        this.noiseNode.start(0);
      } catch (error) {
        console.error("Failed to play rain audio:", error);
        toast.error("Audio playback not supported");
      }
    } else if (type === "lofi") {
      // For lofi, we'll generate a simple ambient tone
      try {
        this.audioContext = this.createAudioContext();
        const ctx = this.audioContext;
        
        // Create oscillators for ambient sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.value = 220; // A3
        osc2.frequency.value = 330; // E4
        
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = volume * 0.1;
        
        osc1.connect(this.gainNode);
        osc2.connect(this.gainNode);
        this.gainNode.connect(ctx.destination);
        
        osc1.start(0);
        osc2.start(0);
        
        // Store reference to stop later
        this.oscillators = [osc1, osc2];
      } catch (error) {
        console.error("Failed to play lofi audio:", error);
        toast.error("Audio playback not supported");
      }
    }
  }

  stop() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }

    if (this.oscillators.length > 0) {
      this.oscillators.forEach((osc) => {
        osc.stop();
        osc.disconnect();
      });
      this.oscillators = [];
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio = null;
    }

    this.currentType = "none";
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = volume;
    }
  }
}

export const focusAudioPlayer = new FocusAudioPlayer();
