import React, { useState } from 'react';
import s from './Projects.module.css';
import TokenStreamBg from '../components/TokenStreamBg';

type Category = 'ALL' | 'LLM APPS' | 'COMPUTER VISION' | 'GENERATIVE AI' | 'ML PIPELINES' | 'DEVOPS & INFRA';
type Status = 'DEPLOYED' | 'RESEARCH' | 'ARCHIVED';

interface Project {
  name: string;
  category: Exclude<Category, 'ALL'>;
  desc: string;
  tags: string[];
  status: Status;
  github: string;
  demo: string;
}

const PROJECTS: Project[] = [
  { 
    name: 'Securing LLM-Generated Code', 
    category: 'LLM APPS', 
    desc: 'IEEE research project implementing a hybrid vulnerability detection & remediation framework for LLM code, combining static analysis and multi-pass verification (0.871 F1 score).', 
    tags: ['LLM Security', 'Static Analysis', 'Python', 'Gemma', 'IEEE'], 
    status: 'RESEARCH', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'MoMents MoM Generator', 
    category: 'LLM APPS', 
    desc: 'Automated Minutes of Meeting (MoM) system featuring AssemblyAI speech-to-text, pyannote.audio speaker diarization, and fine-tuned T5 models for structured summary & decision extraction (80% manual effort reduction).', 
    tags: ['Python', 'Flask', 'T5 Model', 'AssemblyAI', 'pyannote.audio', 'NLP'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'Self-Hosted Home Server & Home Lab', 
    category: 'DEVOPS & INFRA', 
    desc: 'Repurposed an old Intel i5 laptop into a 24/7 low-cost private server running Ubuntu & Docker Compose. Configured Immich, Pi-hole DNS ad-blocking, Caddy reverse proxy, Portainer, Uptime Kuma, Homarr, and Tailscale remote access.', 
    tags: ['Ubuntu', 'Docker', 'Tailscale', 'Caddy', 'Pi-hole', 'Immich', 'Portainer'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'ConvLSTM Climate Temperature Forecaster', 
    category: 'ML PIPELINES', 
    desc: 'Built multi-step temperature forecasting model at C-DAC using ConvLSTM and LSTM on 40+ years of NCMRWF climate data, predicting 3-hour ahead values for Pune region.', 
    tags: ['ConvLSTM', 'LSTM', 'NetCDF', 'Random Forest', 'Python'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'Jutsu Vision — Real-time AR Engine', 
    category: 'COMPUTER VISION', 
    desc: 'Real-time Naruto-themed AR app using MediaPipe pose & hand landmark tracking with OpenCV. Detects hand signs (Shadow Clone, Rasengan, Chidori, Fireball) with person segmentation and streams overlay via Flask.', 
    tags: ['MediaPipe', 'OpenCV', 'Python', 'Flask', 'Computer Vision', 'AR'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'Tomato Plant Disease Detection', 
    category: 'COMPUTER VISION', 
    desc: 'Developed a CNN model using ResNet152V2 to classify 10+ tomato plant diseases with 98% accuracy on 2,500+ Kaggle images. Built full-stack system with Flask backend.', 
    tags: ['Python', 'ResNet152V2', 'CNN', 'Flask', 'OpenCV'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'Indian Food Knowledge Assistant', 
    category: 'LLM APPS', 
    desc: 'Specialized Indian food expert chatbot using Langchain & Hugging Face Gemma 2-9b with RAG via ChromaDB. Features voice-to-text, user profiles, and nutritional tracking.', 
    tags: ['LangChain', 'Gemma 2-9b', 'RAG', 'ChromaDB', 'Embeddings'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
  { 
    name: 'Gans AI Image Generation', 
    category: 'GENERATIVE AI', 
    desc: 'Generative Adversarial Network (GAN) built with PyTorch to generate synthetic MNIST digit images with custom generator & discriminator and TensorBoard visualization.', 
    tags: ['PyTorch', 'GAN', 'TensorBoard', 'Deep Learning'], 
    status: 'DEPLOYED', 
    github: 'https://github.com/Anshuljain22', 
    demo: 'https://github.com/Anshuljain22' 
  },
];

const CAT_COLORS: Record<string, string> = {
  'LLM APPS': '#00e5a0',
  'COMPUTER VISION': '#3b9eff',
  'GENERATIVE AI': '#a855f7',
  'ML PIPELINES': '#0ff',
  'DEVOPS & INFRA': '#f59e0b',
};

const STATUS_STYLE: Record<Status, string> = {
  DEPLOYED: s.statusDeployed,
  RESEARCH: s.statusResearch,
  ARCHIVED: s.statusArchived,
};

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);

const FILTERS: Category[] = ['ALL', 'DEVOPS & INFRA', 'LLM APPS', 'COMPUTER VISION', 'GENERATIVE AI', 'ML PIPELINES'];

export default function Projects() {
  const [active, setActive] = useState<Category>('ALL');
  const filtered = active === 'ALL' ? PROJECTS : PROJECTS.filter(p => p.category === active);

  return (
    <main>
      <TokenStreamBg />
      <div className="section-wrap">
        <h1 className="section-heading">// 02 PROJECTS</h1>
        <p className="section-sub">Selected missions. Each one a problem solved.</p>

        {/* Filter bar */}
        <div className={s.filterBar}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`${s.filterBtn} ${active === f ? s.filterActive : ''}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={s.grid}>
          {filtered.map(p => (
            <article key={p.name} className={`card ${s.card}`}>
              <div className={s.cardTop}>
                <span className={s.catDot} style={{ background: CAT_COLORS[p.category] }} />
                <span className={`${s.statusBadge} ${STATUS_STYLE[p.status]}`}>{p.status}</span>
              </div>
              <h3 className={s.projName}>{p.name}</h3>
              <p className={s.projDesc}>{p.desc}</p>
              <div className={s.tags}>
                {p.tags.map(t => <span key={t} className={s.tag}>{t}</span>)}
              </div>
              <div className={s.cardLinks}>
                <a href={p.github} className={s.iconLink}><GithubIcon /> GitHub</a>
                <a href={p.demo} className={s.iconLink}><LinkIcon /> Live Demo</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
