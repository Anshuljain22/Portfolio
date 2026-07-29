import React, { useEffect, useRef } from 'react';

// Row/column axis labels (like attention head query/key tokens)
const ROW_LABELS = ['Q: query', 'K: key', 'V: value', 'head₁', 'head₂', 'head₃', 'head₄', 'MHA', 'FFN', 'norm', 'res', 'proj'];
const COL_LABELS = ['embed', 'pos', 'attn', 'drop', 'linear', 'act', 'norm', 'skip', 'pool', 'logit', 'softmax', 'out'];

type Cell = {
  weight: number;     // 0..1 attention weight
  target: number;     // animated target
  speed: number;
};

export default function AttentionHeatmapBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    const ROWS = 12;
    const COLS = 12;
    let cells: Cell[][] = [];
    let W = 0, H = 0;

    function initCells() {
      cells = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => ({
          weight: Math.random(),
          target: Math.random(),
          speed: Math.random() * 0.008 + 0.003,
        }))
      );
    }

    // Interpolate a heat colour from cold (dark blue) → warm (purple) → hot (pink/cyan)
    function heatColor(v: number, alpha: number): string {
      // v: 0..1
      if (v < 0.33) {
        const t = v / 0.33;
        const r = Math.round(10 + t * 60);
        const g = Math.round(5 + t * 10);
        const b = Math.round(40 + t * 100);
        return `rgba(${r},${g},${b},${alpha})`;
      } else if (v < 0.66) {
        const t = (v - 0.33) / 0.33;
        const r = Math.round(70 + t * 80);
        const g = Math.round(15 + t * 5);
        const b = Math.round(140 + t * 60);
        return `rgba(${r},${g},${b},${alpha})`;
      } else {
        const t = (v - 0.66) / 0.34;
        const r = Math.round(150 + t * 100);
        const g = Math.round(20 + t * 50);
        const b = Math.round(200 - t * 50);
        return `rgba(${r},${g},${b},${alpha})`;
      }
    }

    function draw() {
      W = canvas.width; H = canvas.height;
      t++;

      ctx.fillStyle = 'rgba(5,3,16,0.22)';
      ctx.fillRect(0, 0, W, H);

      // Heatmap grid — centred on screen, scaled to fit
      const padding = 80;
      const labelW = 54;
      const gridW = W - padding * 2 - labelW;
      const gridH = H - padding * 2 - labelW;
      const cellW = gridW / COLS;
      const cellH = gridH / ROWS;
      const ox = padding + labelW;  // grid origin x
      const oy = padding + labelW;  // grid origin y

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = cells[r][c];

          // Animate weight toward target
          cell.weight += (cell.target - cell.weight) * cell.speed;
          if (Math.abs(cell.target - cell.weight) < 0.005) {
            cell.target = Math.random();
          }

          // Add wave-based flicker
          const wave = Math.sin(t * 0.025 + r * 0.5 + c * 0.3) * 0.08;
          const v = Math.max(0, Math.min(1, cell.weight + wave));

          const x = ox + c * cellW;
          const y = oy + r * cellH;

          // Cell fill
          ctx.fillStyle = heatColor(v, 0.30);
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

          // Cell border
          ctx.strokeStyle = heatColor(v, 0.08);
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

          // Highlight hottest cells with a glow
          if (v > 0.80) {
            ctx.save();
            ctx.globalAlpha = (v - 0.80) / 0.20 * 0.25;
            ctx.fillStyle = heatColor(1, 1);
            ctx.shadowColor = heatColor(1, 1);
            ctx.shadowBlur = 12;
            ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
            ctx.restore();
          }
        }
      }

      // Row labels
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.font = '9px monospace';
      ctx.fillStyle = '#a78bfa';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let r = 0; r < ROWS && r < ROW_LABELS.length; r++) {
        ctx.fillText(ROW_LABELS[r], ox - 6, oy + r * cellH + cellH / 2);
      }

      // Col labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      for (let c = 0; c < COLS && c < COL_LABELS.length; c++) {
        ctx.fillText(COL_LABELS[c], ox + c * cellW + cellW / 2, oy - 6);
      }

      // Corner label
      ctx.globalAlpha = 0.15;
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#00ffcc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Attention(Q,K,V)', ox, padding - 20);
      ctx.restore();

      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initCells();
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
      background: 'linear-gradient(135deg, #050310 0%, #080518 50%, #050310 100%)',
    }} />
  );
}
