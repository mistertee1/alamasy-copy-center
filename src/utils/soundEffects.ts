// Audio notification utilities using Web Audio API synthesis
// No external mp3 files required - works offline and across all browsers reliably

const SOUND_PREF_KEY = 'naeem_sound_notifications_enabled';

/**
 * Check if sound notifications are enabled by the user (default: true)
 */
export function isSoundNotificationEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(SOUND_PREF_KEY);
    return val !== null ? val === 'true' : true;
  } catch {
    return true;
  }
}

/**
 * Update sound notifications preference
 */
export function setSoundNotificationEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
  } catch (err) {
    console.warn('Could not save sound preference:', err);
  }
}

/**
 * Synthesizes musical sound effects using Web Audio API
 */
export function playNotificationSound(type: 'ready_for_pickup' | 'processing' | 'reviewing' | 'completed' | 'test' = 'ready_for_pickup'): boolean {
  if (typeof window === 'undefined') return false;
  if (!isSoundNotificationEnabled()) return false;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return false;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === 'ready_for_pickup' || type === 'test') {
      // Cheerful, crystal-clear celebratory chime:
      // Ascending musical arpeggio: F5 (698Hz) -> A5 (880Hz) -> C6 (1046.5Hz) -> F6 (1397Hz)
      const notes = [
        { freq: 698.46, time: 0, duration: 0.18, gain: 0.22 },
        { freq: 880.00, time: 0.12, duration: 0.20, gain: 0.26 },
        { freq: 1046.50, time: 0.25, duration: 0.25, gain: 0.30 },
        { freq: 1396.91, time: 0.40, duration: 0.65, gain: 0.35 },
      ];

      notes.forEach(({ freq, time, duration, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Sine wave for sweet bell chime tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Soft attack and smooth exponential decay (bell envelope)
        gainNode.gain.setValueAtTime(0.0001, now + time);
        gainNode.gain.linearRampToValueAtTime(gain, now + time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });

      // Add a subtle warm harmonic undertone
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(349.23, now + 0.38); // F4
      subGain.gain.setValueAtTime(0.0001, now + 0.38);
      subGain.gain.linearRampToValueAtTime(0.12, now + 0.42);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now + 0.38);
      subOsc.stop(now + 0.95);

      return true;
    } else if (type === 'processing') {
      // Gentle two-tone processing alert: D5 (587.33Hz) -> G5 (783.99Hz)
      const notes = [
        { freq: 587.33, time: 0, duration: 0.16, gain: 0.18 },
        { freq: 783.99, time: 0.14, duration: 0.35, gain: 0.22 },
      ];

      notes.forEach(({ freq, time, duration, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gainNode.gain.setValueAtTime(0.0001, now + time);
        gainNode.gain.linearRampToValueAtTime(gain, now + time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });

      return true;
    } else if (type === 'completed') {
      // Warm completion triad
      const notes = [
        { freq: 523.25, time: 0, duration: 0.18, gain: 0.18 }, // C5
        { freq: 659.25, time: 0.12, duration: 0.22, gain: 0.22 }, // E5
        { freq: 783.99, time: 0.24, duration: 0.45, gain: 0.25 }, // G5
      ];

      notes.forEach(({ freq, time, duration, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gainNode.gain.setValueAtTime(0.0001, now + time);
        gainNode.gain.linearRampToValueAtTime(gain, now + time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });

      return true;
    } else {
      // Subtle gentle click/pip
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      return true;
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
    return false;
  }
}
