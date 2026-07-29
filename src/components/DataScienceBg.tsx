import React, { useEffect, useRef } from 'react';

// ── Famous ML / DL formula strings ──
const FORMULAS = [
  // Fundamentals
  'ŷ = σ(Wᵀx + b)',
  'L(θ) = -Σ yᵢ log(ŷᵢ)',
  'σ(z) = 1 / (1 + e⁻ᶻ)',
  '∇θ J = (1/m) Xᵀ(Xθ − y)',
  'MSE = (1/n)Σ(yᵢ − ŷᵢ)²',
  'R² = 1 − SSᵣₑₛ/SSₜₒₜ',
  'Z = (X − μ) / σ',
  // Deep Learning
  'ReLU(x) = max(0, x)',
  'tanh(x) = (eˣ − e⁻ˣ)/(eˣ + e⁻ˣ)',
  'softmax(xᵢ) = eˣⁱ / Σeˣʲ',
  'dL/dW = δ · aᵀ',
  'aˡ = g(Wˡaˡ⁻¹ + bˡ)',
  'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V',
  'GELU(x) = x·Φ(x)',
  // Probability & Stats
  'P(A|B) = P(B|A)·P(A) / P(B)',
  'H(X) = −Σ p(x) log₂p(x)',
  'KL(P‖Q) = Σ P(x) log(P/Q)',
  'Var(X) = E[X²] − (E[X])²',
  'Cov(X,Y) = E[(X−μₓ)(Y−μᵧ)]',
  // Regularisation
  'λ‖w‖₁  (L1 Lasso)',
  'λ‖w‖₂²  (L2 Ridge)',
  'Dropout: p(keep) = 1−d',
  // Information
  'F1 = 2PR / (P + R)',
  'AUC = P(score+ > score−)',
  'A = UΣVᵀ  (SVD)',
  // Optimisation
  'θₜ = θₜ₋₁ − α·∇J(θ)',
  'Adam: m̂ / (√v̂ + ε)',
  // Generative / Other
  'ELBO = 𝔼[log p(x|z)] − KL',
  'G* = arg min max V(G,D)',
];

// ── Model / Architecture name tags ──
const MODEL_TAGS = [
  // Transformers & LLMs
  'BERT', 'GPT-4', 'LLaMA', 'T5', 'CLIP', 'DALL·E', 'Whisper', 'PaLM',
  // Classic DL
  'ResNet-50', 'VGG-16', 'U-Net', 'YOLO', 'EfficientNet', 'Inception',
  'MobileNet', 'DenseNet', 'AlexNet',
  // Architectures
  'Transformer', 'LSTM', 'GRU', 'CNN', 'RNN', 'Autoencoder', 'VAE', 'GAN',
  'Diffusion', 'ViT', 'BERT-base',
  // Classic ML
  'XGBoost', 'LightGBM', 'CatBoost', 'Random Forest', 'SVM', 'k-NN',
  'Naive Bayes', 'DBSCAN', 'PCA', 'ICA', 'K-Means',
  // Frameworks / Concepts
  'PyTorch', 'TensorFlow', 'scikit-learn', 'ONNX', 'Hugging Face',
];

const COLORS = ['#00ffcc', '#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24'];
const DIM_COLORS = ['#2a6655', '#3d3570', '#1a4a6e', '#6b2d52', '#1e5240', '#6b540f'];
const MATRIX_CHARS = '01αβγδεζημθλπρστφχψΣΩΔ∇∂∫≈≡∞∑∏√'.split('');

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  text: string;
  alpha: number;
  size: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  age: number;
  maxAge: number;
  isTag: boolean; // model name vs formula
};

type Neuron = {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  pulsePhase: number;
};

type Conn = {
  a: number; b: number;
  signal: number;
  active: boolean;
  speed: number;
};

type Drop = {
  x: number; y: number;
  speed: number;
  chars: string[];
  length: number;
  alpha: number;
};

