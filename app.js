/**
 * ஹிப்னாடிசம் & ஆழ்மன தியான பயிற்சி - JavaScript Engine
 * Pro Hypnotic Visuals + Web Audio Synthesis + Tamil Mantras + Floating Dock UI
 */

(function () {
  'use strict';

  // --- STATE CONFIGURATION ---
  const state = {
    visualMode: 'spiral', // 'spiral' | 'pendulum' | 'breathing' | 'tunnel'
    speed: 1.0,
    spiralDirection: 1, // 1 (CW) or -1 (CCW)
    colorTheme: 'violet',
    isPlaying: true,

    // Audio Engine State
    audioActive: false,
    binauralEnabled: true,
    binauralVolume: 0.6,
    tickEnabled: true,
    tickVolume: 0.4,
    tickBpm: 50,
    droneEnabled: true,
    droneVolume: 0.5,

    // Affirmation State
    showMantra: true,
    speechMantra: false,
    currentMantraIndex: 0,
    mantras: [
      "என் மனம் முழுவதும் ஆழ்ந்த அமைதியை உணர்கிறது...",
      "ஒவ்வொரு மூச்சும் என்னை அமைதி நிலைக்கு கொண்டு செல்கிறது...",
      "என் கவனம் கூர்மையாகவும் உறுதியாகவும் மாறுகிறது...",
      "என் உடல் நரம்புகள், தசைகள் அனைத்தும் தளர்வடைகின்றன...",
      "நான் எதையும் எதிர்கொள்ளும் அபார மன வலிமை கொண்டவன்...",
      "அனைத்து மன அழுத்தங்களும் மெதுவாக காற்றில் கரைகின்றன...",
      "என் ஆழ்மனம் நேர்மறை எண்ணங்களை மட்டுமே ஈர்க்கிறது...",
      "ஆழ்ந்த அமைதி... பூரண நிம்மதி...",
      "என் நினைவாற்றலும் ஒருமைப்பாடும் பல மடங்கு உயர்கிறது...",
      "நான் ஆரோக்கியமாகவும் மகிழ்ச்சியாகவும் வாழ்கிறேன்..."
    ],

    // Session Timer State
    sessionDurationSeconds: 5 * 60,
    remainingSeconds: 5 * 60,
    isTimerRunning: false,
    timerInterval: null,

    // Immersion State
    isZenActive: false,
    activeDrawer: null
  };

  // Color Palettes
  const THEMES = {
    monochrome: {
      primary: '#ffffff',
      secondary: '#111111',
      glow: 'rgba(255, 255, 255, 0.45)',
      accent: '#888888',
      bgCenter: '#080808'
    },
    violet: {
      primary: '#c084fc',
      secondary: '#4c1d95',
      glow: 'rgba(168, 85, 247, 0.55)',
      accent: '#f472b6',
      bgCenter: '#100a26'
    },
    cyan: {
      primary: '#38bdf8',
      secondary: '#075985',
      glow: 'rgba(56, 189, 248, 0.55)',
      accent: '#2dd4bf',
      bgCenter: '#051926'
    },
    golden: {
      primary: '#fde047',
      secondary: '#854d0e',
      glow: 'rgba(245, 158, 11, 0.55)',
      accent: '#f59e0b',
      bgCenter: '#1c1305'
    },
    emerald: {
      primary: '#34d399',
      secondary: '#064e3b',
      glow: 'rgba(16, 185, 129, 0.55)',
      accent: '#6ee7b7',
      bgCenter: '#041c12'
    }
  };

  // --- DOM REFERENCES ---
  const hypnoStage = document.getElementById('hypnoStage');
  const hypnoCanvas = document.getElementById('hypnoCanvas');
  const hypnoCtx = hypnoCanvas.getContext('2d');
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ambientCtx = ambientCanvas.getContext('2d');

  const breathingGuide = document.getElementById('breathingGuide');
  const breathProgressTrack = document.getElementById('breathProgressTrack');
  const breathPhaseLbl = document.getElementById('breathPhaseLbl');
  const breathSecCountdown = document.getElementById('breathSecCountdown');

  const mantraCapsule = document.getElementById('mantraCapsule');
  const mantraText = document.getElementById('mantraText');
  const mantraPillContainer = document.getElementById('mantraPillContainer');
  const newMantraInput = document.getElementById('newMantraInput');
  const addMantraBtn = document.getElementById('addMantraBtn');
  const showMantraToggle = document.getElementById('showMantraToggle');
  const speechMantraToggle = document.getElementById('speechMantraToggle');

  const headerTimerDisplay = document.getElementById('headerTimerDisplay');
  const timerPulse = document.getElementById('timerPulse');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const pauseTimerBtn = document.getElementById('pauseTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');

  const quickAudioBtn = document.getElementById('quickAudioBtn');
  const quickAudioText = document.getElementById('quickAudioText');
  const drawerAudioToggle = document.getElementById('drawerAudioToggle');
  const drawerAudioIcon = document.getElementById('drawerAudioIcon');
  const drawerAudioText = document.getElementById('drawerAudioText');

  const binauralToggle = document.getElementById('binauralToggle');
  const binauralVolumeSlider = document.getElementById('binauralVolumeSlider');
  const tickToggle = document.getElementById('tickToggle');
  const tickVolumeSlider = document.getElementById('tickVolumeSlider');
  const droneToggle = document.getElementById('droneToggle');
  const droneVolumeSlider = document.getElementById('droneVolumeSlider');

  const speedInput = document.getElementById('speedInput');
  const speedDisplay = document.getElementById('speedDisplay');
  const spiralDirRow = document.getElementById('spiralDirRow');
  const togglePlayBtn = document.getElementById('togglePlayBtn');
  const playIcon = document.getElementById('playIcon');

  const zenModeBtn = document.getElementById('zenModeBtn');
  const zenExitBtn = document.getElementById('zenExitBtn');
  const themeCycleBtn = document.getElementById('themeCycleBtn');
  const guideModalBtn = document.getElementById('guideModalBtn');

  // Brain Science Theory Modal DOM elements
  const theoryBtn = document.getElementById('theoryBtn');
  const theoryModal = document.getElementById('theoryModal');
  const theoryCloseBtn = document.getElementById('theoryCloseBtn');
  const theoryUnderstoodBtn = document.getElementById('theoryUnderstoodBtn');

  // Advanced UI DOM Elements (EEG HUD, 3D Canvas Wrap, Bio Vignette)
  const canvasWrap3D = document.getElementById('canvasWrap3D');
  const bioVignette = document.getElementById('bioVignette');
  const eegWaveCanvas = document.getElementById('eegWaveCanvas');
  const eegWaveCtx = eegWaveCanvas ? eegWaveCanvas.getContext('2d') : null;
  const eegStateName = document.getElementById('eegStateName');
  const eegDepthPct = document.getElementById('eegDepthPct');
  const eegDepthBar = document.getElementById('eegDepthBar');
  const eegPulseDot = document.getElementById('eegPulseDot');

  // --- CANVAS RESIZING ---
  let canvasW = 0;
  let canvasH = 0;
  let centerX = 0;
  let centerY = 0;

  function resizeStage() {
    const rect = hypnoStage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance

    canvasW = rect.width;
    canvasH = rect.height;

    hypnoCanvas.width = canvasW * dpr;
    hypnoCanvas.height = canvasH * dpr;
    hypnoCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix
    hypnoCtx.scale(dpr, dpr);

    ambientCanvas.width = canvasW * dpr;
    ambientCanvas.height = canvasH * dpr;
    ambientCtx.setTransform(1, 0, 0, 1, 0, 0);
    ambientCtx.scale(dpr, dpr);

    centerX = canvasW / 2;
    centerY = canvasH / 2;
  }

  window.addEventListener('resize', resizeStage);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeStage, 200);
  });

  // --- AMBIENT PARTICLES (Gravitational Vortex Physics) ---
  const particles = [];
  const PARTICLE_NUM = 75;

  function initParticles() {
    particles.length = 0;
    const maxDist = Math.max(canvasW || window.innerWidth, canvasH || window.innerHeight) * 0.75;
    for (let i = 0; i < PARTICLE_NUM; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * maxDist + 20;
      particles.push({
        angle: angle,
        dist: dist,
        r: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.25,
        speed: (Math.random() * 0.4 + 0.5),
        spinSpeed: (Math.random() * 0.008 + 0.006)
      });
    }
  }

  function drawAmbientVortex(theme) {
    ambientCtx.clearRect(0, 0, canvasW, canvasH);
    const maxDist = Math.max(canvasW, canvasH) * 0.75;

    for (const p of particles) {
      // Inward gravitational pull towards center vortex
      p.dist -= (0.55 * p.speed * state.speed);

      // Angular acceleration closer to center (Keplerian physics)
      const angularAcc = (80 / (p.dist + 50)) * 0.008;
      p.angle += (p.spinSpeed + angularAcc) * state.speed * state.spiralDirection;

      // Event horizon swallow & respawn at outer boundary
      if (p.dist <= 12) {
        p.dist = maxDist * (0.8 + Math.random() * 0.2);
        p.angle = Math.random() * Math.PI * 2;
      }

      const x = centerX + p.dist * Math.cos(p.angle);
      const y = centerY + p.dist * Math.sin(p.angle);

      // Orbital glowing tail trace
      const tailX = centerX + (p.dist + 5) * Math.cos(p.angle - 0.035 * state.spiralDirection);
      const tailY = centerY + (p.dist + 5) * Math.sin(p.angle - 0.035 * state.spiralDirection);

      ambientCtx.beginPath();
      ambientCtx.moveTo(tailX, tailY);
      ambientCtx.lineTo(x, y);
      ambientCtx.strokeStyle = theme.primary;
      ambientCtx.lineWidth = p.r * 0.75;
      ambientCtx.globalAlpha = p.alpha * 0.4;
      ambientCtx.stroke();

      // Particle Core
      ambientCtx.beginPath();
      ambientCtx.arc(x, y, p.r, 0, Math.PI * 2);
      ambientCtx.fillStyle = '#ffffff';
      ambientCtx.globalAlpha = p.alpha;
      ambientCtx.shadowBlur = 8;
      ambientCtx.shadowColor = theme.glow;
      ambientCtx.fill();
    }
    ambientCtx.globalAlpha = 1.0;
  }

  // --- LIVE NEUROLOGICAL EEG OSCILLOSCOPE SIMULATOR ---
  let eegTime = 0;
  let sessionTrainingElapsed = 0;

  function updateEegOscilloscope() {
    if (!eegWaveCtx) return;

    if (state.isTimerRunning) {
      sessionTrainingElapsed += 0.016;
    } else {
      sessionTrainingElapsed += 0.004; // Gentle progression
    }

    eegTime += 0.08 * state.speed;

    // Transition smoothly from Beta (18.5 Hz) -> Alpha (10 Hz) -> Theta (5.8 Hz)
    const tranceProgress = Math.min(sessionTrainingElapsed / 180, 1.0);
    const targetFreq = 18.5 - (tranceProgress * 12.7);
    const depthPct = Math.round(6 + (tranceProgress * 92));

    const w = eegWaveCanvas.width;
    const h = eegWaveCanvas.height;
    const midY = h / 2;

    eegWaveCtx.clearRect(0, 0, w, h);

    // Subtle grid line
    eegWaveCtx.beginPath();
    eegWaveCtx.moveTo(0, midY);
    eegWaveCtx.lineTo(w, midY);
    eegWaveCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    eegWaveCtx.lineWidth = 1;
    eegWaveCtx.stroke();

    // Waveform synthesis (sinusoid + harmonic + microvolt noise)
    eegWaveCtx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = eegTime + (x * 0.045);
      const wave = Math.sin(t * targetFreq * 0.4) * (h * 0.3) 
                 + Math.sin(t * targetFreq * 0.8) * (h * 0.12)
                 + (Math.sin(x * 0.2) * 1.5);
      const y = midY + wave;
      if (x === 0) eegWaveCtx.moveTo(x, y);
      else eegWaveCtx.lineTo(x, y);
    }

    let stateColor = '#38bdf8'; // Beta Cyan
    let stateNameText = `BETA: ${targetFreq.toFixed(1)} Hz`;
    let dotColor = '#fb923c';

    if (targetFreq <= 13.5 && targetFreq > 8.0) {
      stateColor = '#34d399'; // Alpha Emerald
      stateNameText = `ALPHA: ${targetFreq.toFixed(1)} Hz`;
      dotColor = '#34d399';
    } else if (targetFreq <= 8.0) {
      stateColor = '#c084fc'; // Theta Violet
      stateNameText = `THETA: ${targetFreq.toFixed(1)} Hz`;
      dotColor = '#c084fc';
    }

    eegWaveCtx.strokeStyle = stateColor;
    eegWaveCtx.lineWidth = 1.8;
    eegWaveCtx.shadowBlur = 8;
    eegWaveCtx.shadowColor = stateColor;
    eegWaveCtx.stroke();

    if (eegStateName) {
      eegStateName.textContent = stateNameText;
      eegStateName.style.color = stateColor;
    }
    if (eegDepthPct) eegDepthPct.textContent = `${depthPct}%`;
    if (eegDepthBar) eegDepthBar.style.width = `${depthPct}%`;
    if (eegPulseDot) {
      eegPulseDot.style.background = dotColor;
      eegPulseDot.style.boxShadow = `0 0 8px ${dotColor}`;
    }
  }

  // --- PERIPHERAL BIOFEEDBACK BREATHING GLOW ---
  function updateBioVignette(theme) {
    if (!bioVignette) return;
    const cycle = (breathElapsed % 16);
    let scale = 1;
    if (cycle < 4) scale = 0.7 + (cycle / 4) * 0.6;
    else if (cycle < 8) scale = 1.3;
    else if (cycle < 14) scale = 1.3 - ((cycle - 8) / 6) * 0.6;
    else scale = 0.7;

    const blurSpread = Math.round(90 + scale * 40);
    const insetSpread = Math.round(25 + scale * 25);
    bioVignette.style.boxShadow = `inset 0 0 ${blurSpread}px ${insetSpread}px ${theme.glow}`;
  }

  // --- VISUAL RENDERING ENGINES ---
  let animId = null;
  let spiralTheta = 0;
  let pendulumAngle = 0;
  let pendulumTime = 0;
  let breathElapsed = 0;
  let tunnelZ = 0;
  let mandalaRot = 0;

  function renderLoop() {
    if (state.isPlaying) {
      hypnoCtx.clearRect(0, 0, canvasW, canvasH);
      const theme = THEMES[state.colorTheme] || THEMES.violet;

      switch (state.visualMode) {
        case 'spiral':
          drawHypnoticSpiral(theme);
          break;
        case 'pendulum':
          drawHypnoticPendulum(theme);
          break;
        case 'breathing':
          drawBreathingEngine(theme);
          break;
        case 'tunnel':
          drawHypnoticTunnel(theme);
          break;
        case 'mandala':
          drawSacredMandala(theme);
          break;
      }

      drawAmbientVortex(theme);
      updateEegOscilloscope();
      updateBioVignette(theme);
    }
    animId = requestAnimationFrame(renderLoop);
  }

  // 1. Genuine Optical Illusion Hypnotic Spiral (Archimedean multi-arm disk)
  function drawHypnoticSpiral(theme) {
    const maxR = Math.sqrt(centerX * centerX + centerY * centerY) * 1.08;
    spiralTheta += 0.038 * state.speed * state.spiralDirection;

    hypnoCtx.save();
    hypnoCtx.translate(centerX, centerY);
    hypnoCtx.rotate(spiralTheta);

    const arms = 6;
    const turns = 10;
    const stepsPerTurn = 80;
    const totalSteps = turns * stepsPerTurn;

    for (let a = 0; a < arms; a++) {
      const armAngleStart = (a * 2 * Math.PI) / arms;
      const armAngleEnd = ((a + 0.5) * 2 * Math.PI) / arms;

      hypnoCtx.beginPath();
      hypnoCtx.moveTo(0, 0);

      // Outer curve
      for (let i = 0; i <= totalSteps; i++) {
        const frac = i / totalSteps;
        const r = frac * maxR;
        const theta = armAngleStart + (frac * turns * 2 * Math.PI);
        hypnoCtx.lineTo(r * Math.cos(theta), r * Math.sin(theta));
      }

      // Return curve
      for (let i = totalSteps; i >= 0; i--) {
        const frac = i / totalSteps;
        const r = frac * maxR;
        const theta = armAngleEnd + (frac * turns * 2 * Math.PI);
        hypnoCtx.lineTo(r * Math.cos(theta), r * Math.sin(theta));
      }

      hypnoCtx.closePath();
      hypnoCtx.fillStyle = (a % 2 === 0) ? theme.primary : theme.secondary;
      hypnoCtx.shadowBlur = 10;
      hypnoCtx.shadowColor = theme.glow;
      hypnoCtx.fill();
    }

    // Concentric hypnotic depth ripples
    for (let r = 30; r < maxR; r += 50) {
      hypnoCtx.beginPath();
      hypnoCtx.arc(0, 0, r, 0, Math.PI * 2);
      hypnoCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      hypnoCtx.lineWidth = 1.5;
      hypnoCtx.stroke();
    }

    hypnoCtx.restore();
  }

  // 2. Mesmerizing Pendulum (Physics harmonic swing with crystal bob & tick sync)
  let pendulumTriggeredTick = false;
  function drawHypnoticPendulum(theme) {
    pendulumTime += 0.024 * state.speed;
    const maxTheta = Math.PI / 4.4; // ~40 degrees
    pendulumAngle = maxTheta * Math.sin(pendulumTime);

    // Audio-visual synchrony: tick when crossing center
    if (Math.abs(pendulumAngle) < 0.03 && !pendulumTriggeredTick) {
      if (state.audioActive && state.tickEnabled) {
        triggerMetronomeTick();
      }
      pendulumTriggeredTick = true;
    } else if (Math.abs(pendulumAngle) > 0.15) {
      pendulumTriggeredTick = false;
    }

    const cordLen = Math.min(canvasH * 0.58, 300);
    const pivotX = centerX;
    const pivotY = 25;

    const bobX = pivotX + cordLen * Math.sin(pendulumAngle);
    const bobY = pivotY + cordLen * Math.cos(pendulumAngle);

    hypnoCtx.save();

    // Pivot Pin
    hypnoCtx.beginPath();
    hypnoCtx.arc(pivotX, pivotY, 9, 0, Math.PI * 2);
    hypnoCtx.fillStyle = theme.primary;
    hypnoCtx.shadowBlur = 14;
    hypnoCtx.shadowColor = theme.glow;
    hypnoCtx.fill();

    // Arc Path guideline (faint)
    hypnoCtx.beginPath();
    hypnoCtx.arc(pivotX, pivotY, cordLen, Math.PI / 2 - maxTheta, Math.PI / 2 + maxTheta);
    hypnoCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    hypnoCtx.lineWidth = 2;
    hypnoCtx.setLineDash([5, 6]);
    hypnoCtx.stroke();
    hypnoCtx.setLineDash([]);

    // Metallic Cord
    hypnoCtx.beginPath();
    hypnoCtx.moveTo(pivotX, pivotY);
    hypnoCtx.lineTo(bobX, bobY);
    hypnoCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    hypnoCtx.lineWidth = 2.5;
    hypnoCtx.stroke();

    // Glowing Bob (Pocket watch / Amethyst Crystal)
    const bobR = 26;

    // Outer glow aura
    hypnoCtx.beginPath();
    hypnoCtx.arc(bobX, bobY, bobR * 1.5, 0, Math.PI * 2);
    hypnoCtx.fillStyle = theme.glow;
    hypnoCtx.globalAlpha = 0.35;
    hypnoCtx.fill();
    hypnoCtx.globalAlpha = 1.0;

    // Bob Body Gradient
    hypnoCtx.beginPath();
    hypnoCtx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    const grad = hypnoCtx.createRadialGradient(
      bobX - bobR * 0.3, bobY - bobR * 0.3, 3,
      bobX, bobY, bobR
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, theme.primary);
    grad.addColorStop(0.85, theme.secondary);
    grad.addColorStop(1, '#05030d');

    hypnoCtx.fillStyle = grad;
    hypnoCtx.shadowBlur = 25;
    hypnoCtx.shadowColor = theme.glow;
    hypnoCtx.fill();

    // Decorative inner concentric rings on bob
    hypnoCtx.beginPath();
    hypnoCtx.arc(bobX, bobY, bobR * 0.55, 0, Math.PI * 2);
    hypnoCtx.strokeStyle = '#ffffff';
    hypnoCtx.lineWidth = 1.5;
    hypnoCtx.stroke();

    hypnoCtx.beginPath();
    hypnoCtx.arc(bobX, bobY, bobR * 0.22, 0, Math.PI * 2);
    hypnoCtx.fillStyle = '#ffffff';
    hypnoCtx.fill();

    hypnoCtx.restore();
  }

  // 3. Pranayama 4-4-6 Breathing Guide & Aura Portal
  const TOTAL_BREATH_CYCLE = 16; // 4s inhale, 4s hold, 6s exhale, 2s rest
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 90; // ~565.48

  function drawBreathingEngine(theme) {
    breathElapsed += (0.016 * state.speed);
    const cyclePos = breathElapsed % TOTAL_BREATH_CYCLE;

    let phaseName = "";
    let phaseProgress = 0;
    let radiusScale = 1;
    let secCountdown = 0;

    if (cyclePos < 4) {
      // Inhale
      phaseName = "மூச்சை உள்ளிழுக்கவும் (Inhale)";
      phaseProgress = cyclePos / 4;
      radiusScale = 0.65 + (phaseProgress * 0.55);
      secCountdown = 4 - Math.floor(cyclePos);
    } else if (cyclePos < 8) {
      // Hold
      phaseName = "மூச்சை அடக்கி வைக்கவும் (Hold)";
      phaseProgress = (cyclePos - 4) / 4;
      radiusScale = 1.2;
      secCountdown = 4 - Math.floor(cyclePos - 4);
    } else if (cyclePos < 14) {
      // Exhale
      phaseName = "மெதுவாக வெளியிடவும் (Exhale)";
      phaseProgress = (cyclePos - 8) / 6;
      radiusScale = 1.2 - (phaseProgress * 0.55);
      secCountdown = 6 - Math.floor(cyclePos - 8);
    } else {
      // Rest
      phaseName = "அமைதி (Rest)";
      phaseProgress = (cyclePos - 14) / 2;
      radiusScale = 0.65;
      secCountdown = 2 - Math.floor(cyclePos - 14);
    }

    // Update SVG and Labels
    breathPhaseLbl.textContent = phaseName;
    breathSecCountdown.textContent = secCountdown;

    // Update circular SVG stroke dash offset
    const totalCycleProgress = cyclePos / TOTAL_BREATH_CYCLE;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - totalCycleProgress);
    breathProgressTrack.style.strokeDashoffset = offset;

    // Render Canvas Aura
    hypnoCtx.save();
    hypnoCtx.translate(centerX, centerY);

    const baseR = Math.min(canvasW, canvasH) * 0.22;
    const currentR = baseR * radiusScale;

    // Expanding shockwave ripples
    for (let i = 4; i >= 1; i--) {
      const ringR = currentR * (1 + i * 0.18);
      hypnoCtx.beginPath();
      hypnoCtx.arc(0, 0, ringR, 0, Math.PI * 2);
      hypnoCtx.strokeStyle = theme.primary;
      hypnoCtx.globalAlpha = 0.14 / i;
      hypnoCtx.lineWidth = 3;
      hypnoCtx.stroke();
    }

    // Center Energy Orb
    hypnoCtx.beginPath();
    hypnoCtx.arc(0, 0, currentR, 0, Math.PI * 2);
    const grad = hypnoCtx.createRadialGradient(0, 0, currentR * 0.2, 0, 0, currentR);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, theme.primary);
    grad.addColorStop(1, 'rgba(88, 28, 135, 0.1)');

    hypnoCtx.globalAlpha = 0.85;
    hypnoCtx.fillStyle = grad;
    hypnoCtx.shadowBlur = 35;
    hypnoCtx.shadowColor = theme.glow;
    hypnoCtx.fill();

    hypnoCtx.restore();
  }

  // 4. Infinite Perspective Hypnotic Tunnel
  function drawHypnoticTunnel(theme) {
    tunnelZ = (tunnelZ + 0.018 * state.speed) % 1;

    hypnoCtx.save();
    hypnoCtx.translate(centerX, centerY);

    const maxR = Math.max(canvasW, canvasH) * 0.8;
    const ringCount = 20;

    for (let i = ringCount; i >= 1; i--) {
      const progress = (i + tunnelZ) / ringCount;
      const r = progress * progress * maxR;

      if (r <= 2) continue;

      hypnoCtx.beginPath();
      hypnoCtx.arc(0, 0, r, 0, Math.PI * 2);

      const alpha = Math.min(1, progress * 1.4);
      hypnoCtx.strokeStyle = (i % 2 === 0) ? theme.primary : theme.accent;
      hypnoCtx.globalAlpha = alpha;
      hypnoCtx.lineWidth = Math.max(1.8, progress * 8);
      hypnoCtx.shadowBlur = 18;
      hypnoCtx.shadowColor = theme.glow;
      hypnoCtx.stroke();
    }

    // Stargate Tunnel Spokes
    const spokes = 12;
    for (let s = 0; s < spokes; s++) {
      const angle = (s * 2 * Math.PI) / spokes + (tunnelZ * 0.4);
      hypnoCtx.beginPath();
      hypnoCtx.moveTo(0, 0);
      hypnoCtx.lineTo(maxR * Math.cos(angle), maxR * Math.sin(angle));
      hypnoCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      hypnoCtx.lineWidth = 1;
      hypnoCtx.stroke();
    }

    hypnoCtx.restore();
  }

  // 5. Sacred Geometry Trance Mandala (Flower of Life & Metatron Multi-Polygon Lotus)
  function drawSacredMandala(theme) {
    mandalaRot += 0.012 * state.speed * state.spiralDirection;
    const maxR = Math.min(canvasW, canvasH) * 0.44;

    hypnoCtx.save();
    hypnoCtx.translate(centerX, centerY);

    const layers = 6;
    for (let l = 1; l <= layers; l++) {
      const layerR = (l / layers) * maxR;
      const rotDir = (l % 2 === 0) ? 1 : -1;
      const layerAngle = mandalaRot * rotDir * (1 + l * 0.15);
      const points = 6 + (l * 3); // 9, 12, 15, 18, 21, 24

      hypnoCtx.save();
      hypnoCtx.rotate(layerAngle);

      // Star Polygon / Lotus Petals
      hypnoCtx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const theta = (i * Math.PI) / points;
        const r = (i % 2 === 0) ? layerR : layerR * 0.58;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        if (i === 0) hypnoCtx.moveTo(x, y);
        else hypnoCtx.lineTo(x, y);
      }
      hypnoCtx.closePath();

      hypnoCtx.strokeStyle = (l % 2 === 0) ? theme.primary : theme.accent;
      hypnoCtx.lineWidth = 1.8;
      hypnoCtx.shadowBlur = 12;
      hypnoCtx.shadowColor = theme.glow;
      hypnoCtx.stroke();

      // Flower of Life Overlapping Sacred Arcs
      if (l >= 2) {
        for (let p = 0; p < points; p += 2) {
          const theta = (p * Math.PI) / points;
          const cx = (layerR * 0.68) * Math.cos(theta);
          const cy = (layerR * 0.68) * Math.sin(theta);
          hypnoCtx.beginPath();
          hypnoCtx.arc(cx, cy, layerR * 0.32, 0, Math.PI * 2);
          hypnoCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          hypnoCtx.lineWidth = 1.2;
          hypnoCtx.stroke();
        }
      }

      hypnoCtx.restore();
    }

    // Concentric shimmering core
    hypnoCtx.beginPath();
    hypnoCtx.arc(0, 0, maxR * 0.16, 0, Math.PI * 2);
    hypnoCtx.fillStyle = theme.glow;
    hypnoCtx.globalAlpha = 0.45;
    hypnoCtx.fill();
    hypnoCtx.globalAlpha = 1.0;

    hypnoCtx.restore();
  }

  // --- WEB AUDIO API ENGINE ---
  let audioCtx = null;
  let masterGain = null;
  let binauralGain = null;
  let tickGain = null;
  let droneGain = null;
  let leftOsc = null;
  let rightOsc = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let metronomeTimer = null;

  function initAudioContext() {
    if (audioCtx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // 1. Binaural Beats (200Hz + 206Hz = 6Hz Theta Trance)
    binauralGain = audioCtx.createGain();
    binauralGain.gain.setValueAtTime(state.binauralEnabled ? state.binauralVolume : 0, audioCtx.currentTime);
    binauralGain.connect(masterGain);

    const merger = audioCtx.createChannelMerger(2);

    leftOsc = audioCtx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(200, audioCtx.currentTime);

    rightOsc = audioCtx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(206, audioCtx.currentTime);

    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);
    merger.connect(binauralGain);

    leftOsc.start();
    rightOsc.start();

    // 2. Cosmic Om Drone (432Hz harmonic series with lowpass filter)
    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(state.droneEnabled ? state.droneVolume * 0.22 : 0, audioCtx.currentTime);

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(400, audioCtx.currentTime);

    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(108, audioCtx.currentTime); // 432 / 4

    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(216, audioCtx.currentTime); // 432 / 2

    droneOsc1.connect(lowpass);
    droneOsc2.connect(lowpass);
    lowpass.connect(droneGain);
    droneGain.connect(masterGain);

    droneOsc1.start();
    droneOsc2.start();

    // 3. Metronome Gain & Loop
    tickGain = audioCtx.createGain();
    tickGain.gain.setValueAtTime(state.tickEnabled ? state.tickVolume : 0, audioCtx.currentTime);
    tickGain.connect(masterGain);

    startMetronomeLoop();
  }

  function triggerMetronomeTick() {
    if (!audioCtx || !state.tickEnabled || !state.audioActive) return;

    try {
      const osc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.038);

      clickGain.gain.setValueAtTime(state.tickVolume * 0.45, audioCtx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.038);

      osc.connect(clickGain);
      clickGain.connect(tickGain);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio clock safety
    }
  }

  function startMetronomeLoop() {
    if (metronomeTimer) clearInterval(metronomeTimer);
    if (!state.tickEnabled) return;

    const intervalMs = (60 / state.tickBpm) * 1000;
    metronomeTimer = setInterval(() => {
      // In pendulum mode, the visual physics triggers the tick.
      // In other modes, run regular rhythmic metronome.
      if (state.visualMode !== 'pendulum') {
        triggerMetronomeTick();
      }
    }, intervalMs);
  }

  // Tibetan Bell / Singing Bowl Chime
  function playSingingBowlChime() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const harmonics = [260, 520, 780, 1040];
    harmonics.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const decayTime = 4.0 - idx * 0.6;
      const vol = 0.28 / (idx + 1);

      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + decayTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + decayTime);
    });
  }

  function toggleAudio() {
    if (!state.audioActive) {
      if (!audioCtx) {
        initAudioContext();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      state.audioActive = true;
      quickAudioBtn.classList.add('active');
      quickAudioText.textContent = 'ஒலி இயங்குகிறது';

      drawerAudioToggle.classList.add('playing');
      drawerAudioIcon.textContent = '⏸';
      drawerAudioText.textContent = 'ஒலியை நிறுத்து';
    } else {
      if (audioCtx) {
        audioCtx.suspend();
      }
      state.audioActive = false;
      quickAudioBtn.classList.remove('active');
      quickAudioText.textContent = 'ஆழ்நிலை ஒலி';

      drawerAudioToggle.classList.remove('playing');
      drawerAudioIcon.textContent = '▶';
      drawerAudioText.textContent = 'ஒலியைத் தொடங்கு';
    }
  }

  // --- TAMIL MANTRAS & AUTOSUGGESTIONS ---
  let mantraInterval = null;

  function renderMantraPills() {
    mantraPillContainer.innerHTML = '';
    state.mantras.forEach((m, idx) => {
      const pill = document.createElement('div');
      pill.className = `mantra-pill ${idx === state.currentMantraIndex ? 'current' : ''}`;
      pill.innerHTML = `
        <span>${escapeHtml(m)}</span>
        <span class="mantra-del" data-index="${idx}" title="நீக்கு">&times;</span>
      `;
      mantraPillContainer.appendChild(pill);
    });
  }

  function cycleNextMantra() {
    if (!state.showMantra || state.mantras.length === 0) {
      mantraCapsule.style.display = 'none';
      return;
    }
    mantraCapsule.style.display = 'flex';

    state.currentMantraIndex = (state.currentMantraIndex + 1) % state.mantras.length;
    const cur = state.mantras[state.currentMantraIndex];

    mantraCapsule.style.opacity = '0';
    mantraCapsule.style.transform = 'translate(-50%, 12px)';

    setTimeout(() => {
      mantraText.textContent = cur;
      mantraCapsule.style.opacity = '1';
      mantraCapsule.style.transform = 'translate(-50%, 0)';
      renderMantraPills();

      if (state.speechMantra && 'speechSynthesis' in window) {
        speakTamilMantra(cur);
      }
    }, 350);
  }

  function speakTamilMantra(text) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ta-IN';
    utt.rate = 0.82; // Calming trance cadence
    utt.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.includes('ta') || v.lang.includes('Tamil'));
    if (tamilVoice) utt.voice = tamilVoice;

    window.speechSynthesis.speak(utt);
  }

  function startMantraCycle() {
    if (mantraInterval) clearInterval(mantraInterval);
    cycleNextMantra();
    mantraInterval = setInterval(cycleNextMantra, 8500);
  }

  // --- SESSION TIMER ENGINE ---
  function formatMinutesSeconds(sec) {
    if (sec <= 0 && state.sessionDurationSeconds === 0) {
      return "∞ தொடர்";
    }
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateTimerUI() {
    headerTimerDisplay.textContent = formatMinutesSeconds(state.remainingSeconds);
  }

  function startTimer() {
    if (state.isTimerRunning) return;

    state.isTimerRunning = true;
    startTimerBtn.disabled = true;
    pauseTimerBtn.disabled = false;
    timerPulse.classList.remove('paused');

    // Auto-start audio if not running
    if (!state.audioActive) {
      toggleAudio();
    }

    state.timerInterval = setInterval(() => {
      if (state.sessionDurationSeconds > 0) {
        state.remainingSeconds--;
        updateTimerUI();

        if (state.remainingSeconds <= 0) {
          clearInterval(state.timerInterval);
          state.isTimerRunning = false;
          startTimerBtn.disabled = false;
          pauseTimerBtn.disabled = true;
          timerPulse.classList.add('paused');

          playSingingBowlChime();
          showCompletionBanner();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!state.isTimerRunning) return;
    clearInterval(state.timerInterval);
    state.isTimerRunning = false;
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
    timerPulse.classList.add('paused');
  }

  function resetTimer() {
    pauseTimer();
    state.remainingSeconds = state.sessionDurationSeconds;
    updateTimerUI();
  }

  function showCompletionBanner() {
    mantraText.textContent = "🌸 பயிற்சி இனிதே நிறைவடைந்தது! மெதுவாக கண்களைத் திறந்து புத்துணர்ச்சியை உணருங்கள்...";
    mantraCapsule.style.borderColor = "#10b981";
    mantraCapsule.style.boxShadow = "0 0 35px rgba(16, 185, 129, 0.5)";

    setTimeout(() => {
      mantraCapsule.style.borderColor = "";
      mantraCapsule.style.boxShadow = "";
    }, 8000);
  }

  // --- DRAWER & IMMERSION CONTROLS ---
  function closeAllDrawers() {
    document.querySelectorAll('.dock-drawer').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.dock-tool-btn').forEach(b => b.classList.remove('active-drawer'));
    state.activeDrawer = null;
  }

  function toggleDrawer(drawerId) {
    const target = document.getElementById(drawerId);
    if (!target) return;

    const wasOpen = target.classList.contains('open');
    closeAllDrawers();

    if (!wasOpen) {
      target.classList.add('open');
      const trigger = document.querySelector(`.dock-tool-btn[data-drawer="${drawerId}"]`);
      if (trigger) trigger.classList.add('active-drawer');
      state.activeDrawer = drawerId;
    }
  }

  function toggleZenMode() {
    document.body.classList.toggle('zen-active');
    state.isZenActive = document.body.classList.contains('zen-active');
    closeAllDrawers();

    if (state.isZenActive) {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // --- EVENT ATTACHMENTS ---
  function setupEventListeners() {
    // Mode Buttons in Dock
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.dataset.visual;
        state.visualMode = mode;

        if (mode === 'breathing') {
          breathingGuide.classList.add('active');
        } else {
          breathingGuide.classList.remove('active');
        }

        if (mode === 'spiral' || mode === 'mandala') {
          spiralDirRow.style.display = 'flex';
        } else {
          spiralDirRow.style.display = 'none';
        }
      });
    });

    // Drawer Toggles
    document.querySelectorAll('.dock-tool-btn.has-drawer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer(btn.dataset.drawer);
      });
    });

    // Close Drawers
    document.querySelectorAll('.drawer-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDrawers();
      });
    });

    // Click outside drawer closes it
    document.addEventListener('click', (e) => {
      if (state.activeDrawer && !e.target.closest('.dock-drawer') && !e.target.closest('.dock-tool-btn')) {
        closeAllDrawers();
      }
    });

    // Play/Pause Visual Animation
    togglePlayBtn.addEventListener('click', () => {
      state.isPlaying = !state.isPlaying;
      playIcon.textContent = state.isPlaying ? '⏸' : '▶';
    });

    // Speed Slider
    speedInput.addEventListener('input', (e) => {
      state.speed = parseFloat(e.target.value);
      speedDisplay.textContent = state.speed.toFixed(1) + 'x';
    });

    // Theme Chips
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.colorTheme = chip.dataset.theme;
      });
    });

    // Header Theme Cycle
    const themeKeys = Object.keys(THEMES);
    themeCycleBtn.addEventListener('click', () => {
      const idx = themeKeys.indexOf(state.colorTheme);
      const nextTheme = themeKeys[(idx + 1) % themeKeys.length];
      state.colorTheme = nextTheme;

      document.querySelectorAll('.theme-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.theme === nextTheme);
      });
    });

    // Spiral Direction Buttons
    document.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dir-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.spiralDirection = parseInt(btn.dataset.dir, 10);
      });
    });

    // Audio Toggles
    quickAudioBtn.addEventListener('click', toggleAudio);
    drawerAudioToggle.addEventListener('click', toggleAudio);

    binauralToggle.addEventListener('change', (e) => {
      state.binauralEnabled = e.target.checked;
      if (binauralGain && audioCtx) {
        binauralGain.gain.setValueAtTime(state.binauralEnabled ? state.binauralVolume : 0, audioCtx.currentTime);
      }
    });

    binauralVolumeSlider.addEventListener('input', (e) => {
      state.binauralVolume = parseFloat(e.target.value);
      if (binauralGain && state.binauralEnabled && audioCtx) {
        binauralGain.gain.setValueAtTime(state.binauralVolume, audioCtx.currentTime);
      }
    });

    tickToggle.addEventListener('change', (e) => {
      state.tickEnabled = e.target.checked;
      if (tickGain && audioCtx) {
        tickGain.gain.setValueAtTime(state.tickEnabled ? state.tickVolume : 0, audioCtx.currentTime);
      }
      startMetronomeLoop();
    });

    tickVolumeSlider.addEventListener('input', (e) => {
      state.tickVolume = parseFloat(e.target.value);
      if (tickGain && state.tickEnabled && audioCtx) {
        tickGain.gain.setValueAtTime(state.tickVolume, audioCtx.currentTime);
      }
    });

    droneToggle.addEventListener('change', (e) => {
      state.droneEnabled = e.target.checked;
      if (droneGain && audioCtx) {
        droneGain.gain.setValueAtTime(state.droneEnabled ? state.droneVolume * 0.22 : 0, audioCtx.currentTime);
      }
    });

    droneVolumeSlider.addEventListener('input', (e) => {
      state.droneVolume = parseFloat(e.target.value);
      if (droneGain && state.droneEnabled && audioCtx) {
        droneGain.gain.setValueAtTime(state.droneVolume * 0.22, audioCtx.currentTime);
      }
    });

    // Mantras
    showMantraToggle.addEventListener('change', (e) => {
      state.showMantra = e.target.checked;
      mantraCapsule.style.display = state.showMantra ? 'flex' : 'none';
    });

    speechMantraToggle.addEventListener('change', (e) => {
      state.speechMantra = e.target.checked;
      if (state.speechMantra) {
        speakTamilMantra(state.mantras[state.currentMantraIndex]);
      }
    });

    function addNewMantra() {
      const val = newMantraInput.value.trim();
      if (val) {
        state.mantras.push(val);
        newMantraInput.value = '';
        renderMantraPills();
      }
    }

    addMantraBtn.addEventListener('click', addNewMantra);
    newMantraInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addNewMantra();
    });

    mantraPillContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('mantra-del')) {
        const idx = parseInt(e.target.dataset.index, 10);
        state.mantras.splice(idx, 1);
        renderMantraPills();
      }
    });

    // Timer Preset Chips
    document.querySelectorAll('.timer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.timer-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const mins = parseInt(chip.dataset.mins, 10);
        state.sessionDurationSeconds = mins * 60;
        state.remainingSeconds = mins * 60;
        resetTimer();
      });
    });

    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);

    // Zen Mode / Fullscreen
    zenModeBtn.addEventListener('click', toggleZenMode);
    zenExitBtn.addEventListener('click', toggleZenMode);

    // Double-click on stage enters Zen Immersion Mode
    hypnoStage.addEventListener('dblclick', toggleZenMode);

    // 3D Holographic Parallax Tilt Effect on Hypno Stage
    hypnoStage.addEventListener('mousemove', (e) => {
      if (!canvasWrap3D || state.isZenActive) return;
      const rect = hypnoStage.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      const tiltX = (-normY * 11).toFixed(2);
      const tiltY = (normX * 11).toFixed(2);

      canvasWrap3D.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    hypnoStage.addEventListener('mouseleave', () => {
      if (canvasWrap3D) {
        canvasWrap3D.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      }
    });

    // Touch Parallax Support for Mobile & Tablet Screens
    hypnoStage.addEventListener('touchmove', (e) => {
      if (!canvasWrap3D || state.isZenActive || !e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = hypnoStage.getBoundingClientRect();
      const normX = (touch.clientX - rect.left) / rect.width - 0.5;
      const normY = (touch.clientY - rect.top) / rect.height - 0.5;

      const tiltX = (-normY * 8.5).toFixed(2);
      const tiltY = (normX * 8.5).toFixed(2);

      canvasWrap3D.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }, { passive: true });

    hypnoStage.addEventListener('touchend', () => {
      if (canvasWrap3D) {
        canvasWrap3D.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      }
    });

    // Mobile Swipe-Down to Dismiss Drawers
    let touchStartY = 0;
    document.querySelectorAll('.dock-drawer').forEach(drawer => {
      drawer.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      drawer.addEventListener('touchmove', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY;
        // If swiping down from the header or drag pill, close drawer
        if (diff > 90 && (e.target.closest('.drawer-drag-pill') || e.target.closest('.drawer-header'))) {
          closeAllDrawers();
        }
      }, { passive: true });
    });

    // Master Lightbox Tabs & Modal Controller
    function openLightboxTab(tabKey) {
      if (!theoryModal) return;
      theoryModal.classList.add('open');

      // Update all tabs
      document.querySelectorAll('.ttab-btn').forEach(btn => {
        const isMatch = (btn.dataset.theory === tabKey);
        btn.classList.toggle('active', isMatch);
      });

      // Update all sections
      document.querySelectorAll('.theory-section').forEach(sec => {
        const isMatch = (sec.id === `ttab-${tabKey}`);
        sec.classList.toggle('active', isMatch);
      });

      // Scroll active tab into view in tabs bar
      const activeBtn = document.querySelector(`.ttab-btn[data-theory="${tabKey}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      // Reset content scroll to top
      const theoryBody = document.querySelector('.theory-body');
      if (theoryBody) theoryBody.scrollTop = 0;
    }

    const closeLightbox = () => {
      if (theoryModal) theoryModal.classList.remove('open');
    };

    // Open from Header Buttons
    if (guideModalBtn) {
      guideModalBtn.addEventListener('click', () => openLightboxTab('guide'));
    }
    if (theoryBtn) {
      theoryBtn.addEventListener('click', () => openLightboxTab('waves'));
    }

    // Modal Close Triggers
    if (theoryCloseBtn) theoryCloseBtn.addEventListener('click', closeLightbox);
    if (theoryUnderstoodBtn) theoryUnderstoodBtn.addEventListener('click', closeLightbox);
    if (theoryModal) {
      theoryModal.addEventListener('click', (e) => {
        if (e.target === theoryModal) closeLightbox();
      });
    }

    // Lightbox Tab Buttons Click Handler
    document.querySelectorAll('.ttab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightboxTab(btn.dataset.theory);
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (theoryModal && theoryModal.classList.contains('open')) {
          closeLightbox();
        } else if (state.activeDrawer) {
          closeAllDrawers();
        } else if (state.isZenActive) {
          toggleZenMode();
        }
      } else if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayBtn.click();
      } else if (e.key === 'm' || e.key === 'M') {
        if (e.target.tagName !== 'INPUT') toggleAudio();
      } else if (e.key === 'f' || e.key === 'F') {
        if (e.target.tagName !== 'INPUT') toggleZenMode();
      }
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- INITIALIZATION ---
  function init() {
    resizeStage();
    initParticles();
    renderMantraPills();
    startMantraCycle();
    updateTimerUI();
    setupEventListeners();
    renderLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
