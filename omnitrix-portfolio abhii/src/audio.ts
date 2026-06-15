/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for the Omnitrix HUD
// No external sound files are loaded, preventing load delays or network issues.

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize Audio Context lazily on first human interaction to comply with browser autoplay policies
export function initAudio(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuteState(muted: boolean): void {
  isMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("omnitrix_muted", muted ? "true" : "false");
  }
}

export function getMuteState(): boolean {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("omnitrix_muted");
    if (saved !== null) {
      isMuted = saved === "true";
    }
  }
  return isMuted;
}

// 1. BOOT SOUND: Low hum rising to a high-pitched alien beep
export function playBootSound(): void {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    // Main oscillator for rising sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    // Linear rise from 80Hz (deep hum) to 880Hz (beeping alarm)
    osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.setValueAtTime(0.2, now + 1.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Secondary beep accent
    const accentOsc = ctx.createOscillator();
    const accentGain = ctx.createGain();
    
    accentOsc.type = "sawtooth";
    accentOsc.frequency.setValueAtTime(1200, now + 1.1);
    
    accentGain.gain.setValueAtTime(0, now);
    accentGain.gain.setValueAtTime(0.05, now + 1.1);
    accentGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    
    accentOsc.connect(accentGain);
    accentGain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 1.5);
    
    accentOsc.start(now);
    accentOsc.stop(now + 1.5);
  } catch (err) {
    console.warn("Audio Context blocked or failed:", err);
  }
}

// 2. HOVER SECONDS: Short high-pitched tick on selection dial
export function playTickSound(): void {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(2200, now);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {}
}

// 3. TRANSFORMATION: Rapid sci-fi layered beeps (for alien dialing clicks)
export function playTransformationSound(): void {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    const notes = [293.66, 392, 587.33, 783.99, 1174.66]; // G major sci-fi theme
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.18);
    });
  } catch (e) {}
}

// 4. SEND TRANSMISSION SOUND: Ascending 4-note electronic cyber beep
export function playTransmissionSound(): void {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    // Notes: E5 (659Hz) -> A5 (880Hz) -> C#6 (1109Hz) -> E6 (1318Hz)
    const notes = [659, 880, 1109, 1318];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      
      gain.gain.setValueAtTime(0.15, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.25);
    });
  } catch (e) {}
}

// 5. HUD NAVIGATION CLICK: Low tech decay click
export function playNavClickSound(): void {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {}
}