function spawnParticle(W: number, H: number, forceTag?: boolean): Particle {
  // ~30% chance of a model tag, 70% formula
  const isTag = forceTag ?? Math.random() < 0.30;
  const pool = isTag ? MODEL_TAGS : FORMULAS;
  const colorPool = isTag ? DIM_COLORS : COLORS;
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * (isTag ? 0.14 : 0.22),
    vy: (Math.random() - 0.5) * (isTag ? 0.14 : 0.22),
    text: pool[Math.floor(Math.random() * pool.length)],
    // Tags are bigger but much dimmer — won't obstruct content
    alpha: isTag ? Math.random() * 0.10 + 0.04 : Math.random() * 0.18 + 0.07,
    size: isTag ? Math.random() * 6 + 13 : Math.random() * 4 + 10,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.006 + 0.002,
    color: colorPool[Math.floor(Math.random() * colorPool.length)],
    age: 0,
    maxAge: Math.random() * 700 + 400,
    isTag,
  };
}

export default function DataScienceBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    let particles: Particle[] = [];
    let neurons: Neuron[] = [];
    let connections: Conn[] = [];
    let drops: Drop[] = [];

    function initAll() {
      const W = canvas.width;
      const H = canvas.height;

      // Mixed particles: some formulas, some model tags
      particles = [
        ...Array.from({ length: 18 }, () => spawnParticle(W, H, false)), // formulas
        ...Array.from({ length: 12 }, () => spawnParticle(W, H, true)),  // model tags
      ];

      // Neural network nodes (4 layers: 3-4-4-3)
      const layers = [3, 4, 4, 3];
      neurons = [];
      connections = [];

      layers.forEach((count, li) => {
        const cx = W * (0.1 + li * 0.27);
        const spacing = H / (count + 1);
        for (let i = 0; i < count; i++) {
          neurons.push({
            x: cx + (Math.random() - 0.5) * 50,
            y: spacing * (i + 1) + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 0.10,
            vy: (Math.random() - 0.5) * 0.10,
            r: Math.random() * 3 + 3,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      });

      // Connections between adjacent layers
      let offset = 0;
      layers.forEach((count, li) => {
        if (li >= layers.length - 1) { offset += count; return; }
        const nextStart = offset + count;
        for (let a = offset; a < offset + count; a++) {
          for (let b = nextStart; b < nextStart + layers[li + 1]; b++) {
            connections.push({
              a, b,
              signal: Math.random(),
              active: Math.random() > 0.50,
              speed: Math.random() * 0.003 + 0.0008,
            });
          }
        }
        offset += count;
      });

      // Matrix rain — fewer drops, lower alpha
      const cols = Math.floor(W / 22);
      const numDrops = Math.floor(cols * 0.10);
      drops = Array.from({ length: numDrops }, () => ({
        x: Math.floor(Math.random() * cols) * 22,
        y: Math.random() * H,
        speed: Math.random() * 0.7 + 0.25,
        chars: Array.from({ length: 20 }, () =>
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ),
        length: Math.floor(Math.random() * 10) + 5,
        alpha: Math.random() * 0.14 + 0.05,
      }));
    }

    function drawScatterPlot(W: number, H: number) {
      const ox = W * 0.78, oy = H * 0.74;
      const size = Math.min(W, H) * 0.13;
      ctx.save();
      ctx.globalAlpha = 0.10;

      // Axes
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + size, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - size); ctx.stroke();

      // Tick marks
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(ox + i * size / 4, oy - 3); ctx.lineTo(ox + i * size / 4, oy + 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 3, oy - i * size / 4); ctx.lineTo(ox + 3, oy - i * size / 4); ctx.stroke();
      }

      // Regression line (pink)
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ox + 4, oy - 8); ctx.lineTo(ox + size - 4, oy - size + 8); ctx.stroke();

      // Scatter dots
      const pts = [
        [0.08, 0.12], [0.18, 0.28], [0.24, 0.22], [0.38, 0.48],
        [0.50, 0.54], [0.60, 0.63], [0.64, 0.60], [0.74, 0.79],
        [0.82, 0.84], [0.14, 0.09], [0.34, 0.40], [0.56, 0.52],
      ];
      for (const [px, py] of pts) {
        const pulse = Math.sin(t * 0.03 + px * 10) * 0.25 + 0.75;
        ctx.beginPath();
        ctx.arc(ox + px * size, oy - py * size, 2.2 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffcc';
        ctx.fill();
      }

      // Axis labels
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText('x₁', ox + size + 4, oy + 4);
      ctx.fillText('ŷ', ox - 14, oy - size);

      ctx.restore();
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      t++;

      // Trail fade
      ctx.fillStyle = 'rgba(6, 4, 18, 0.18)';
      ctx.fillRect(0, 0, W, H);

      // ── 1. Matrix rain (subtle) ──
      ctx.font = '13px monospace';
      for (const drop of drops) {
        for (let i = 0; i < drop.length; i++) {
          const isHead = i === drop.length - 1;
          const fade = i / drop.length;
          const a = isHead ? Math.min(drop.alpha * 3.5, 0.7) : drop.alpha * (1 - fade * 0.8);
          const color = isHead ? '#00ffcc' : '#7c5cbf';
          ctx.fillStyle = `rgba(${hexToRgb(color)},${a})`;
          const ch = drop.chars[(Math.floor(t * 0.04) + i) % drop.chars.length];
          ctx.fillText(ch, drop.x, drop.y - i * 22);
        }
        drop.y += drop.speed;
        if (drop.y - drop.length * 22 > H) {
          drop.y = -22;
          drop.x = Math.floor(Math.random() * Math.floor(W / 22)) * 22;
        }
      }

      // ── 2. Neural connections ──
      for (const conn of connections) {
        const na = neurons[conn.a], nb = neurons[conn.b];
        if (!na || !nb) continue;

        ctx.strokeStyle = 'rgba(80,60,140,0.07)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();

        if (conn.active) {
          conn.signal = (conn.signal + conn.speed) % 1;
          const sx = na.x + (nb.x - na.x) * conn.signal;
          const sy = na.y + (nb.y - na.y) * conn.signal;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,200,160,0.50)';
          ctx.fill();
        }
      }

      // ── 3. Neuron nodes (dim — max alpha ~0.35) ──
      for (const n of neurons) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 30) n.vx = Math.abs(n.vx);
        if (n.x > W - 30) n.vx = -Math.abs(n.vx);
        if (n.y < 30) n.vy = Math.abs(n.vy);
        if (n.y > H - 30) n.vy = -Math.abs(n.vy);

        const pulse = Math.sin(t * 0.035 + n.pulsePhase) * 0.5 + 0.5;
        const rr = n.r + pulse * 1.5;  // subtle pulse

        // Glow — half the old radius, much lower alpha
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr * 3);
        grd.addColorStop(0, `rgba(120,90,200,${0.06 + pulse * 0.04})`);
        grd.addColorStop(1, 'rgba(120,90,200,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot — small, dim
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,110,220,${0.20 + pulse * 0.15})`; // max ~0.35
        ctx.fill();
        ctx.strokeStyle = `rgba(180,160,255,${0.18 + pulse * 0.12})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ── 4. Floating formulas + model name tags ──
      ctx.textBaseline = 'middle';
      for (let i = 0; i < particles.length; i++) {
        const f = particles[i];
        f.x += f.vx;
        f.y += f.vy + Math.sin(f.wobble) * 0.08;
        f.wobble += f.wobbleSpeed;
        f.age++;

        if (f.x < -400) f.x = W + 120;
        if (f.x > W + 400) f.x = -120;
        if (f.y < -50) f.y = H + 25;
        if (f.y > H + 50) f.y = -25;

        let alpha = f.alpha;
        if (f.age < 80) alpha = f.alpha * (f.age / 80);
        else if (f.age > f.maxAge - 80) alpha = f.alpha * ((f.maxAge - f.age) / 80);
        if (f.age > f.maxAge) {
          particles[i] = spawnParticle(W, H, f.isTag);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        if (f.isTag) {
          // Model name tags: bold, very dim, with a faint bracket frame
          ctx.font = `bold ${f.size}px 'Courier New', monospace`;
          ctx.fillStyle = f.color;
          ctx.fillText(f.text, f.x, f.y);
          const w = ctx.measureText(f.text).width;
          ctx.globalAlpha = alpha * 0.4;
          ctx.strokeStyle = f.color;
          ctx.lineWidth = 0.6;
          ctx.strokeRect(f.x - 4, f.y - f.size / 2 - 3, w + 8, f.size + 6);
        } else {
          // Formula: monospace with soft glow
          ctx.font = `${f.size}px 'Courier New', monospace`;
          ctx.fillStyle = f.color;
          ctx.shadowColor = f.color;
          ctx.shadowBlur = 8;
          ctx.fillText(f.text, f.x, f.y);
        }

        ctx.restore();
      }

      // ── 5. Scatter plot (bottom-right) ──
      drawScatterPlot(W, H);

      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initAll();
    }

    window.addEventListener('resize', onResize);
    onResize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #060412 0%, #0a071e 40%, #060d18 70%, #060412 100%)',
      }}
    />
  );
}
