import React, { useEffect, useRef } from 'react';

// ── Achievement / Coding vocabulary that floats in the background ──
const ACHIEVE_TOKENS = [
  // LeetCode
  'O(log n)', 'O(n²)', 'Two Pointers', 'Sliding Window', 'BFS', 'DFS',
  'Dynamic Prog.', 'Memoization', 'Greedy', 'Backtracking', 'Divide & Conquer',
  'Hash Map', 'Stack', 'Heap', 'Trie', 'Union-Find', 'Segment Tree',
  // Hackathon / Dev
  'git commit', 'npm run dev', '200 OK', 'API_KEY', 'docker build',
  'POST /submit', 'JWT Auth', 'WebSocket', 'REST API', 'GraphQL',
  // Competitive
  '#1 Global', 'Top 8%', '1842 Rating', '68 Day Streak', 'Expert',
  'accepted', 'runtime: 0ms', 'beats 99.9%', 'new record',
  // Coding
  'fn solve()', 'return dp[n]', 'while l <= r', 'mid = (l+r)>>1',
  'heapq.push', 'collections.deque', 'sys.setrecursionlimit',
];

const COLORS_BRIGHT = ['#f59e0b', '#fbbf24', '#fcd34d', '#00e5a0', '#00ffcc', '#a78bfa', '#f472b6', '#38bdf8'];
const COLORS_DIM    = ['#3a2a05', '#2a4a3a', '#2a1a5e', '#3a0a2a'];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/* ── Types ── */
type FloatToken = {
  x: number; y: number; vx: number; vy: number;
  text: string; alpha: number; size: number;
  color: string; wobble: number; wobbleSpeed: number;
  age: number; maxAge: number;
};

type Star = { x: number; y: number; r: number; pulse: number; speed: number; alpha: number };

type Meteor = {
  x: number; y: number; vx: number; vy: number;
  len: number; alpha: number; life: number; maxLife: number;
  color: string;
};

type ConstellationNode = { x: number; y: number; pulse: number; speed: number };
type ConstellationEdge = { a: ConstellationNode; b: ConstellationNode; signal: number; active: boolean; sspeed: number };

/* ── Spawn helpers ── */
function spawnToken(W: number, H: number): FloatToken {
  const bright = Math.random() < 0.25;
  const col = bright
    ? COLORS_BRIGHT[Math.floor(Math.random() * COLORS_BRIGHT.length)]
    : COLORS_DIM[Math.floor(Math.random() * COLORS_DIM.length)];
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    text: ACHIEVE_TOKENS[Math.floor(Math.random() * ACHIEVE_TOKENS.length)],
    alpha: bright ? Math.random() * 0.22 + 0.10 : Math.random() * 0.08 + 0.03,
    size: Math.random() * 4 + 10,
    color: col,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.007 + 0.002,
    age: 0,
    maxAge: Math.random() * 600 + 400,
  };
}

function spawnMeteor(W: number, H: number): Meteor {
  const angle = (Math.random() * 30 + 15) * (Math.PI / 180); // 15°-45° downward
  const spd = Math.random() * 6 + 4;
  const col = COLORS_BRIGHT[Math.floor(Math.random() * 4)]; // gold/amber/green
  return {
    x: Math.random() * W,
    y: Math.random() * H * 0.6,
    vx: Math.cos(angle) * spd,
    vy: Math.sin(angle) * spd,
    len: Math.random() * 80 + 60,
    alpha: Math.random() * 0.5 + 0.3,
    life: 0,
    maxLife: Math.floor(Math.random() * 40 + 25),
    color: col,
  };
}

