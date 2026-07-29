import React, { useEffect, useRef } from 'react';

// Simulated LLM "thinking" token sequences
const PROMPTS = [
  '> You are a helpful AI assistant...',
  '> Classify the sentiment of: "This model is incredible!"',
  '> Summarize the following research paper...',
  '> Generate a Python function that...',
  '> What is the difference between BERT and GPT?',
  '> Translate the following text to French...',
  '> Explain gradient descent in simple terms.',
];

const RESPONSES = [
  'Sure! I can help with that. Let me think...',
  'Positive ▶ confidence: 0.97',
  'The paper proposes a novel attention mechanism...',
  'def compute_loss(y_pred, y_true):\n    return -torch.mean(y_true * torch.log(y_pred))',
  'BERT is an encoder-only model optimized for...',
  'Voici la traduction demandée...',
  'Gradient descent minimizes loss by iterating: θ ← θ − α∇J(θ)',
];

// Floating dim prompt fragments
const FRAGMENTS = [
  'role: "system"', 'role: "user"', 'role: "assistant"',
  'max_tokens: 512', 'temperature: 0.7', 'top_p: 0.9',
  '"finish_reason": "stop"', '"choices": [...]', '"usage": {...}',
  'stream=True', 'model="gpt-4"', 'n_ctx=4096',
  'input_ids', 'attention_mask', 'past_key_values',
  'logits[:, -1, :]', 'next_token', 'greedy_decode',
];

type Fragment = {
  x: number; y: number;
  vx: number; vy: number;
  text: string;
  alpha: number;
  age: number;
  maxAge: number;
};

function spawnFragment(W: number, H: number): Fragment {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    text: FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)],
    alpha: Math.random() * 0.10 + 0.03,
    age: 0,
    maxAge: Math.random() * 500 + 300,
  };
}

