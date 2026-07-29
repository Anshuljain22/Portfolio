import React, { useEffect, useRef } from 'react';

const LOG_LINES = [
  'Epoch  1/50  loss: 2.341  val: 2.489',
  'Epoch  5/50  loss: 1.872  val: 1.934',
  'Epoch 10/50  loss: 1.204  val: 1.312',
  'Epoch 15/50  loss: 0.891  val: 0.943',
  'Epoch 20/50  loss: 0.612  val: 0.688',
  'Epoch 25/50  loss: 0.441  val: 0.512',
  'Epoch 30/50  loss: 0.328  val: 0.401  ← best',
  'Epoch 35/50  loss: 0.271  val: 0.418',
  'Epoch 40/50  loss: 0.238  val: 0.445',
  'Saving checkpoint: model_best.pt',
  'Training complete. best_val_loss=0.401',
];

function lossAt(ep: number, total: number, noiseAmp: number, shift: number) {
  const x = ep / total;
  const base = 2.5 * Math.exp(-3.5 * x) + 0.22;
  const noise = Math.sin(ep * 1.7 + shift) * noiseAmp + Math.cos(ep * 0.9 + shift * 2) * noiseAmp * 0.5;
  return Math.max(0.15, base + noise);
}

export default function LossCurveBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;
    let logOffset = 0;
    let logTimer = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      t++;

      ctx.fillStyle = 'rgba(5,3,16,0.20)';
      ctx.fillRect(0, 0, W, H);

      const EPOCHS = 50;
      const plotW = W * 0.50;
      const plotH = H * 0.36;
      const ox = W * 0.08;
      const oy = H * 0.30 + plotH;

      // Axes
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox, oy - plotH - 20); ctx.lineTo(ox, oy + 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox - 10, oy); ctx.lineTo(ox + plotW + 20, oy); ctx.stroke();

      // Grid
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = 0.5;
      for (let i = 1; i <= 4; i++) {
        const y = oy - (plotH * i / 4);
        ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + plotW, y); ctx.stroke();
      }
      ctx.restore();

      const cycleLen = 400;
      const drawnEpochs = Math.floor(((t % cycleLen) / cycleLen) * EPOCHS) + 1;

      // Train loss
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let ep = 0; ep <= Math.min(drawnEpochs, EPOCHS); ep++) {
        const loss = lossAt(ep, EPOCHS, 0.04, 0);
        const x = ox + (ep / EPOCHS) * plotW;
        const y = oy - (loss / 2.8) * plotH;
        ep === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Val loss
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let ep = 0; ep <= Math.min(drawnEpochs, EPOCHS); ep++) {
        const loss = lossAt(ep, EPOCHS, 0.07, 1.2) * 1.12;
        const x = ox + (ep / EPOCHS) * plotW;
        const y = oy - (loss / 2.8) * plotH;
        ep === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Gradient descent ball
      if (drawnEpochs <= EPOCHS) {
        const ep = drawnEpochs - 1;
        const loss = lossAt(ep, EPOCHS, 0.04, 0);
        const bx = ox + (ep / EPOCHS) * plotW;
        const by = oy - (loss / 2.8) * plotH;
        ctx.save();
        const grd = ctx.createRadialGradient(bx, by, 0, bx, by, 9);
        grd.addColorStop(0, 'rgba(0,255,200,0.85)');
        grd.addColorStop(1, 'rgba(0,255,200,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00ffcc';
        ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Epoch counter label
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#00ffcc';
      ctx.textAlign = 'left';
      ctx.fillText(`epoch: ${Math.min(drawnEpochs, EPOCHS)} / ${EPOCHS}`, ox, oy - plotH - 28);
      ctx.fillStyle = '#a0a0b0';
      ctx.font = '9px monospace';
      ctx.fillText('loss', ox - 28, oy - plotH * 0.5);
      ctx.fillText('epoch', ox + plotW * 0.5, oy + 20);
      ctx.restore();

      // Legend
      ctx.save();
      ctx.globalAlpha = 0.40;
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00ffcc';
      ctx.fillRect(ox + plotW + 14, oy - plotH * 0.82, 14, 1.5);
      ctx.fillStyle = '#c0efe8';
      ctx.fillText('train_loss', ox + plotW + 32, oy - plotH * 0.82 + 1);
      ctx.strokeStyle = '#f472b6';
      ctx.setLineDash([5, 3]); ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ox + plotW + 14, oy - plotH * 0.70);
      ctx.lineTo(ox + plotW + 28, oy - plotH * 0.70);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f4c2d8';
      ctx.fillText('val_loss', ox + plotW + 32, oy - plotH * 0.70 + 1);
      ctx.restore();

      // Scrolling training log
      logTimer++;
      if (logTimer % 130 === 0) logOffset = (logOffset + 1) % LOG_LINES.length;

      const logX = W * 0.65;
      const logY = H * 0.22;
      ctx.save();
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      for (let i = 0; i < LOG_LINES.length; i++) {
        const idx = (logOffset + i) % LOG_LINES.length;
        const fade = i / LOG_LINES.length;
        ctx.globalAlpha = 0.04 + fade * 0.16;
        ctx.fillStyle = LOG_LINES[idx].includes('best') ? '#00ffcc'
          : LOG_LINES[idx].includes('Saving') ? '#a78bfa'
          : '#38bdf8';
        ctx.fillText(LOG_LINES[idx], logX, logY + i * 20);
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      background: 'linear-gradient(160deg, #040212 0%, #050a14 60%, #040212 100%)',
    }} />
  );
}