/* ════════════════════════════════════════════════════════ */
export default function TrophyRoomBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    let tokens: FloatToken[] = [];
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let cNodes: ConstellationNode[] = [];
    let cEdges: ConstellationEdge[] = [];

    /* ── Progress bars (top-left, subtle) ── */
    const BARS = [
      { label: 'Easy', val: 198, max: 800, color: '#00e5a0' },
      { label: 'Med',  val: 185, max: 1600, color: '#f59e0b' },
      { label: 'Hard', val: 44,  max: 700,  color: '#f87171' },
    ];

    function initAll() {
      const W = canvas.width;
      const H = canvas.height;

      // Floating achievement tokens
      tokens = Array.from({ length: 35 }, () => spawnToken(W, H));

      // Starfield — two layers: tiny dim + tiny bright
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.004,
        alpha: Math.random() * 0.5 + 0.1,
      }));

      // Constellation network (trophy-star shape grid)
      cNodes = [];
      cEdges = [];
      const POINTS = 18;
      for (let i = 0; i < POINTS; i++) {
        const angle = (i / POINTS) * Math.PI * 2;
        const rr = (i % 3 === 0 ? 0.38 : 0.28) * Math.min(W, H) * 0.5;
        const cx = W * 0.5 + Math.cos(angle) * rr * (0.8 + Math.random() * 0.4);
        const cy = H * 0.5 + Math.sin(angle) * rr * (0.8 + Math.random() * 0.4);
        cNodes.push({ x: cx, y: cy, pulse: Math.random() * Math.PI * 2, speed: Math.random() * 0.01 + 0.005 });
      }
      // Connect each node to next 2 in ring + random cross-links
      for (let i = 0; i < cNodes.length; i++) {
        for (let skip = 1; skip <= 2; skip++) {
          const j = (i + skip) % cNodes.length;
          cEdges.push({
            a: cNodes[i], b: cNodes[j],
            signal: Math.random(),
            active: Math.random() > 0.4,
            sspeed: Math.random() * 0.004 + 0.001,
          });
        }
      }
    }

    /* ── Central nebula / glow ── */
    function drawNebula(W: number, H: number) {
      const cx = W * 0.5, cy = H * 0.5;
      const r = Math.min(W, H) * 0.22;
      const pulse = Math.sin(t * 0.008) * 0.5 + 0.5;

      // Outer amber glow
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * (1.4 + pulse * 0.2));
      g1.addColorStop(0, `rgba(245,158,11,${0.025 + pulse * 0.01})`);
      g1.addColorStop(0.5, `rgba(251,191,36,${0.015})`);
      g1.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.save();
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(cx, cy, r * (1.4 + pulse * 0.2), 0, Math.PI * 2);
      ctx.fill();

      // Inner cyan-green glow
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7);
      g2.addColorStop(0, `rgba(0,255,204,${0.04 + pulse * 0.02})`);
      g2.addColorStop(1, 'rgba(0,255,204,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ── Constellation ring ── */
    function drawConstellation() {
      // Edges
      for (const e of cEdges) {
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.stroke();

        // Signal dot
        if (e.active) {
          e.signal = (e.signal + e.sspeed) % 1;
          const sx = e.a.x + dx * e.signal;
          const sy = e.a.y + dy * e.signal;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
          ctx.fill();
        }
        ctx.restore();
      }

      // Nodes
      for (const n of cNodes) {
        n.pulse += n.speed;
        const glow = (Math.sin(n.pulse) + 1) * 0.5;
        ctx.save();
        // Outer glow ring
        ctx.globalAlpha = glow * 0.12;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6 + glow * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fill();
        // Core
        ctx.globalAlpha = 0.3 + glow * 0.25;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2 + glow * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Starfield ── */
    function drawStars() {
      for (const s of stars) {
        s.pulse += s.speed;
        const a = s.alpha * ((Math.sin(s.pulse) + 1) * 0.4 + 0.2);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Meteors / shooting stars ── */
    function drawMeteors() {
      // Spawn new meteor randomly
      if (Math.random() < 0.006) {
        meteors.push(spawnMeteor(canvas.width, canvas.height));
      }
      meteors = meteors.filter(m => m.life < m.maxLife);
      for (const m of meteors) {
        m.life++;
        m.x += m.vx; m.y += m.vy;
        const progress = m.life / m.maxLife;
        const a = progress < 0.2
          ? (progress / 0.2) * m.alpha
          : progress > 0.7
            ? ((1 - progress) / 0.3) * m.alpha
            : m.alpha;

        // Tail gradient
        const tailX = m.x - m.vx * (m.len / Math.sqrt(m.vx * m.vx + m.vy * m.vy));
        const tailY = m.y - m.vy * (m.len / Math.sqrt(m.vx * m.vx + m.vy * m.vy));
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(${hexToRgb(m.color)},${a})`);
        grad.addColorStop(0.5, `rgba(${hexToRgb(m.color)},${a * 0.3})`);
        grad.addColorStop(1, `rgba(${hexToRgb(m.color)},0)`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        // Head glow dot
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Floating achievement tokens ── */
    function drawTokens(W: number, H: number) {
      ctx.textBaseline = 'middle';
      for (let i = 0; i < tokens.length; i++) {
        const tk = tokens[i];
        tk.x += tk.vx;
        tk.y += tk.vy + Math.sin(tk.wobble) * 0.09;
        tk.wobble += tk.wobbleSpeed;
        tk.age++;

        if (tk.x < -300) tk.x = W + 100;
        if (tk.x > W + 300) tk.x = -100;
        if (tk.y < -40) tk.y = H + 20;
        if (tk.y > H + 40) tk.y = -20;

        let alpha = tk.alpha;
        if (tk.age < 80) alpha = tk.alpha * (tk.age / 80);
        else if (tk.age > tk.maxAge - 80) alpha = tk.alpha * ((tk.maxAge - tk.age) / 80);
        if (tk.age > tk.maxAge) { tokens[i] = spawnToken(W, H); continue; }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `${tk.size}px 'Courier New', monospace`;
        ctx.fillStyle = tk.color;
        // Bright tokens get a soft glow
        if (alpha > 0.08) {
          ctx.shadowColor = tk.color;
          ctx.shadowBlur = 10;
        }
        ctx.fillText(tk.text, tk.x, tk.y);
        ctx.restore();
      }
    }

    /* ── Horizontal scan line ── */
    function drawScanLine(W: number, H: number) {
      const y = ((t * 0.25) % (H + 60)) - 30;
      const sg = ctx.createLinearGradient(0, y - 30, 0, y + 30);
      sg.addColorStop(0, 'transparent');
      sg.addColorStop(0.5, 'rgba(245,158,11,0.016)');
      sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg;
      ctx.fillRect(0, y - 30, W, 60);
    }

    /* ── Subtle progress bars top-left ── */
    function drawProgressBars(W: number, H: number) {
      const bx = 36, by = H - 120;
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.font = '9px monospace';
      ctx.fillStyle = '#a78bfa';
      ctx.textBaseline = 'middle';
      ctx.fillText('LC PROGRESS', bx, by - 14);
      BARS.forEach((b, i) => {
        const y = by + i * 22;
        const filled = (b.val / b.max) * 110;
        ctx.globalAlpha = 0.10;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx + 36, y - 5, 110, 10);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = b.color;
        ctx.fillRect(bx + 36, y - 5, filled, 10);
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#c4b5fd';
        ctx.fillText(b.label, bx, y);
        ctx.fillStyle = b.color;
        ctx.fillText(`${b.val}`, bx + 152, y);
      });
      ctx.restore();
    }

    /* ── Main draw loop ── */
    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      t++;

      // Trail
      ctx.fillStyle = 'rgba(4,3,16,0.20)';
      ctx.fillRect(0, 0, W, H);

      drawStars();
      drawNebula(W, H);
      drawConstellation();
      drawMeteors();
      drawTokens(W, H);
      drawScanLine(W, H);
      drawProgressBars(W, H);

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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: 0, pointerEvents: 'none',
      background: 'linear-gradient(135deg, #050210 0%, #080520 40%, #060318 70%, #04020e 100%)',
    }} />
  );
}