export default function PromptBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    let frags: Fragment[] = [];

    // Typewriter state
    let promptIdx = 0;
    let respIdx = 0;
    let promptCursor = 0;
    let respCursor = 0;
    let phase: 'prompt' | 'thinking' | 'response' | 'pause' = 'prompt';
    let phaseTimer = 0;

    function initFrags() {
      const W = canvas.width, H = canvas.height;
      frags = Array.from({ length: 28 }, () => spawnFragment(W, H));
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      t++;
      phaseTimer++;

      ctx.fillStyle = 'rgba(4,2,14,0.22)';
      ctx.fillRect(0, 0, W, H);

      // ── 1. Floating API fragment cloud ──
      ctx.textBaseline = 'middle';
      for (let i = 0; i < frags.length; i++) {
        const f = frags[i];
        f.x += f.vx; f.y += f.vy; f.age++;
        if (f.x < -200) f.x = W + 80;
        if (f.x > W + 200) f.x = -80;
        if (f.y < -30) f.y = H + 15;
        if (f.y > H + 30) f.y = -15;

        let alpha = f.alpha;
        if (f.age < 60) alpha = f.alpha * (f.age / 60);
        else if (f.age > f.maxAge - 60) alpha = f.alpha * ((f.maxAge - f.age) / 60);
        if (f.age > f.maxAge) { frags[i] = spawnFragment(W, H); continue; }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = '10px monospace';
        ctx.fillStyle = '#1e4a5e';
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
      }

      // ── 2. Central terminal / prompt window ──
      const termX = W * 0.12;
      const termY = H * 0.25;
      const termW = W * 0.76;
      const termH = H * 0.50;

      // Terminal border (very dim)
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 1;
      ctx.strokeRect(termX, termY, termW, termH);

      // Top bar
      ctx.fillStyle = 'rgba(0,255,204,0.04)';
      ctx.fillRect(termX, termY, termW, 22);
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#00ffcc';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('  LLM INFERENCE TERMINAL  ▶  model: gpt-4  ▶  status: ACTIVE', termX + 8, termY + 13);
      ctx.restore();

      // ── Typewriter logic ──
      const PROMPT_SPEED = 3;   // frames per char
      const RESP_SPEED   = 2;
      const THINK_FRAMES = 80;
      const PAUSE_FRAMES = 120;

      if (phase === 'prompt') {
        if (phaseTimer % PROMPT_SPEED === 0) promptCursor++;
        const full = PROMPTS[promptIdx % PROMPTS.length];
        if (promptCursor >= full.length) { phase = 'thinking'; phaseTimer = 0; }
      } else if (phase === 'thinking') {
        if (phaseTimer > THINK_FRAMES) { phase = 'response'; phaseTimer = 0; respCursor = 0; }
      } else if (phase === 'response') {
        if (phaseTimer % RESP_SPEED === 0) respCursor++;
        const full = RESPONSES[promptIdx % RESPONSES.length];
        if (respCursor >= full.length) { phase = 'pause'; phaseTimer = 0; }
      } else if (phase === 'pause') {
        if (phaseTimer > PAUSE_FRAMES) {
          promptIdx++;
          promptCursor = 0;
          respCursor = 0;
          phase = 'prompt';
          phaseTimer = 0;
        }
      }

      const curPrompt  = PROMPTS[promptIdx % PROMPTS.length];
      const curResp    = RESPONSES[promptIdx % RESPONSES.length];
      const shownPrompt = curPrompt.slice(0, promptCursor);
      const shownResp   = (phase === 'response' || phase === 'pause') ? curResp.slice(0, respCursor) : '';
      const blinkOn = Math.floor(t / 25) % 2 === 0;

      ctx.save();
      ctx.globalAlpha = 0.60;
      ctx.textBaseline = 'top';

      // Prompt line
      ctx.font = '13px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText(shownPrompt, termX + 18, termY + 36);
      if (phase === 'prompt' && blinkOn) {
        const pw = ctx.measureText(shownPrompt).width;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(termX + 18 + pw, termY + 36, 7, 13);
      }

      // Thinking dots
      if (phase === 'thinking') {
        const dots = '.'.repeat(Math.floor(phaseTimer / 18) % 4);
        ctx.fillStyle = '#a78bfa';
        ctx.globalAlpha = 0.45;
        ctx.fillText(`  thinking${dots}`, termX + 18, termY + 62);
      }

      // Response
      if (shownResp) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#00ffcc';
        // Handle multiline responses
        const lines = shownResp.split('\n');
        lines.forEach((line, li) => {
          ctx.fillText(`  ${line}`, termX + 18, termY + 62 + li * 20);
        });
        // Blinking cursor at end of response
        if (phase === 'response' && blinkOn) {
          const lastLine = lines[lines.length - 1];
          const lw = ctx.measureText('  ' + lastLine).width;
          ctx.fillStyle = '#00ffcc';
          ctx.fillRect(termX + 18 + lw, termY + 62 + (lines.length - 1) * 20, 7, 13);
        }
      }
      ctx.restore();

      // ── 3. Dim "token probability" bars on the right ──
      const barX = W * 0.82;
      const barY = H * 0.30;
      const barH = H * 0.35;
      const barCount = 8;
      const barSpacing = barH / barCount;

      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.font = '8px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#a78bfa';
      ctx.fillText('next token probs', barX, barY - 14);

      const tokenLabels = ['" the"', '" and"', '" is"', '" a"', '" of"', '" to"', '" in"', '" for"'];
      for (let i = 0; i < barCount; i++) {
        const prob = Math.max(0.03, 0.55 - i * 0.07 + Math.sin(t * 0.04 + i) * 0.04);
        const bw = prob * 80;
        const by = barY + i * barSpacing;
        ctx.globalAlpha = 0.10;
        ctx.fillStyle = '#a78bfa';
        ctx.fillRect(barX + 52, by, bw, barSpacing - 3);
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#c4b5fd';
        ctx.fillText(tokenLabels[i] ?? '', barX, by + 7);
        ctx.fillStyle = '#a78bfa';
        ctx.fillText((prob * 100).toFixed(1) + '%', barX + 52 + bw + 4, by + 7);
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFrags();
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
      background: 'linear-gradient(160deg, #04020e 0%, #060518 60%, #04020e 100%)',
    }} />
  );
}
