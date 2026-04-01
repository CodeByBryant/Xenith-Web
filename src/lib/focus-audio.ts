// ═══════════════════════════════════════════════════════════════════════
// Focus Timer Audio Player
// Generates white/brown noise and plays ambient sounds
// ═══════════════════════════════════════════════════════════════════════

export type AudioType = "none" | "white-noise" | "brown-noise" | "rain" | "lofi";

class FocusAudioPlayer {
  private audioContext: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private currentType: AudioType = "none";
  private htmlAudio: HTMLAudioElement | null = null;

  get isPlaying() {
    return this.currentType !== "none";
  }

  get activeType() {
    return this.currentType;
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
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    const urls: Record<string, string> = {
      rain: "https://cdn.pixabay.com/download/audio/2022/05/13/audio_257112e87f.mp3",
      lofi: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4deaa55a5f.mp3",
    };

    const url = urls[type];
    if (!url) return;

    this.htmlAudio = new Audio(url);
    this.htmlAudio.loop = true;
    this.htmlAudio.volume = volume;
    this.htmlAudio.play().catch((error) => {
      console.error("Failed to play ambient audio:", error);
    });
  }

  stop() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
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
