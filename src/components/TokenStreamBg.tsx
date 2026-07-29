import React, { useEffect, useRef } from 'react';

// ── NLP / LLM vocabulary tokens that float across the screen ──
const TOKENS = [
  // LLM / Transformer tokens
  '<BOS>', '<EOS>', '<PAD>', '<MASK>', '[CLS]', '[SEP]', '[UNK]',
  'token', 'embed', 'context', 'prompt', 'completion', 'logit', 'beam',
  'nucleus', 'temperature', 'top-p', 'top-k', 'perplexity', 'entropy',
  // NLP terms
  'tokenize', 'lemma', 'bigram', 'trigram', 'n-gram', 'stemming',
  'entity', 'POS-tag', 'co-ref', 'parse', 'syntax', 'semantics',
  // Model names
  'GPT', 'BERT', 'T5', 'LLaMA', 'Mistral', 'Falcon', 'Claude',
  'Gemini', 'Qwen', 'Phi-2', 'Mixtral', 'Vicuna', 'Alpaca',
  // Concepts
  'RAG', 'LoRA', 'QLoRA', 'RLHF', 'PPO', 'DPO', 'SFT',
  'fine-tune', 'embedding', 'vector', 'similarity', 'cosine',
  'hallucination', 'grounding', 'alignment', 'RLHF', 'chain-of-thought',
  // Code tokens
  'import torch', 'nn.Module', 'forward()', 'loss.backward()',
  'optimizer.step()', '.generate()', 'tokenizer', 'pipeline',
];

type StreamToken = {
  x: number;
  y: number;
  speed: number;
  text: string;
  alpha: number;
  size: number;
  color: string;
  highlighted: boolean;  // occasionally a token lights up cyan
  hlTimer: number;
  hlMax: number;
};

type AttentionArc = {
  x1: number; y1: number;
  x2: number; y2: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
};

const STREAM_COLORS = ['#1a4a4a', '#1a2f5e', '#3a1a5e', '#4a1a3a', '#1a3a3a'];
const HL_COLORS    = ['#00ffcc', '#38bdf8', '#a78bfa', '#f472b6'];

function randomToken() {
  return TOKENS[Math.floor(Math.random() * TOKENS.length)];
}

export default function TokenStreamBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;
    let tokens: StreamToken[] = [];
    let arcs: AttentionArc[] = [];

    function initTokens() {
      const W = canvas.width;
      const H = canvas.height;
      const ROWS = 14;
      const rowH = H / ROWS;
      tokens = Array.from({ length: ROWS * 3 }, (_, i) => {
        const row = Math.floor(i / 3);
        return {
          x: Math.random() * W,
          y: rowH * row + rowH * 0.5 + (Math.random() - 0.5) * rowH * 0.4,
          speed: Math.random() * 0.5 + 0.25,
          text: randomToken(),
          alpha: Math.random() * 0.12 + 0.04,
          size: Math.random() * 3 + 10,
          color: STREAM_COLORS[Math.floor(Math.random() * STREAM_COLORS.length)],
          highlighted: false,
          hlTimer: 0,
          hlMax: Math.random() * 120 + 60,
        };
      });
    }

    function spawnArc() {
      if (tokens.length < 2) return;
      const a = tokens[Math.floor(Math.random() * tokens.length)];
      const b = tokens[Math.floor(Math.random() * tokens.length)];
      if (a === b) return;
      arcs.push({
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        alpha: 0,
        life: 0,
        maxLife: Math.random() * 120 + 80,
        color: HL_COLORS[Math.floor(Math.random() * HL_COLORS.length)],
      });
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      t++;

      ctx.fillStyle = 'rgba(5,3,16,0.20)';
      ctx.fillRect(0, 0, W, H);

      // Spawn attention arcs occasionally
      if (t % 90 === 0) spawnArc();

      // Draw attention arcs (curved lines between tokens — like attention weights)
      arcs = arcs.filter(arc => arc.life < arc.maxLife);
      for (const arc of arcs) {
        arc.life++;
        const progress = arc.life / arc.maxLife;
        // Fade in then out
        arc.alpha = progress < 0.3
          ? (progress / 0.3) * 0.15
          : progress > 0.7
            ? ((1 - progress) / 0.3) * 0.15
            : 0.15;

        const cpx = (arc.x1 + arc.x2) / 2;
        const cpy = Math.min(arc.y1, arc.y2) - 60 - Math.random() * 40;

        ctx.save();
        ctx.globalAlpha = arc.alpha;
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);
        ctx.quadraticCurveTo(cpx, cpy, arc.x2, arc.y2);
        ctx.stroke();

        // Animated dot travelling along the arc
        const p = (arc.life % arc.maxLife) / arc.maxLife;
        const tx = (1-p)*(1-p)*arc.x1 + 2*(1-p)*p*cpx + p*p*arc.x2;
        const ty = (1-p)*(1-p)*arc.y1 + 2*(1-p)*p*cpy + p*p*arc.y2;
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.fillStyle = arc.color;
        ctx.fill();
        ctx.restore();
      }

      // Draw tokens
      ctx.textBaseline = 'middle';
      for (const tok of tokens) {
        tok.x += tok.speed;
        if (tok.x > W + 200) {
          tok.x = -150;
          tok.text = randomToken();
        }

        // Randomly highlight
        tok.hlTimer++;
        if (!tok.highlighted && tok.hlTimer > tok.hlMax) {
          tok.highlighted = true;
          tok.hlTimer = 0;
          tok.hlMax = Math.random() * 300 + 200;
        }
        if (tok.highlighted && tok.hlTimer > 60) {
          tok.highlighted = false;
          tok.hlTimer = 0;
        }

        const alpha = tok.highlighted ? Math.min(tok.alpha * 4, 0.7) : tok.alpha;
        const color = tok.highlighted
          ? HL_COLORS[Math.floor(Math.random() * HL_COLORS.length) % HL_COLORS.length]
          : tok.color;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `${tok.size}px 'Courier New', monospace`;
        ctx.fillStyle = tok.highlighted ? color : '#336677';
        if (tok.highlighted) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
        }
        ctx.fillText(tok.text, tok.x, tok.y);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initTokens();
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
      background: 'linear-gradient(160deg, #050310 0%, #060a1a 50%, #050310 100%)',
    }} />
  );
}
