/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Layers, 
  Shield, 
  Zap, 
  Database, 
  Terminal, 
  Radio, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  FileText, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  ChevronRight, 
  Award,
  BookOpen,
  Send,
  Loader
} from "lucide-react";
import { DEV_INFO, SKILLS_LIST, PROJECTS_LIST, TIMELINE_LIST } from "./data";
import CircuitBackground from "./components/CircuitBackground";
import { 
  playBootSound, 
  playTickSound, 
  playTransformationSound, 
  playTransmissionSound, 
  playNavClickSound, 
  getMuteState, 
  setMuteState 
} from "./audio";

export default function App() {
  // App system states
  const [isBooted, setIsBooted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [booting, setBooting] = useState(false);
  const [bootingLogs, setBootingLogs] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [currentTime, setCurrentTime] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // interactive skills dial states
  const [selectedSkillIdx, setSelectedSkillIdx] = useState(0);
  const [dialRotation, setDialRotation] = useState(0);

  // Timeline scroll highlight state (Intersection Observer)
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

  // Contact form submission states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [transmissionStatus, setTransmissionStatus] = useState<"IDLE" | "ENCRYPTING" | "BEAMING" | "SUCCESS">("IDLE");
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Holographic panel toggle: select custom active bio files
  const [activeBioPanel, setActiveBioPanel] = useState<"SUMMARY" | "LORE" | "SPECS">("SUMMARY");

  // Keep track of scroll for timeline tracker and upper HUD progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update dynamic telemetry variables (Sci-fi clocks)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as UTC ISO telemetry or custom standard
      setCurrentTime(now.getUTCFullYear() + "-" + 
                     String(now.getUTCMonth() + 1).padStart(2, "0") + "-" + 
                     String(now.getUTCDate()).padStart(2, "0") + "T" + 
                     String(now.getUTCHours()).padStart(2, "0") + ":" + 
                     String(now.getUTCMinutes()).padStart(2, "0") + ":" + 
                     String(now.getUTCSeconds()).padStart(2, "0") + "Z");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Setup intersection observer for experience timeline cards
  useEffect(() => {
    if (!isBooted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    TIMELINE_LIST.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isBooted]);

  // Handle Mute toggle
  const toggleMuted = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setMuteState(nextMute);
    if (!nextMute) {
      playNavClickSound();
    }
  };

  // Launch initial Boot calibration matrix
  const handleBootActivation = () => {
    if (booting) return;
    setBooting(true);
    playBootSound();

    const logs = [
      ">> INITIATING OMNITRIX CORE SYSTEM BOOT...",
      ">> ESTABLISHING INTERFACE PROTOCOL [GREEN_DIAL]...",
      ">> READING LOCAL BIOMETRICS: ABHIRAM KONGE...",
      ">> PARSING ENCRYPTED PORTFOLIO DATABASE REPOSITORIES...",
      ">> INITIALIZING PROCEDURAL WAVEFORM SYNTHESIZERS...",
      ">> COMPILING GRAPHICS ENGINE & CIRCUITS OVERLAY...",
      ">> ALL SYSTEMS CALIBRATED // CONNECTION SECURE.",
    ];

    let currentLogIdx = 0;
    const logInterval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setBootingLogs((prev) => [...prev, logs[currentLogIdx]]);
        currentLogIdx++;
      }
    }, 250);

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          clearInterval(logInterval);
          // Ending delay for gorgeous green flash reveal
          setTimeout(() => {
            setIsBooted(true);
          }, 450);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Click on dialect
  const mobileSkillsContainerRef = useRef<HTMLDivElement>(null);

  // Scroll mobile card into view when selected
  const scrollMobileCardIntoView = (idx: number) => {
    const container = mobileSkillsContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const targetChild = children[idx];
    if (targetChild) {
      const containerWidth = container.clientWidth;
      const targetLeft = targetChild.offsetLeft;
      const targetWidth = targetChild.clientWidth;
      container.scrollTo({
        left: targetLeft - (containerWidth / 2) + (targetWidth / 2),
        behavior: "smooth"
      });
    }
  };

  const handleSelectSkill = (idx: number) => {
    if (idx === selectedSkillIdx) return;
    setSelectedSkillIdx(idx);
    
    // Rotate dial in a cycle (8 divisions = 45 degrees per turn)
    // We update the rotation angle so it spins visually
    const diff = idx - selectedSkillIdx;
    setDialRotation((prev) => prev - diff * 45);
    playTransformationSound();

    // Smooth scroll mobile card into view on small screens
    setTimeout(() => {
      scrollMobileCardIntoView(idx);
    }, 50);
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const children = Array.from(container.children) as HTMLElement[];
    
    let closestIdx = -1;
    let minDistance = Infinity;
    
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    if (closestIdx !== selectedSkillIdx && closestIdx >= 0 && closestIdx < SKILLS_LIST.length) {
      setSelectedSkillIdx(closestIdx);
      playTickSound();
    }
  };

  // Contact Transmission Handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;

    setTransmissionStatus("ENCRYPTING");
    playNavClickSound();
    setTransmissionLogs([">> SECURITY INTERLOCK ENGAGED...", ">> ENCRYPTING TRANSACTION SIGNALS..."]);

    setTimeout(() => {
      setTransmissionStatus("BEAMING");
      playTransformationSound();
      setTransmissionLogs(prev => [
        ...prev, 
        ">> STANDBY: ROUTING THROUGH ALIEN TRANSPONDER SATELLITE...",
        ">> UPLINK SPEED: XLR8_MODE (ESTABLISHED)",
        ">> ENVELOPE STRUCTURING: SECURE"
      ]);

      setTimeout(() => {
        setTransmissionStatus("SUCCESS");
        playTransmissionSound();
        setTransmissionLogs(prev => [
          ...prev, 
          ">> SUCCESS: PORTFOLIO FEED TRANSMITTED TO HOMEBASE.",
          `>> RECIPIENT DETECTED: ${DEV_INFO.email}`,
          ">> SYSTEM STABLE. TRANSMITTER IDLE."
        ]);
        // Clear input coordinates
        setFormName("");
        setFormEmail("");
        setFormMsg("");
      }, 1500);
    }, 1000);
  };

  // Helper values to draw elements radially
  const getSkillAnglePosition = (index: number, total: number, radius: number) => {
    const angle = (index * (360 / total) * Math.PI) / 180 - Math.PI / 2; // Offset by 90deg to start at top
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <div className="relative min-h-screen select-none bg-[#050505] text-[#00ff41] font-sans selection:bg-[#00ff41] selection:text-black">
      {/* 1. Global HUD overlays and HUD aesthetics */}
      <div className="scanlines" />
      <div className="hologram-vignette" />
      
      {/* Scroll indicator overlay */}
      {isBooted && (
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }} 
        />
      )}

      {/* --- BOOT SCREEN (INTRO ANIMATION) --- */}
      {!isBooted && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505] overflow-hidden p-6">
          <CircuitBackground />
          <div className="absolute inset-0 bg-radial-gradient(ellipse, transparent 20%, #000000 90%) pointer-events-none" />

          {/* Matrix green ambient grids */}
          <div className="relative max-w-2xl w-full flex flex-col items-center text-center p-8 border border-omni-bright/25 rounded-xl bg-black/85 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,65,0.06)]">
            {/* Hologram top edge corner tags */}
            <div className="absolute top-0 left-4 -translate-y-1/2 bg-black px-2 text-[10px] font-mono tracking-widest text-omni-silver uppercase">
              OMN_INITIALIZER_v1.0
            </div>
            <div className="absolute top-0 right-4 -translate-y-1/2 bg-black px-2 text-[10px] font-mono tracking-widest text-[#00ff41] animate-pulse">
              ● STAT_STANDBY
            </div>

            {/* Pulsing giant Omnitrix core logo */}
            <div 
              onClick={handleBootActivation}
              className={`relative shadow-[0_0_40px_rgba(0,255,65,0.25)] rounded-full w-48 h-48 border-[6px] border-omni-silver/40 flex items-center justify-center p-2 mb-8 cursor-pointer group transition-all duration-500 hover:border-omni-bright hover:shadow-[0_0_60px_rgba(0,255,65,0.7)] ${
                booting ? "animate-spin-fast" : "animate-pulse"
              }`}
            >
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#00ff41]/60 animate-spin-slow group-hover:scale-105 transition-transform" />
              
              {/* Inner stylized crest */}
              <div className="relative w-full h-full rounded-full bg-[#031503] flex items-center justify-center overflow-hidden">
                {/* Visual Hourglass shape representing the classic omnitrix logo mask */}
                <div className="relative w-full h-full flex flex-col justify-between">
                  <div className="w-full h-1/3 bg-[#00ff41]"></div>
                  {/* Narrow bottleneck center */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-10">
                    <div className="w-16 h-16 rounded-full bg-[#050505] border-[4px] border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.6)]" />
                  </div>
                  {/* Dynamic glow blocks */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-[#00ff41] clip-path-hourglass-left" style={{ clipPath: "polygon(0 0, 100% 5%, 0 50%, 100% 95%, 0 100%)" }}></div>
                    <div className="w-1/2 h-full bg-[#00ff41] clip-path-hourglass-right ml-auto" style={{ clipPath: "polygon(100% 0, 0 5%, 100% 50%, 0 95%, 100% 100%)" }}></div>
                  </div>
                  <div className="w-full h-1/3 bg-[#00ff41] self-end mt-auto"></div>
                </div>
              </div>
            </div>

            {!booting ? (
              <div className="space-y-4">
                <h1 className="font-display text-2xl md:text-3xl font-bold tracking-widest text-[#00ff41] text-glow-green uppercase">
                  OMNITRIX WORKSPACE
                </h1>
                <p className="text-omni-silver text-sm max-w-sm mx-auto tracking-wide">
                  The host is restricted. Calibrate security interlock to decrypt the Portfolio and core metrics.
                </p>
                <button 
                  onClick={handleBootActivation}
                  className="mt-6 px-8 py-3 bg-[#00ff41]/10 hover:bg-[#00ff41]/25 border border-[#00ff41] text-glow-green text-sm font-display tracking-widest font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  [ CALIBRATE INTERLOCK ]
                </button>
              </div>
            ) : (
              <div className="w-full space-y-6">
                <span className="font-display tracking-widest text-sm text-glow-green animate-pulse">
                  SYSTEM INITIALIZING... {bootProgress}%
                </span>
                
                {/* Glowing status bar */}
                <div className="w-full h-2 bg-omni-dark/60 rounded-full border border-omni-bright/20 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-omni-dim to-omni-bright shadow-[0_0_10px_#00ff41] transition-all duration-100"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>

                {/* Console loader logs outputting line by line */}
                <div className="w-full h-40 bg-[#021102]/85 border border-[#00ff41]/20 rounded-md p-4 flex flex-col items-start font-mono text-xs text-[#00ff41] text-left gap-1 overflow-y-auto scrollbar-thin">
                  {bootingLogs.map((log, i) => (
                    <div key={i} className="animate-fade-in opacity-90">
                      {log}
                    </div>
                  ))}
                  <div className="w-2 h-4 bg-omni-bright animate-pulse mt-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- HUD DEPLOYED STATE --- */}
      {isBooted && (
        <div id="hud-workspace" className="relative pb-24">
          <CircuitBackground />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(5,5,5,0.9)_90%)] pointer-events-none" />

          {/* --- TOP FIXED SCIFI NAV HUD BAR --- */}
          <nav className="sticky top-0 z-50 bg-[#050505]/90 border-b border-[#00ff41]/20 backdrop-blur-md px-4 md:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Logo / spinning Omnitrix badge */}
              <div className="flex items-center gap-3">
                <a 
                  href="#hero-section" 
                  className="flex items-center gap-3 group"
                  onClick={() => { playNavClickSound(); setMobileMenuOpen(false); }}
                >
                  <div className="relative w-8 h-8 rounded-full border-2 border-omni-silver/40 flex items-center justify-center p-0.5 group-hover:border-omni-bright transition-colors shadow-[0_0_10px_rgba(0,255,65,0.15)] overflow-hidden bg-black">
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#00ff41]/50 animate-spin-slow group-hover:animate-spin-fast" />
                    {/* Tiny green triangle dial mask */}
                    <div className="w-full h-full bg-[#00ff41] rounded-full flex flex-col justify-between p-0.5">
                      <div className="w-full h-2 bg-[#050505] rounded-t-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
                      </div>
                      <div className="w-full h-2 bg-[#050505] rounded-b-full pb-0.5 flex items-center justify-center mt-auto" />
                    </div>
                  </div>
                  <div>
                    <span className="font-display font-semibold tracking-wider text-xs md:text-sm text-[#00ff41] text-glow-green">
                      OMNITRIX_HUD
                    </span>
                    <span className="hidden sm:inline-block font-mono text-[9px] text-omni-silver block -mt-1 ml-0.5 tracking-widest">
                      // SECURE_COMM_v1
                    </span>
                  </div>
                </a>
              </div>

              {/* Desktop links navigation */}
              <div className="hidden md:flex items-center gap-6 font-display text-xs tracking-widest">
                <a 
                  href="#hero-section" 
                  onClick={playNavClickSound} 
                  className="relative py-1 text-omni-silver hover:text-[#00ff41] transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[1px] after:bg-[#00ff41] hover:after:w-full after:transition-all"
                >
                  01_DOSSIER
                </a>
                <a 
                  href="#skills-section" 
                  onClick={playNavClickSound} 
                  className="relative py-1 text-omni-silver hover:text-[#00ff41] transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[1px] after:bg-[#00ff41] hover:after:w-full after:transition-all"
                >
                  02_DIAL_MATRIX
                </a>
                <a 
                  href="#projects-section" 
                  onClick={playNavClickSound} 
                  className="relative py-1 text-omni-silver hover:text-[#00ff41] transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[1px] after:bg-[#00ff41] hover:after:w-full after:transition-all"
                >
                  03_FORMS_UNLOCKED
                </a>
                <a 
                  href="#timeline-section" 
                  onClick={playNavClickSound} 
                  className="relative py-1 text-omni-silver hover:text-[#00ff41] transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[1px] after:bg-[#00ff41] hover:after:w-full after:transition-all"
                >
                  04_TIMELINE
                </a>
                <a 
                  href="#contact-section" 
                  onClick={playNavClickSound} 
                  className="relative py-1 text-omni-silver hover:text-[#00ff41] transition-colors after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[1px] after:bg-[#00ff41] hover:after:w-full after:transition-all"
                >
                  05_TRANSMIT
                </a>
              </div>

              {/* Status Indicator, Mute Trigger & Mobile Menu Toggle */}
              <div className="flex items-center gap-4">
                
                {/* Global Status Signlet */}
                <div className="hidden sm:flex items-center gap-2 bg-[#021102] border border-[#00ff41]/20 px-3 py-1 rounded font-mono text-[10px] tracking-widest text-[#00ff41]">
                  <span className="w-1.5 h-1.5 rounded-full bg-omni-bright animate-pulse" />
                  <span>COMM_LINK: SECURE</span>
                </div>

                {/* Speaker Audio controller */}
                <button 
                  onClick={toggleMuted}
                  className="p-2 border border-[#00ff41]/30 hover:border-[#00ff41] rounded bg-black/40 hover:bg-[#00ff41]/10 text-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.25)] transition-all cursor-pointer"
                  title={isMuted ? "Unmute HUD audio synthesizer" : "Mute audio synthesizer"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
                </button>

                {/* Mobile Menu trigger */}
                <button 
                  onClick={() => { playNavClickSound(); setMobileMenuOpen(!mobileMenuOpen); }}
                  className="md:hidden p-2 border border-omni-silver/30 hover:border-omni-bright rounded bg-black/40 text-omni-silver hover:text-omni-bright transition-colors cursor-pointer"
                >
                  <Cpu size={16} />
                </button>
              </div>

            </div>

            {/* Mobile Nav links overlay */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-3 border-t border-[#00ff41]/15 pt-3 animate-fade-in">
                <div className="flex flex-col gap-2 font-display text-xs tracking-widest text-center p-2 bg-black/80 rounded border border-[#00ff41]/10">
                  <a 
                    href="#hero-section" 
                    onClick={() => { playNavClickSound(); setMobileMenuOpen(false); }}
                    className="py-2 hover:bg-omni-dark/30 hover:text-omni-bright rounded"
                  >
                    01_DOSSIER
                  </a>
                  <a 
                    href="#skills-section" 
                    onClick={() => { playNavClickSound(); setMobileMenuOpen(false); }}
                    className="py-2 hover:bg-omni-dark/30 hover:text-omni-bright rounded"
                  >
                    02_DIAL_MATRIX
                  </a>
                  <a 
                    href="#projects-section" 
                    onClick={() => { playNavClickSound(); setMobileMenuOpen(false); }}
                    className="py-2 hover:bg-omni-dark/30 hover:text-omni-bright rounded"
                  >
                    03_FORMS_UNLOCKED
                  </a>
                  <a 
                    href="#timeline-section" 
                    onClick={() => { playNavClickSound(); setMobileMenuOpen(false); }}
                    className="py-2 hover:bg-omni-dark/30 hover:text-omni-bright rounded"
                  >
                    04_TIMELINE
                  </a>
                  <a 
                    href="#contact-section" 
                    onClick={() => { playNavClickSound(); setMobileMenuOpen(false); }}
                    className="py-2 hover:bg-omni-dark/30 hover:text-omni-bright rounded"
                  >
                    05_TRANSMIT
                  </a>
                </div>
              </div>
            )}
          </nav>

          {/* --- HERO SECTION --- (Dossier presentation) */}
          <section id="hero-section" className="relative pt-6 pb-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Side: Avatar block representing the User profile, designed around an Omnitrix Face frame */}
              <div className="lg:col-span-5 flex flex-col items-center justify-between bg-black/40 border border-[#00ff41]/10 rounded-xl p-5 relative overflow-hidden hud-corner">
                
                {/* Decorative title label in column */}
                <div className="w-full flex justify-between items-center pb-2 border-b border-[#00ff41]/10 mb-4">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#00ff41]">
                    <span className="w-1.5 h-1.5 rounded-full bg-omni-bright animate-ping" />
                    <span>SYSTEM_DOSSIER_NODE</span>
                  </div>
                  <span className="font-mono text-[9px] text-omni-silver">// SECTOR_01</span>
                </div>

                <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center p-2.5 my-auto">
                  
                  {/* Decorative Bezel frames rotating clockwise and counter */}
                  <div className="absolute inset-0 rounded-full border-[8px] border-double border-omni-silver/30 animate-spin-slow shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#00ff41]/40 animate-spin-counter" />
                  <div className="absolute inset-4 rounded-full border border-omni-bright/20 animate-pulse" />
                  
                  {/* Metallic bezel gears (Omnitrix notches) */}
                  <div className="absolute inset-0 flex items-center justify-between pointer-events-none md:p-1">
                    <div className="w-3 h-6 bg-omni-silver border border-[#00ff41]/50 rounded-sm -translate-x-1 rotate-90" />
                    <div className="w-3 h-6 bg-omni-silver border border-[#00ff41]/50 rounded-sm translate-x-1 rotate-90" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none md:py-1">
                    <div className="w-3 h-6 bg-omni-silver border border-[#00ff41]/50 rounded-sm -translate-y-1" />
                    <div className="w-3 h-6 bg-omni-silver border border-[#00ff41]/50 rounded-sm translate-y-1" />
                  </div>

                  {/* Profile photo clip inside a neon grid mask */}
                  <div className="relative w-full h-full rounded-full bg-[#021102] border-[4px] border-[#00ff41] shadow-[0_0_35px_rgba(0,255,65,0.45)] flex items-center justify-center overflow-hidden group">
                    
                    {/* Grid line overlay in the picture circle */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.08)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-10" />
                    
                    {/* EDIT: Profile Photo. Render standard image mapped to layout requirement. */}
                    {/* User can supply real image src, it falls back gracefully to high tech green outline */}
                    <img 
                      id="profile-photo"
                      src="" 
                      alt="ABHIRAM KONGE" 
                      className="absolute inset-0 w-full h-full object-cover rounded-full mix-blend-screen grayscale filter brightness-125 z-0"
                      onError={(e) => {
                        // If no image is provided or loaded, hide and show standard vector HUD silhouette
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    {/* Highly polished green circuit silhouette fallback representation */}
                    <div className="relative flex flex-col items-center justify-center text-center z-0 p-6 w-full h-full text-omni-bright hover:scale-105 transition-transform duration-500">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#00ff41] flex items-center justify-center shadow-[0_0_15px_#00ff41]">
                        <Cpu size={40} className="animate-pulse" />
                      </div>
                      <div className="mt-3 font-display text-[10px] tracking-wider uppercase text-glow-green">
                        BIOMETRIC_LOCK
                      </div>
                      <span className="font-mono text-[8px] text-omni-silver bg-black/60 px-2 py-0.5 rounded mt-2 border border-omni-bright/15">
                        CSE_ABHIRAM_005
                      </span>
                    </div>

                    {/* Scan effect mask line with sweep animation */}
                    <div className="scanline-sweep" />

                  </div>

                </div>

                {/* Real-time coordinates in horizontal dashboard bar */}
                <div className="mt-4 w-full flex justify-between px-3 py-2 bg-[#011401] border border-[#00ff41]/15 rounded font-mono text-[9px] text-omni-silver">
                  <div>
                    <span className="text-omni-bright">LAT:</span> 15.8281° N
                  </div>
                  <div>
                    <span className="text-omni-bright">LNG:</span> 78.0373° E
                  </div>
                  <div>
                    <span className="text-omni-bright">NODE:</span> IN_KRNL
                  </div>
                </div>

              </div>

              {/* Right Side: Primary Biography credentials and stats panel */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-black/40 border border-[#00ff41]/10 rounded-xl p-5 md:p-6 relative overflow-hidden hud-corner">
                
                <div>
                  {/* Visual HUD header bracket */}
                  <div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-omni-silver">
                    <Terminal size={12} className="text-[#00ff41]" />
                    <span className="tracking-widest">DOSSIER_FILE // DECRYPT_AUTHORIZED</span>
                    <div className="h-[1px] bg-[#00ff41]/15 flex-grow" />
                  </div>

                  {/* Glitched user name displaying Orbitron font */}
                  <div className="relative group">
                    <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-wider animate-glitch-hover inline-block cursor-default text-glow-green-strong">
                      {DEV_INFO.name}
                    </h1>
                  </div>

                  {/* User subtitle status line */}
                  <h2 className="font-display text-lg md:text-xl mt-1 tracking-widest text-[#00ff41] flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded bg-omni-bright animate-ping" />
                    {DEV_INFO.title}
                  </h2>

                  <p className="mt-4 text-omni-silver leading-relaxed tracking-wide text-xs md:text-sm max-w-xl">
                    {DEV_INFO.summary}
                  </p>

                  {/* Interactive Sub-bio HUD Selector Tab Controls */}
                  <div className="grid grid-cols-3 gap-2 mt-5 max-w-md">
                    <button 
                      onClick={() => { playNavClickSound(); setActiveBioPanel("SUMMARY"); }}
                      className={`py-1.5 text-center text-[9px] font-display tracking-widest border border-[#00ff41]/30 rounded transition-all cursor-pointer ${
                        activeBioPanel === "SUMMARY" 
                          ? "bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41] glow-green-sm" 
                          : "bg-black/30 text-omni-silver hover:bg-[#00ff41]/5 hover:text-omni-bright"
                      }`}
                    >
                      SYSTEM_SPECS
                    </button>
                    <button 
                      onClick={() => { playNavClickSound(); setActiveBioPanel("LORE"); }}
                      className={`py-1.5 text-center text-[9px] font-display tracking-widest border border-[#00ff41]/30 rounded transition-all cursor-pointer ${
                        activeBioPanel === "LORE" 
                          ? "bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41] glow-green-sm" 
                          : "bg-black/30 text-omni-silver hover:bg-[#00ff41]/5 hover:text-omni-bright"
                      }`}
                    >
                      CODENAME_LORE
                    </button>
                    <button 
                      onClick={() => { playNavClickSound(); setActiveBioPanel("SPECS"); }}
                      className={`py-1.5 text-center text-[9px] font-display tracking-widest border border-[#00ff41]/30 rounded transition-all cursor-pointer ${
                        activeBioPanel === "SPECS" 
                          ? "bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41] glow-green-sm" 
                          : "bg-black/30 text-omni-silver hover:bg-[#00ff41]/5 hover:text-omni-bright"
                      }`}
                    >
                      COMMUN_COORDS
                    </button>
                  </div>

                  {/* Sub-bio Screen console outputting themed structures */}
                  <div className="mt-3 p-4 bg-[#011101]/90 border border-[#00ff41]/20 rounded-lg min-h-[120px] text-xs font-mono max-w-xl relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]/40 animate-ping" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]/20" />
                    </div>
                    
                    {activeBioPanel === "SUMMARY" && (
                      <div className="space-y-1.5 animate-fade-in text-omni-silver">
                        <div className="flex justify-between border-b border-[#00ff41]/10 pb-1">
                          <span className="text-[#00ff41]">LOGIC_CORE:</span>
                          <span>Python, Django, Javascript, C++</span>
                        </div>
                        <div className="flex justify-between border-b border-[#00ff41]/10 pb-1">
                          <span className="text-[#00ff41]">INTELLI_STACK:</span>
                          <span>MySQL, SQLite Database Structuring</span>
                        </div>
                        <div className="flex justify-between border-b border-[#00ff41]/10 pb-1">
                          <span className="text-[#00ff41]">PERIMETER_SECURE:</span>
                          <span>Zero-Trust Cybersecurity Gateway</span>
                        </div>
                        <div className="flex justify-between pb-0.5">
                          <span className="text-[#00ff41]">STATUS:</span>
                          <span className="text-omni-bright animate-pulse">ACTIVE // DEV_MODE_V1_ENABLE</span>
                        </div>
                      </div>
                    )}

                    {activeBioPanel === "LORE" && (
                      <div className="space-y-2 animate-fade-in text-omni-silver leading-relaxed">
                        <div>
                          <span className="text-[#00ff41] font-display tracking-wide block mb-0.5 text-[10px] uppercase">
                            CODENAME: THE ENGINEER PROTOCOL
                          </span>
                          <span className="text-[11px]">
                            Much like the Omnitrix transforms its host into highly specialized models, 
                            Abhiram recalibrates his engineering framework instantly to match the 
                            problem matrix — deploying the brute-force processing of Python and MVC 
                            architecture on command.
                          </span>
                        </div>
                      </div>
                    )}

                    {activeBioPanel === "SPECS" && (
                      <div className="space-y-2 animate-fade-in text-omni-silver">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-0.5">
                          <a 
                            href={`mailto:${DEV_INFO.email}`} 
                            onClick={playNavClickSound}
                            className="flex items-center gap-2 p-1.5 bg-black/40 border border-omni-silver/15 hover:border-[#00ff41] hover:text-[#00ff41] rounded transition-all text-[11px]"
                          >
                            <Mail size={12} className="text-omni-bright shrink-0" />
                            <span className="truncate">{DEV_INFO.email}</span>
                          </a>
                          <a 
                            href={`tel:${DEV_INFO.phone}`}
                            onClick={playNavClickSound}
                            className="flex items-center gap-2 p-1.5 bg-black/40 border border-omni-silver/15 hover:border-[#00ff41] hover:text-[#00ff41] rounded transition-all text-[11px]"
                          >
                            <Phone size={12} className="text-omni-bright shrink-0" />
                            <span>{DEV_INFO.phone}</span>
                          </a>
                          <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-omni-silver/15 rounded text-[11px]">
                            <MapPin size={12} className="text-omni-bright shrink-0" />
                            <span className="truncate">{DEV_INFO.location}</span>
                          </div>
                          <a 
                            href="https://linkedin.com/in/abhiram-konge" 
                            target="_blank" 
                            referrerPolicy="no-referrer"
                            onClick={playNavClickSound}
                            className="flex items-center gap-2 p-1.5 bg-black/40 border border-omni-silver/15 hover:border-[#00ff41] hover:text-[#00ff41] rounded transition-all text-[11px]"
                          >
                            <Linkedin size={12} className="text-omni-bright shrink-0" />
                            <span>LinkedIn Matrix</span>
                          </a>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Telemetry scrolling stats board in beautiful bento grids */}
                <div className="mt-5 grid grid-cols-3 gap-2 max-w-xl w-full">
                  <div className="p-2 bg-black/60 border border-[#00ff41]/15 rounded font-mono text-[9px] text-omni-silver relative overflow-hidden">
                    <span className="text-[#00ff41] block text-[9px] tracking-wider font-display">// TELEMETRY_CLOCK</span>
                    <span className="truncate block font-semibold text-white mt-1">{currentTime || "0000-00-00 00:00"}</span>
                  </div>
                  <div className="p-2 bg-black/60 border border-[#00ff41]/15 rounded font-mono text-[9px] text-omni-silver relative overflow-hidden">
                    <span className="text-[#00ff41] block text-[9px] tracking-wider font-display">// FRAMEWORK</span>
                    <span className="truncate block font-semibold text-white mt-1">REACT 19 + VITE 6</span>
                  </div>
                  <div className="p-2 bg-black/60 border border-[#00ff41]/15 rounded font-mono text-[9px] text-omni-silver relative overflow-hidden">
                    <span className="text-[#00ff41] block text-[9px] tracking-wider font-display">// INT_DEEPLINK</span>
                    <span className="truncate block font-semibold text-white mt-1 uppercase">SECURE_VAULT</span>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* --- SKILLS SECTION — "SELECT ALIEN" DIAL --- */}
          <section id="skills-section" className="relative py-10 border-t border-b border-[#00ff41]/10 bg-gradient-to-b from-black via-omni-extradark/50 to-black px-4 md:px-6">
            <div className="max-w-7xl mx-auto animate-fade-in">
              
              <div className="text-center mb-8 relative">
                <span className="font-mono text-[10px] tracking-widest text-[#00ff41] uppercase">// CLASSIFICATION DIALMATRIX</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-widest text-white mt-1 text-glow-green uppercase">
                  OMNITRIX ALIEN SELECTION DIAL
                </h2>
                <p className="text-omni-silver text-xs mt-2 max-w-lg mx-auto leading-relaxed">
                  Hover to preview coordinates. Click a skill node to rotate the Omnitrix bezel core, locking in the specialized transformation matrices.
                </p>
                <div className="w-16 h-[1px] bg-omni-bright/35 mx-auto mt-4" />
              </div>

              {/* Slideable list of cards for mobile viewports below 768px */}
              <div className="block md:hidden select-none">
                <div 
                  ref={mobileSkillsContainerRef}
                  onScroll={handleMobileScroll}
                  className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 px-1 scrollbar-thin scrollbar-track-black/40 scrollbar-thumb-[#00ff41]/25 relative"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {SKILLS_LIST.map((skill, index) => {
                    const isCurrent = index === selectedSkillIdx;
                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectSkill(index)}
                        className={`w-[275px] xs:w-[310px] shrink-0 snap-center omni-card rounded-xl p-5 relative overflow-hidden bg-black/65 border transition-all duration-300 cursor-pointer ${
                          isCurrent 
                            ? "border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.25)]" 
                            : "border-omni-bright/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* Laser scanning line effect for selected slide */}
                        {isCurrent && <div className="scanline-sweep" />}

                        {/* Top corner form tag */}
                        <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#050505] border border-[#00ff41]/30 px-2.5 py-0.5 rounded font-mono text-[8px] tracking-widest text-[#00ff41] uppercase">
                          FORM: {skill.alienForm.toUpperCase()}
                        </div>

                        {/* Card header */}
                        <div className="flex items-center gap-3.5 pb-2.5 border-b border-omni-bright/15">
                          <div className="w-11 h-11 rounded-full border-2 border-[#00ff41] bg-[#021c02] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.35)] text-xl shrink-0">
                            {skill.iconClass}
                          </div>
                          <div className="truncate text-left">
                            <span className="text-[8px] font-mono tracking-widest uppercase text-omni-silver block">
                              COORDINATE 0{index + 1}
                            </span>
                            <h3 className="font-display text-sm font-extrabold text-white tracking-wide text-glow-green truncate">
                              {skill.name}
                            </h3>
                          </div>
                        </div>

                        {/* Progress meter */}
                        <div className="mt-3.5 space-y-1">
                          <div className="flex justify-between font-mono text-[9px] tracking-wider text-omni-silver">
                            <span>MASTERY_CALIBRATION:</span>
                            <span className="text-omni-bright text-glow-green text-xs font-semibold">
                              {skill.level}% LOADED
                            </span>
                          </div>
                          <div className="relative w-full h-2.5 bg-omni-dark rounded-full overflow-hidden border border-[#00ff41]/20 p-0.5">
                            <div 
                              className="h-full bg-gradient-to-r from-omni-dim to-[#00ff41] rounded-full shadow-[0_0_10px_rgba(0,255,65,0.85)] transition-all duration-500 ease-out"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>

                        {/* Visual Descriptions */}
                        <div className="mt-4 space-y-3 font-mono text-xs text-left">
                          <div>
                            <span className="text-glow-green text-omni-bright tracking-widest block font-display text-[8px] uppercase">// FUNCTIONAL CAPABILITY:</span>
                            <p className="mt-1 text-omni-silver leading-relaxed font-sans font-light text-[11px]">
                              {skill.description}
                            </p>
                          </div>

                          <div className="p-2.5 bg-[#021502] border border-[#00ff41]/15 rounded text-omni-silver">
                            <span className="text-[#00ff41] text-[8px] tracking-widest font-display block uppercase">// ALIEN CORE ATTRIBUTE:</span>
                            <p className="mt-0.5 leading-relaxed text-[10px] italic">
                              "{skill.alienPowerDesc}"
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Micro indicators bar indicators */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {SKILLS_LIST.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSkill(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        index === selectedSkillIdx 
                          ? "bg-omni-bright w-3.5 shadow-[0_0_8px_#00ff41]" 
                          : "bg-[#00ff41]/20 hover:bg-[#00ff41]/40"
                      }`}
                      title={`Open slide matrix ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop Bezel interactive Dial layout: Hidden on small screens >= 768px */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Dial Wheel wrapper: lg:col-span-6 */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center py-4 order-2 lg:order-1 bg-black/30 border border-[#00ff41]/5 rounded-xl p-4 relative hud-corner">
                  
                  {/* Circle Interactive Board */}
                  <div className="relative w-80 h-80 flex items-center justify-center">
                    
                    {/* Radial background grids */}
                    <div className="absolute inset-4 rounded-full border border-[#00ff41]/15 flex items-center justify-center">
                      <div className="w-11/12 h-11/12 rounded-full border border-dashed border-[#00ff41]/10 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 rounded-full border border-[#00ff41]/20 flex items-center justify-center" />
                      </div>
                    </div>

                    {/* Rotating outer bezel selector ring mapping dialRotation */}
                    <div 
                       className="absolute inset-0 rounded-full border-[10px] border-omni-silver/45 transition-transform duration-700 ease-out flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.9)] bg-black"
                      style={{ transform: `rotate(${dialRotation}deg)` }}
                    >
                      {/* Decorative tick notches */}
                      <div className="absolute inset-2 rounded-full border border-dashed border-omni-bright/15" />
                      
                      {/* Interactive Selection node pins */}
                      {SKILLS_LIST.map((skill, index) => {
                        const pos = getSkillAnglePosition(index, SKILLS_LIST.length, 125);
                        const isCurrent = index === selectedSkillIdx;
                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectSkill(index)}
                            onMouseEnter={playTickSound}
                            className={`absolute w-9 h-9 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 select-none ${
                              isCurrent
                                ? "bg-omni-bright text-black border-white shadow-[0_0_15px_#00ff41] scale-110"
                                : "bg-[#050505] text-omni-bright border-[#00ff41]/40 hover:border-omni-bright hover:scale-105 shadow-[0_0_8px_rgba(0,255,65,0.25)]"
                            }`}
                            style={{ 
                              left: `calc(50% + ${pos.x}px)`, 
                              top: `calc(50% + ${pos.y}px)`, 
                              transform: `translate(-50%, -50%) rotate(${-dialRotation}deg)` // maintain upright orientation
                            }}
                            title={`Select ${skill.name}`}
                          >
                            <span className="text-xs font-semibold">{skill.iconClass}</span>
                          </button>
                        );
                      })}

                      {/* Internal Omnitrix centerpiece layout rotates inside */}
                      <div className="w-[140px] h-[140px] rounded-full bg-[#021802] border-[4px] border-[#00ff41]/80 shadow-[0_0_25px_rgba(0,255,65,0.4) inset] flex items-center justify-center overflow-hidden">
                        
                        {/* Hourglass shape visual structure */}
                        <div className="relative w-full h-full flex flex-col justify-between p-1">
                          <div className="w-full h-1/4 bg-[#00ff41] shrink-0" />
                          <div className="absolute inset-0 flex justify-between">
                            <div className="w-1/2 h-full bg-[#00ff41] clip-path-hourglass-left" style={{ clipPath: "polygon(0 0, 100% 5%, 0 50%, 100% 95%, 0 100%)" }} />
                            <div className="w-1/2 h-full bg-[#00ff41] clip-path-hourglass-right ml-auto" style={{ clipPath: "polygon(100% 0, 0 5%, 100% 50%, 0 95%, 100% 100%)" }} />
                          </div>
                          
                          {/* Inner glowing cores */}
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[#050505] border-[3px] border-[#00ff41] flex flex-col items-center justify-center shadow-[0_0_14px_rgba(0,255,65,0.85)] font-display text-[9px] text-[#00ff41] tracking-widest text-center uppercase p-1">
                              <span className="text-xs font-bold block animate-pulse mt-0.5">{SKILLS_LIST[selectedSkillIdx].iconClass}</span>
                            </div>
                          </div>
                          
                          <div className="w-full h-1/4 bg-[#00ff41] self-end mt-auto shrink-0" />
                        </div>
                        
                      </div>

                    </div>

                    {/* Central radar overlay background */}
                    <div className="absolute -inset-4 rounded-full border border-omni-bright/5 pointer-events-none animate-pulse" />

                  </div>

                </div>

                {/* Selected Alien holographic information display: lg:col-span-6 */}
                <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
                  
                  {/* Hologram details card */}
                  <div className="omni-card rounded-xl p-5 md:p-6 relative overflow-hidden hud-corner bg-black/60 border border-[#00ff41]/25">
                    
                    {/* Laser scanning line */}
                    <div className="scanline-sweep" />

                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#050505] border border-[#00ff41]/30 px-2.5 py-0.5 rounded font-mono text-[8px] tracking-widest text-[#00ff41] uppercase">
                      FORM_STATS: LOCKED_IN
                    </div>

                    <div className="flex items-center gap-3.5 pb-3 border-b border-omni-bright/15">
                      {/* Avatar sphere node representing alien silhouette logo */}
                      <div className="w-12 h-12 rounded-full border-2 border-[#00ff41] bg-[#021c02] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.4)] text-xl shrink-0">
                        {SKILLS_LIST[selectedSkillIdx].iconClass}
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-mono tracking-widest uppercase text-omni-silver block">
                          ALIEN TRANSFORM MATRIX // {SKILLS_LIST[selectedSkillIdx].alienForm.toUpperCase()}
                        </span>
                        <h3 className="font-display text-xl md:text-2xl font-extrabold text-[#00ff41] text-glow-green mt-0.5">
                          {SKILLS_LIST[selectedSkillIdx].name}
                        </h3>
                      </div>
                    </div>

                    {/* Proficiency progress bar dashboard */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between font-mono text-[10px] tracking-wider text-omni-silver">
                        <span>MASTERY_CALIBRATION:</span>
                        <span className="text-omni-bright text-glow-green text-xs font-semibold">
                          {SKILLS_LIST[selectedSkillIdx].level}% LOADED
                        </span>
                      </div>
                      
                      <div className="relative w-full h-2.5 bg-omni-dark rounded-full overflow-hidden border border-[#00ff41]/20 p-0.5">
                        <div 
                          className="h-full bg-gradient-to-r from-omni-dim to-[#00ff41] rounded-full shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all duration-500 ease-out"
                          style={{ width: `${SKILLS_LIST[selectedSkillIdx].level}%` }}
                        />
                      </div>
                    </div>

                    {/* Skill practical descriptions */}
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div>
                        <span className="text-glow-green text-omni-bright tracking-widest block font-display text-[9px] uppercase">// FUNCTIONAL CAPABILITY:</span>
                        <p className="mt-1 text-omni-silver leading-relaxed text-[12px] font-sans font-light">
                          {SKILLS_LIST[selectedSkillIdx].description}
                        </p>
                      </div>

                      <div className="p-3 bg-[#021502] border border-[#00ff41]/15 rounded text-omni-silver">
                        <span className="text-[#00ff41] text-[9px] tracking-widest font-display block uppercase">// ALIEN CORE ATTRIBUTE:</span>
                        <p className="mt-0.5 leading-relaxed text-[11px] italic">
                          "{SKILLS_LIST[selectedSkillIdx].alienPowerDesc}"
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Desktop Quick selection matrix navigation panel */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 w-full">
                    {SKILLS_LIST.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSkill(index)}
                        onMouseEnter={playTickSound}
                        className={`py-1.5 border rounded font-mono text-[8px] text-center tracking-widest transition-all truncate cursor-pointer ${
                          index === selectedSkillIdx 
                            ? "bg-[#00ff41]/10 text-[#00ff41] border-[#00ff41] glow-green-sm" 
                            : "bg-black/40 text-omni-silver border-omni-silver/20 hover:border-[#00ff41] hover:text-[#00ff41]"
                        }`}
                        title={`Selection Shortcut: ${skill.name}`}
                      >
                        {skill.alienForm.toUpperCase()}
                      </button>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* --- PROJECTS SECTION — "ALIENS UNLOCKED" --- */}
          <section id="projects-section" className="relative py-10 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-8 relative">
                <span className="font-mono text-[10px] tracking-widest text-[#00ff41] uppercase">// SECURE_ARCHIVES_V2</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-widest text-white mt-1 text-glow-green uppercase">
                  ACTIVE ALIEN CODES UNLOCKED
                </h2>
                <p className="text-omni-silver text-xs mt-2 max-w-lg mx-auto leading-relaxed">
                  Real operational applications. Each platform represents customized architectural structures formulated with zero compromises on system integrity.
                </p>
                <div className="w-16 h-[1px] bg-omni-bright/35 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS_LIST.map((project, i) => (
                  
                  // Project Card frame with high density styling
                  <div 
                    key={project.id}
                    className="omni-card rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 bg-black/60 border border-[#00ff41]/20 hud-corner"
                  >
                    
                    {/* Laser scanline vertical sweep animation */}
                    <div className="scanline-sweep" />

                    <div>
                      {/* Uppermost bracket */}
                      <div className="flex justify-between items-center pb-2.5 border-b border-[#00ff41]/15 mb-4">
                        <span className="font-mono text-[9px] tracking-widest text-omni-bright uppercase">
                          FILE_CODE: {project.codeName}
                        </span>
                        <div className="bg-[#021502] border border-[#00ff41]/25 px-2 py-0.5 rounded font-mono text-[8px] text-[#00ff41]">
                          STAT: DEPLOYED
                        </div>
                      </div>

                      {/* Title display */}
                      <span className="text-[9px] font-mono text-omni-silver tracking-widest block uppercase">
                        {project.subtitle}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-extrabold text-white mt-0.5 tracking-wide group-hover:text-[#00ff41] transition-colors text-glow-green">
                        {project.title}
                      </h3>

                      <span className="font-mono text-[9px] text-omni-silver block mt-0.5">
                        TIMELINE CALIBRATION: {project.duration}
                      </span>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.techStack.map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-[#011a01] border border-[#00ff41]/20 text-[8px] font-mono text-omni-bright"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Bullet lists describing accomplishments */}
                      <p className="mt-4 text-xs text-omni-silver font-mono">
                        <span className="text-[9px] text-glow-green text-[#00ff41] font-display uppercase block tracking-wider">// DESIGN DESCRIPTION:</span>
                      </p>
                      
                      <ul className="mt-1 space-y-1 text-xs text-omni-silver font-sans leading-relaxed list-inside list-disc font-light">
                        {project.description.map((desc, idx) => (
                          <li key={idx} className="list-none flex items-start gap-1.5">
                            <span className="text-[#00ff41] shrink-0 mt-1 text-[10px]">▶</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Bullet metrics / achievements */}
                      <p className="mt-4 text-xs text-omni-silver font-mono">
                        <span className="text-[9px] text-glow-green text-[#00ff41] font-display uppercase block tracking-wider">// QUANTIFIED BENCHMARKS:</span>
                      </p>
                      
                      <ul className="mt-1 space-y-1 text-xs text-omni-silver font-sans leading-relaxed list-inside list-disc font-light">
                        {project.achievements.map((ach, idx) => (
                          <li key={idx} className="list-none flex items-start gap-1.5">
                            <span className="text-[#00ff41] shrink-0 font-bold mt-1 text-[10px]">✔</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>

                    </div>

                    {/* Call-to-action button */}
                    <div className="mt-6 pt-4 border-t border-[#00ff41]/15 flex items-center justify-between">
                      <span className="font-mono text-[8px] text-[#00ff41]/65">
                        SECURE_ACCESS_GRANTED
                      </span>
                      
                      <button 
                        onClick={() => {
                          playNavClickSound();
                          // Toggle interactive console alert safely
                          alert(`Interfacing: Decrypting ${project.title} portal coordinates.`);
                        }}
                        className="px-3 py-1.5 bg-[#00ff41]/10 hover:bg-[#00ff41]/25 border border-[#00ff41] rounded shadow-[0_0_10px_rgba(0,255,65,0.15)] hover:shadow-[0_0_15px_rgba(0,255,65,0.45)] hover:scale-105 active:scale-95 text-[10px] font-display tracking-widest font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        ACTIVATE <ExternalLink size={10} className="text-omni-bright" />
                      </button>
                    </div>

                  </div>

                ))}
              </div>

            </div>
          </section>

          {/* --- RESUME / EXPERIENCE SECTION (Holographic Timeline) --- */}
          <section id="timeline-section" className="relative py-10 bg-gradient-to-g from-black via-omni-extradark/30 to-black px-4 md:px-6 border-t border-[#00ff41]/10">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-8 relative">
                <span className="font-mono text-[10px] tracking-widest text-[#00ff41] uppercase">// ARCHIVAL TIMELINES // RECORD_FILE</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-widest text-white mt-1 text-glow-green uppercase">
                  HOLOGRAPHIC LOGS TIMELINE
                </h2>
                <p className="text-omni-silver text-xs mt-2 max-w-lg mx-auto leading-relaxed">
                  System logs representing scholastic foundations and professional credentials calibrated under Zero-Trust parameters.
                </p>
                <div className="w-16 h-[1px] bg-omni-bright/35 mx-auto mt-4" />
              </div>

              {/* Holographic Timeline grid */}
              <div className="relative border-l-2 border-[#00ff41]/20 pl-8 ml-4 md:ml-12 space-y-6 max-w-3xl mx-auto">
                
                {/* Circuit Line overlay linking nodes */}
                <div className="absolute top-0 bottom-0 left-[-2px] w-[2px] bg-gradient-to-b from-[#00ff41] via-omni-dim to-omni-dark shadow-[0_0_8px_#00ff41]" />

                {TIMELINE_LIST.map((item, index) => {
                  const isVisible = visibleItems[item.id];
                  return (
                    <div 
                      key={item.id}
                      id={item.id}
                      className={`relative transition-all duration-750 ease-out transform ${
                        isVisible 
                          ? "opacity-100 translate-x-0" 
                          : "opacity-0 -translate-x-12"
                      }`}
                    >
                      {/* Rotating glow bullet on time junction */}
                      <span className="absolute left-[-41px] top-5 w-5 h-5 rounded-full bg-black border-2 border-[#00ff41] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,65,0.7)] z-10">
                        {item.type === "education" ? (
                          <BookOpen size={10} className="text-omni-bright" />
                        ) : (
                          <Award size={10} className="text-omni-bright" />
                        )}
                      </span>

                      {/* Main timeline information card with high-density styling */}
                      <div className="omni-card rounded-lg p-5 hover:shadow-[0_0_20px_rgba(0,255,65,0.18)] transition-all relative overflow-hidden group bg-black/60 border border-[#00ff41]/20 hud-corner">
                        
                        {/* Laser scan line overlay */}
                        <div className="scanline-sweep" />

                        {/* Top corner tracker bracket */}
                        <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#050505] border border-[#00ff41]/10 px-2 py-0.5 rounded font-mono text-[8px] tracking-widest text-[#00ff41]">
                          LOG_NODE_{index + 1}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/10 pb-2">
                          <div>
                            <span className="text-[9px] font-mono tracking-widest text-omni-bright uppercase">
                              {item.type.toUpperCase()} STAGE
                            </span>
                            <h3 className="font-display text-base md:text-lg font-bold text-white tracking-wide group-hover:text-omni-bright transition-colors text-glow-green">
                              {item.title}
                            </h3>
                          </div>
                          
                          <div className="px-2.5 py-0.5 bg-black/60 border border-[#00ff41]/20 rounded font-mono text-[8px] text-[#00ff41] font-semibold text-center h-fit self-start sm:self-center">
                            {item.period}
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 font-sans">
                          <p className="font-medium text-xs text-omni-bright flex items-center gap-1">
                            🏢 {item.institution}
                          </p>

                          <p className="text-xs text-omni-silver font-light leading-relaxed">
                            {item.description}
                          </p>

                          {/* Render custom metadata bullets */}
                          {item.details && item.details.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#00ff41]/5">
                              {item.details.map((detail, dIdx) => (
                                <span 
                                  key={dIdx}
                                  className="px-2 py-0.5 bg-[#011401] border border-omni-bright/15 text-[9px] font-mono rounded text-[#00ff41]"
                                >
                                  {detail}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          </section>

          {/* --- CONTACT SECTION — OMNITRIX TRANSMISSION --- */}
          <section id="contact-section" className="relative py-10 px-4 md:px-6 border-t border-[#00ff41]/10">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center mb-8 relative">
                <span className="font-mono text-[10px] tracking-widest text-[#00ff41] uppercase">// ENCRYPTED COMMUNICATION UPLINK</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-widest text-white mt-1 text-glow-green uppercase">
                  ESTABLISH TRANSMISSION
                </h2>
                <p className="text-omni-silver text-xs mt-2 max-w-lg mx-auto leading-relaxed">
                  Input coordinates below to dispatch a secure planetary transmission directly to Abhiram's terminal dashboard.
                </p>
                <div className="w-16 h-[1px] bg-omni-bright/35 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Visual holographic log panel instructions: lg:col-span-5 */}
                <div className="lg:col-span-5 omni-card rounded-xl p-5 flex flex-col justify-between bg-black/60 border border-[#00ff41]/20 hud-corner">
                  <div>
                    <h3 className="font-display text-[10px] tracking-widest mb-3 uppercase text-[#00ff41]">// TERMINAL_FEEDBACK</h3>
                    <p className="text-xs text-omni-silver font-mono leading-relaxed">
                      Systems are calibrated to receive immediate secure feeds from recruiting officers, tech planners, and cooperative developers.
                    </p>

                    <div className="mt-4 space-y-2.5 font-mono text-[10px] text-omni-silver">
                      <div className="flex items-center gap-2">
                        <span className="text-omni-bright">●</span>
                        <span>FREQUENCY: GIGAWATT_BAND</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-omni-bright">●</span>
                        <span>STATUS: LISTENING_NODE_05</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-omni-bright">●</span>
                        <span>LATENCY: ZERO_PROPAGATION</span>
                      </div>
                    </div>
                  </div>

                  {/* Terminal status logs dynamic printer */}
                  <div className="mt-6 p-3 bg-[#011401] border border-omni-bright/20 rounded min-h-[130px] font-mono text-[10px] text-omni-bright flex flex-col gap-1 items-start text-left overflow-y-auto">
                    <span className="text-omni-silver font-display text-[9px] tracking-wide border-b border-omni-bright/15 pb-1 w-full uppercase mb-2">
                      TRANS_LOGGER_09
                    </span>
                    {transmissionStatus === "IDLE" ? (
                      <em className="text-[#00ff41]/50 italic">Waiting for form coordinates submission...</em>
                    ) : (
                      transmissionLogs.map((log, i) => (
                        <div key={i} className="animate-fade-in truncate w-full p-0.5">
                          {log}
                        </div>
                      ))
                    )}
                    {transmissionStatus === "ENCRYPTING" || transmissionStatus === "BEAMING" ? (
                      <span className="animate-pulse text-[#00ff41] mt-1.5 flex items-center gap-1.5">
                        <Loader size={10} className="animate-spin" /> Processing transponder uplink...
                      </span>
                    ) : null}
                  </div>

                </div>

                {/* Secure Form panel input coordinates: lg:col-span-7 */}
                <div className="lg:col-span-7 omni-card rounded-xl p-5 md:p-6 bg-black/60 border border-[#00ff41]/20 hud-corner">
                  
                  {/* EDIT: Contact form action is linked dynamically with React handler */}
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    
                    <div className="space-y-1">
                      <label className="font-display text-[9px] tracking-wider text-omni-bright block uppercase">
                        COORD_01: FULL_NAME (IDENTIFIER)
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="IDENTIFY RECRUITER..." 
                        className="w-full bg-[#050505] border border-[#00ff41]/20 focus:border-[#00ff41] rounded p-2.5 font-mono text-[11px] text-omni-bright outline-none transition-colors placeholder:text-[#00ff41]/25 uppercase shadow-[0_0_5px_rgba(0,0,0,0.8)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-display text-[9px] tracking-wider text-omni-bright block uppercase">
                        COORD_02: COMM_UPLINK (EMAIL_ADDRESS)
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="ENTER RETURN COORDINATES..." 
                        className="w-full bg-[#050505] border border-[#00ff41]/20 focus:border-[#00ff41] rounded p-2.5 font-mono text-[11px] text-omni-bright outline-none transition-colors placeholder:text-[#00ff41]/25 shadow-[0_0_5px_rgba(0,0,0,0.8)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-display text-[9px] tracking-wider text-omni-bright block uppercase">
                        COORD_03: MESSAGE_PAYLOAD
                      </label>
                      <textarea 
                        rows={3}
                        required
                        value={formMsg}
                        onChange={(e) => setFormMsg(e.target.value)}
                        placeholder="COMPILE DATA MATRIX..." 
                        className="w-full bg-[#050505] border border-[#00ff41]/20 focus:border-[#00ff41] rounded p-2.5 font-mono text-[11px] text-omni-bright outline-none transition-colors placeholder:text-[#00ff41]/25 shadow-[0_0_5px_rgba(0,0,0,0.8)] scrollbar-thin"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={transmissionStatus !== "IDLE" && transmissionStatus !== "SUCCESS"}
                      className="w-full py-2.5 bg-gradient-to-r from-omni-dark to-[#00ff41]/20 hover:from-omni-dark hover:to-[#00ff41]/45 border border-[#00ff41] rounded shadow-[0_0_10px_rgba(0,255,65,0.15)] hover:shadow-[0_0_18px_rgba(0,255,65,0.5)] active:scale-98 transition-all font-display text-xs tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer text-glow-green"
                    >
                      SEND AUDIO_TRANSMISSION <Send size={13} className="animate-pulse" />
                    </button>

                  </form>
                  
                </div>

              </div>

            </div>
          </section>

          {/* --- FOOTER COGNIZANCE DIAL --- */}
          <footer className="mt-12 py-8 border-t border-[#00ff41]/10 bg-black/85 text-center font-mono text-[9px] text-omni-silver relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 space-y-4">
              <div className="flex justify-center gap-6 text-xs text-omni-bright">
                <a 
                  href={`mailto:${DEV_INFO.email}`}
                  onClick={playNavClickSound}
                  className="hover:text-white transition-colors"
                  title="Shoot mail"
                >
                  [ MAIL_COGNIZANCE ]
                </a>
                <a 
                  href="https://linkedin.com/in/abhiram-konge" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  onClick={playNavClickSound}
                  className="hover:text-white transition-colors"
                >
                  [ LINKEDIN_NODE ]
                </a>
                <a 
                  href="https://github.com/abhiram-konge" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  onClick={playNavClickSound}
                  className="hover:text-white transition-colors"
                >
                  [ REPOSITORY_VAULT ]
                </a>
              </div>

              <p className="tracking-widest uppercase">
                OMNITRIX TERMINAL STATIONS v1.0 // ABHIRAM KONGE PORTFOLIO INTERFACE © 2026
              </p>
              
              <div className="text-[8px] opacity-40">
                SYSTEM CALIBRATED AT UTC telemetries. NO PERSONAL COOKIES RETAINED. SECURITY INTERLOCK SAFE.
              </div>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
